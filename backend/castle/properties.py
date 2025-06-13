import os
import time
from playwright.async_api import async_playwright


def is_directory_empty(path):
    with os.scandir(path) as entries:
        for entry in entries:
            return False
    return True


async def get_property(address: str):
    url = f"https://www.domain.com.au/property-profile/{address}"
    base_path = f"./images/{address}/"

    if not os.path.exists(base_path):
        os.makedirs(base_path)

    if not is_directory_empty(base_path):
        one_hour = 60 * 60
        existing_image_filename = os.listdir(base_path)[0]
        existing_image_path = f"{base_path}{existing_image_filename}"

        base_name = os.path.basename(existing_image_path)
        name_without_extension = int(os.path.splitext(base_name)[0])

        now = int(time.time())

        if now - name_without_extension > one_hour:
            os.remove(existing_image_path)
            image_path = f"{base_path}{now}.png"
            await get_screenshot(url, image_path)
        else:
            image_path = existing_image_path
    else:
        image_path = f"{base_path}{int(time.time())}.png"
        await get_screenshot(url, image_path)

    return image_path


async def get_screenshot(url: str, image_path: str):
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()

        with open(image_path, "w"):
            pass

        await page.goto(url)

        child = page.get_by_text("Property history", exact=True)
        await (
            page.locator("xpath=//section")
            .filter(has=child)
            .locator("ul li")
            .first.screenshot(path=image_path, type="png")
        )

        await browser.close()
