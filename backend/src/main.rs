use axum::{
    Json, Router,
    extract::{Path, State},
    http::{HeaderMap, StatusCode},
    routing::get,
};
use serde::{Deserialize, Serialize};
use std::{collections::BTreeMap, time::Duration};
use tokio_rusqlite::{
    Connection,
    rusqlite::{self, OptionalExtension, params},
};

const WEATHER_BASE_URL: &str = "https://www.weatherau.io/api/v1/forecast";

#[derive(Clone)]
struct AppState {
    db: Connection,
    http: reqwest::Client,
}

#[derive(Serialize)]
struct Health {
    status: &'static str,
}

#[derive(Serialize)]
struct ConfigEntry {
    key: String,
    value: String,
}

#[derive(Serialize)]
struct WeatherResponse {
    town: String,
    sky_condition: String,
    min_temp_c: f64,
    max_temp_c: f64,
    storm_outlook: Option<String>,
}

#[derive(Deserialize)]
struct Upstream {
    data: UpstreamData,
}

#[derive(Deserialize)]
struct UpstreamData {
    town: String,
    forecasts: Vec<UpstreamDay>,
}

#[derive(Deserialize)]
struct StormOutlook {
    label: String,
}

#[derive(Deserialize)]
struct UpstreamDay {
    sky_condition: String,
    min_temp_c: f64,
    max_temp_c: f64,
    storm_outlook: Option<StormOutlook>,
}

fn round1(x: f64) -> f64 {
    (x * 10.0).round() / 10.0
}

#[derive(Deserialize)]
struct SetConfig {
    value: String,
}

fn require_env(name: &str) -> String {
    std::env::var(name).unwrap_or_else(|_| panic!("{name} must be set"))
}

async fn health() -> Json<Health> {
    Json(Health { status: "ok" })
}

async fn weather(
    State(state): State<AppState>,
    Path(town): Path<String>,
    headers: HeaderMap,
) -> Result<Json<WeatherResponse>, StatusCode> {
    if town.is_empty() || !town.chars().all(|c| c.is_ascii_alphanumeric() || c == '-') {
        return Err(StatusCode::BAD_REQUEST);
    }

    let api_key = headers.get("x-api-key").ok_or(StatusCode::UNAUTHORIZED)?;

    let url = format!("{WEATHER_BASE_URL}/{town}");

    let resp = state
        .http
        .get(&url)
        .header("X-API-Key", api_key.clone())
        .send()
        .await
        .map_err(|e| {
            eprintln!("weather: request to {url} failed: {e:?}");
            StatusCode::BAD_GATEWAY
        })?;

    let status = resp.status();
    if status == StatusCode::NOT_FOUND {
        return Err(StatusCode::NOT_FOUND);
    }
    if status == StatusCode::UNAUTHORIZED || status == StatusCode::FORBIDDEN {
        return Err(status);
    }
    if !status.is_success() {
        eprintln!("weather: upstream returned {status} for {url}");
        return Err(StatusCode::BAD_GATEWAY);
    }

    let upstream: Upstream = resp.json().await.map_err(|e| {
        eprintln!("weather: could not decode upstream response: {e:?}");
        StatusCode::BAD_GATEWAY
    })?;

    let today = upstream
        .data
        .forecasts
        .into_iter()
        .next()
        .ok_or(StatusCode::BAD_GATEWAY)?;

    Ok(Json(WeatherResponse {
        town: upstream.data.town,
        sky_condition: today.sky_condition,
        min_temp_c: round1(today.min_temp_c),
        max_temp_c: round1(today.max_temp_c),
        storm_outlook: today.storm_outlook.map(|s| s.label),
    }))
}

async fn list_config(
    State(state): State<AppState>,
) -> Result<Json<BTreeMap<String, String>>, StatusCode> {
    let entries = state
        .db
        .call(|conn| -> Result<_, rusqlite::Error> {
            let mut stmt = conn.prepare("SELECT key, value FROM config")?;
            let rows = stmt.query_map([], |row| {
                Ok((row.get::<_, String>(0)?, row.get::<_, String>(1)?))
            })?;
            rows.collect::<Result<BTreeMap<_, _>, _>>()
        })
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    Ok(Json(entries))
}

async fn get_config(
    State(state): State<AppState>,
    Path(key): Path<String>,
) -> Result<Json<ConfigEntry>, StatusCode> {
    let entry = state
        .db
        .call(move |conn| -> Result<_, rusqlite::Error> {
            let entry = conn
                .query_row(
                    "SELECT key, value FROM config WHERE key = ?1",
                    params![key],
                    |row| {
                        Ok(ConfigEntry {
                            key: row.get(0)?,
                            value: row.get(1)?,
                        })
                    },
                )
                .optional()?;
            Ok(entry)
        })
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    entry.map(Json).ok_or(StatusCode::NOT_FOUND)
}

async fn set_config(
    State(state): State<AppState>,
    Path(key): Path<String>,
    Json(body): Json<SetConfig>,
) -> Result<Json<ConfigEntry>, StatusCode> {
    let entry = state
        .db
        .call(move |conn| -> Result<_, rusqlite::Error> {
            conn.execute(
                "INSERT INTO config (key, value) VALUES (?1, ?2)
                 ON CONFLICT(key) DO UPDATE SET value = excluded.value",
                params![key, body.value],
            )?;
            Ok(ConfigEntry {
                key,
                value: body.value,
            })
        })
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    Ok(Json(entry))
}

async fn delete_config(
    State(state): State<AppState>,
    Path(key): Path<String>,
) -> Result<StatusCode, StatusCode> {
    let deleted = state
        .db
        .call(move |conn| -> Result<_, rusqlite::Error> {
            let rows = conn.execute("DELETE FROM config WHERE key = ?1", params![key])?;
            Ok(rows)
        })
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    if deleted == 0 {
        Err(StatusCode::NOT_FOUND)
    } else {
        Ok(StatusCode::NO_CONTENT)
    }
}

#[tokio::main]
async fn main() {
    dotenvy::dotenv().ok();

    let http = reqwest::Client::builder()
        .timeout(Duration::from_secs(10))
        .user_agent("today-backend")
        .build()
        .unwrap();

    let db_path = require_env("DATABASE_PATH");
    let host = require_env("API_HOST");
    let port = require_env("API_PORT");

    let db = Connection::open(db_path).await.unwrap();

    db.call(|conn| -> Result<_, rusqlite::Error> {
        conn.execute_batch(
            "PRAGMA journal_mode = WAL;
             PRAGMA foreign_keys = ON;
             CREATE TABLE IF NOT EXISTS config (
                 key   TEXT PRIMARY KEY,
                 value TEXT NOT NULL
             );",
        )?;
        Ok(())
    })
    .await
    .unwrap();

    let app = Router::new()
        .route("/health", get(health))
        .route("/config", get(list_config))
        .route(
            "/config/{key}",
            get(get_config).put(set_config).delete(delete_config),
        )
        .route("/weather/{town}", get(weather))
        .with_state(AppState { db, http });

    let listener = tokio::net::TcpListener::bind(format!("{host}:{port}"))
        .await
        .unwrap();

    println!("listening on {host}:{port}");
    axum::serve(listener, app).await.unwrap();
}
