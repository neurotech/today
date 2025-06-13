import json
import os
import requests
from json_repair import repair_json
from urllib.parse import parse_qs, urlparse

scene_urls = [
    "http://www.effectgames.com/demos/worlds/scene.php?file=V26&month=01January&script=janclrscpt&callback=CanvasCycle.initScene",
    "http://www.effectgames.com/demos/worlds/scene.php?file=V26SNOW&month=01January&script=jansnowscpt&callback=CanvasCycle.initScene",
    "http://www.effectgames.com/demos/worlds/scene.php?file=V19&month=02February&script=febclrscpt&callback=CanvasCycle.initScene",
    "http://www.effectgames.com/demos/worlds/scene.php?file=V19&month=02February&script=febcldyscpt&callback=CanvasCycle.initScene",
    "http://www.effectgames.com/demos/worlds/scene.php?file=V30&month=04April&script=aprclrscpt&callback=CanvasCycle.initScene",
    "http://www.effectgames.com/demos/worlds/scene.php?file=V30RAIN&month=04April&script=aprrainscpt&callback=CanvasCycle.initScene",
    "http://www.effectgames.com/demos/worlds/scene.php?file=V08&month=05May&script=MAYCLRSCPT&callback=CanvasCycle.initScene",
    "http://www.effectgames.com/demos/worlds/scene.php?file=V08&month=05May&script=MAYCLDYSCPT&callback=CanvasCycle.initScene",
    "http://www.effectgames.com/demos/worlds/scene.php?file=V08RAIN&month=05May&script=MAYRAINSCPT&callback=CanvasCycle.initScene",
    "http://www.effectgames.com/demos/worlds/scene.php?file=V20JOE&month=06June&script=jundayscpt&callback=CanvasCycle.initScene",
    "http://www.effectgames.com/demos/worlds/scene.php?file=V25&month=07July&script=julyclearscpt&callback=CanvasCycle.initScene",
    "http://www.effectgames.com/demos/worlds/scene.php?file=V25&month=07July&script=julycloudyscpt&callback=CanvasCycle.initScene",
    "http://www.effectgames.com/demos/worlds/scene.php?file=CORAL&month=08August&script=augclrscpt&callback=CanvasCycle.initScene",
    "http://www.effectgames.com/demos/worlds/scene.php?file=V29&month=09September&script=SEPTCLRCUMSCPT&callback=CanvasCycle.initScene",
    "http://www.effectgames.com/demos/worlds/scene.php?file=V29&month=09September&script=SEPTCLDYSCPT&callback=CanvasCycle.initScene",
    "http://www.effectgames.com/demos/worlds/scene.php?file=V05AM&month=10October&script=octbegclrscpt&callback=CanvasCycle.initScene",
    "http://www.effectgames.com/demos/worlds/scene.php?file=V05AM&month=10October&script=octendclrscpt&callback=CanvasCycle.initScene",
    "http://www.effectgames.com/demos/worlds/scene.php?file=V05RAIN&month=10October&script=octrainscpt&callback=CanvasCycle.initScene",
    "http://www.effectgames.com/demos/worlds/scene.php?file=V16&month=11November&script=novclrscpt&callback=CanvasCycle.initScene",
    "http://www.effectgames.com/demos/worlds/scene.php?file=V16RAIN&month=11November&script=novrainscpt&callback=CanvasCycle.initScene",
]


def count_files(directory: str):
    file_count = 0
    for _, _, files in os.walk(directory):
        file_count += len(files)

    return file_count


async def hydrate():
    scene_path = "/backend/scenes"
    file_count = count_files(scene_path)

    if file_count <= 1:
        print(f"{scene_path} is empty, beginning scene hydration.")

        for url in scene_urls:
            parsed_url = urlparse(url)
            filename = parse_qs(parsed_url.query)["file"][0]
            filepath = f"{scene_path}/{filename}.json"

            print(f"Downloading JSON from {url}...")
            response = requests.get(url)

            print(f"Saving JSON to {filepath}...")
            file = open(filepath, "w")
            data = response.text.replace("CanvasCycle.initScene(", "").replace(");", "")
            fixed = repair_json(data)
            file.write(fixed)
            file.close()
            print(f"Successfully saved JSON to {filepath}.")
    else:
        print(f"{scene_path} is not empty, skipping scene hydration.")


async def get_scene(scene: str):
    scene_file = open(f"/backend/scenes/{scene}.json", "r")
    final = scene_file.read()
    scene_file.close()

    json.dumps(final, sort_keys=True, indent=2, separators=(",", ": "))

    return final
