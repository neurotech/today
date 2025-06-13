import json
from typing import Dict
from pydantic import BaseModel, Field
from db.db import get_connection_and_cursor


class ConfigValue(BaseModel):
    id: int = Field(default=0)
    key: str
    value: Dict


async def create(config_value: ConfigValue):
    (connection, cursor) = get_connection_and_cursor()
    cursor.execute(
        "INSERT INTO config (key, value) VALUES (?, ?);",
        [config_value.key, json.dumps(config_value.value)],
    )
    connection.commit()
    connection.close()


async def get(key: str):
    results = []

    (connection, cursor) = get_connection_and_cursor()
    records = cursor.execute("SELECT * FROM config WHERE key = ?;", [key]).fetchall()
    connection.commit()
    connection.close()

    for result in records:
        results.append(
            {"id": result[0], "key": result[1], "value": json.loads(result[2])}
        )
    return results


async def update(config_value: ConfigValue):
    (connection, cursor) = get_connection_and_cursor()
    cursor.execute(
        "UPDATE config SET value = ? WHERE id = ?;",
        [json.dumps(config_value.value), config_value.id],
    )
    connection.commit()
    connection.close()


async def delete(id: int):
    (connection, cursor) = get_connection_and_cursor()
    cursor.execute(
        "DELETE FROM config WHERE id = ?;",
        [id],
    )
    connection.commit()
    connection.close()
