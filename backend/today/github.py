import re
import requests
from bs4 import BeautifulSoup


def clean_string(string: str):
    cleaned = string.strip()

    cleaned = re.sub(r"\s+", " ", cleaned)
    cleaned = re.sub(" ", "", cleaned)
    cleaned = re.sub(r"[^a-zA-Z0-9,//\s]", "", cleaned)

    return cleaned


async def get_github_trending():
    response = []
    html = requests.get("https://github.com/trending").text
    soup = BeautifulSoup(html, "html.parser")
    rows = soup.find_all("article")

    for row in rows:
        name_block = row.find("h2").find("a")
        url = f"https://github.com{name_block['href']}"

        repo_split = name_block.get_text(strip=True).replace(" /", " / ").split(" / ")
        repo_owner = repo_split[0]
        repo_name = repo_split[1]

        description_element = row.find("p")
        description = (
            description_element.get_text(strip=True) if description_element else ""
        )
        language_raw = row.find("span", itemprop="programmingLanguage")
        language = language_raw.text if language_raw else None
        stars = clean_string(row.find("svg", attrs={"aria-label": "star"}).parent.text)

        response.append(
            {
                "repo_name": repo_name,
                "repo_owner": repo_owner,
                "description": description,
                "language": language,
                "stars": stars,
                "url": url,
            }
        )

    return response
