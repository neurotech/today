import requests


def get_advice():
    contents = requests.get("https://api.adviceslip.com/advice")
    json_data = contents.json()["slip"]

    return {"id": json_data["id"], "advice": json_data["advice"]}
