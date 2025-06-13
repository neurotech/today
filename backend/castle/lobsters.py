import requests


async def get_lobsters():
    response = requests.get("https://lobste.rs/hottest.json").json()
    return response
