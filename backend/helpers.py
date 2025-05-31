def get_advice():
    import json
    from urllib import request, error

    try:
        contents = request.urlopen(
            "https://api.adviceslip.com/advice", timeout=20
        ).read()
        json_data = json.loads(contents.decode("utf-8"))["slip"]

    except error.HTTPError as e:
        return {"errorCode": e.code, "errorMessage": e.reason}

    else:
        return {"id": json_data["id"], "advice": json_data["advice"]}
