import XMLParser from "@nodable/flexible-xml-parser";
import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import {
  getConfigEntry,
  listConfigEntries,
  setConfigEntry,
  setup,
} from "./db.js";

type WeatherResponse = {
  town: string;
  sky_condition: string;
  min_temp_c: number;
  max_temp_c: number;
  storm_outlook?: string;
};

const WEATHER_BASE_URL = "https://www.weatherau.io/api/v1/forecast";

const app = new Hono();

const origins = (
  process.env.CORS_ORIGINS ?? "http://macbookpro:4000,http://localhost:4000"
).split(",");

app.use("/*", cors({ origin: origins }));

app.get("/health", (c) => c.text("ok"));

app.get("/config", (c) => {
  const config = listConfigEntries();
  return c.json(config);
});

app.get("/config/:key", (c) => {
  const config = getConfigEntry(c.req.param("key"));
  return c.json(config);
});

app.put("/config/:key", async (c) => {
  const key = c.req.param("key");
  const value = await c.req.json<string>();
  setConfigEntry({ key, value });
  return c.body(null, 204);
});

app.get("/weather/:town", async (c) => {
  const apiKey = c.req.header("X-API-Key");
  if (!apiKey || apiKey === "") return c.body(null, 401);

  const town = c.req.param("town");
  const url = `${WEATHER_BASE_URL}/${town}`;

  const response = await fetch(url, { headers: { "X-API-Key": apiKey } });
  const json = await response.json();
  const today = json.data.forecasts[0];

  const weather: WeatherResponse = {
    town: json.data.town,
    sky_condition: today.sky_condition,
    min_temp_c: Math.round(today.min_temp_c),
    max_temp_c: Math.round(today.max_temp_c),
    storm_outlook: today.storm_outlook?.label,
  };

  return c.json(weather);
});

const fetchAndParse = async (url: string) => {
  const response = await fetch(url);
  const body = await response.text();
  const parser = new XMLParser({ skip: { attributes: false } });
  const xml = parser.parse(body);

  return xml;
};

app.get("/youtube", async (c) => {
  const youTubeConfig = getConfigEntry("youtube");

  if (youTubeConfig.length === 0) return c.json([], 200);

  const channels = JSON.parse(youTubeConfig[0].value?.toString() ?? "[]");
  const promises = channels.map((channel: { channelUrl: string }) =>
    fetchAndParse(channel.channelUrl),
  );
  const results = Promise.all(promises);

  const xml = await results;

  return c.json(xml, 200);
});

serve(
  {
    fetch: app.fetch,
    port: Number(process.env.PORT ?? 9000),
  },
  (info) => {
    setup();
    console.log(`Server is running on http://localhost:${info.port}`);
  },
);
