import os
from playwright.async_api import async_playwright
from urllib.parse import urlparse

# import time

# # Get current time as a Unix timestamp
# timestamp = int(time.time())
# print(timestamp)

async def get_property(address: str):
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()
        url = f"https://www.domain.com.au/property-profile/{address}"
        parsed = urlparse(url)
        split = parsed.path.split("/")
        base_path = f"./images/{split[2]}/"
        image_path = f"{base_path}screenshot.png"

        if not os.path.exists(base_path):
            os.makedirs(base_path)

        with open(image_path, 'w'):
            pass

        await page.goto(url)

        child = page.get_by_text("Property history", exact=True)
        await page.locator("xpath=//section").filter(has=child).screenshot(path=image_path)

        await browser.close()

        return image_path
