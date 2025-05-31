import json
from fastapi import FastAPI

# from fastapi.staticfiles import StaticFiles
from urllib import request, error
from helpers import get_advice

app = FastAPI()


@app.get("/api/advice")
async def advice():
    return get_advice()


# app.mount("/", StaticFiles(directory="dist", html=True), name="frontend")
