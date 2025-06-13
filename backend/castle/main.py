from contextlib import asynccontextmanager
from fastapi import FastAPI

from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware

from config import ConfigValue, get, create, update, delete
from lobsters import get_lobsters
from github import get_github_trending
from scenes import get_scene, hydrate
from properties import get_property
from poe import get_poe_currency
from tasks import start_schedule
from advice import get_advice

from db.db import initialise_database

scheduler = start_schedule()

app = FastAPI()

origins = [
    "http://localhost",
    "http://localhost:7100",
    "http://slab:7000",
    "http://slab:7100",
    "http://lvh.me:7000",
    "http://lvh.me:7100",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


initialise_database()


@app.get("/api/advice")
async def advice():
    return get_advice()


@app.get("/api/poe")
async def poe(league: str, currency: str):
    return get_poe_currency(league, currency)


@app.get("/api/property", response_class=FileResponse)
async def property(address: str):
    result = await get_property(address)
    return result


@app.get("/api/scene")
async def scene(name: str):
    result = await get_scene(name)
    return result


@app.get("/api/github")
async def github():
    result = await get_github_trending()
    return result


@app.get("/api/lobsters")
async def lobsters():
    result = await get_lobsters()
    return result


# Configuration
@app.post("/api/config")
async def create_config(value: ConfigValue):
    await create(value)
    result = await get(value.key)
    return result


@app.patch("/api/config")
async def update_config(value: ConfigValue):
    print(value)
    await update(value)
    result = await get(value.key)
    return result


@app.get("/api/config/{key}")
async def get_config_entity(key: str):
    result = await get(key)
    return result


@app.delete("/api/config/{key}/{id}")
async def delete_property(key: str, id: int):
    await delete(id)
    result = await get(key)
    return result


# # Configuration - Properties
# @app.get("/api/config/properties")
# async def get_properties():
#     result = await get("properties")
#     return result


# @app.delete("/api/config/properties/{id}")
# async def delete_property(id: int):
#     await delete(id)
#     result = await get("properties")
#     return result


# # Configuration - Birthdays
# @app.get("/api/config/birthdays")
# async def get_birthdays():
#     result = await get("birthdays")
#     return result


# @app.delete("/api/config/birthdays/{id}")
# async def delete_config(id: int):
#     await delete(id)
#     result = await get("birthdays")
#     return result


app.mount("/", StaticFiles(directory="dist", html=True), name="frontend")


@asynccontextmanager
async def lifespan(_):
    hydrate()
    yield
    scheduler.shutdown()
