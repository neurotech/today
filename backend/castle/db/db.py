import sqlite3

database_path = "/backend/database/castle.db"


def get_connection_and_cursor() -> tuple[sqlite3.Connection, sqlite3.Cursor]:
    connection = sqlite3.connect(database_path)
    cursor = connection.cursor()
    return (connection, cursor)


def initialise_database():
    with open("/backend/castle/db/schema.sql", "r") as file:
        schema_sql = file.read()

    (connection, cursor) = get_connection_and_cursor()
    cursor.executescript(schema_sql)
    connection.commit()
    connection.close()
