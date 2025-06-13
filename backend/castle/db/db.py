import sqlite3

database_path = "/backend/database/castle.db"


def get_connection_and_cursor() -> tuple[sqlite3.Connection, sqlite3.Cursor]:
    connection = sqlite3.connect(database_path)
    cursor = connection.cursor()
    return (connection, cursor)


def initialise_database():
    (connection, cursor) = get_connection_and_cursor()
    cursor.execute("CREATE TABLE IF NOT EXISTS movie(title, year, score)")
    cursor.execute("INSERT INTO movie VALUES('The Matrix', 1999, 8.7)")
    connection.commit()
    connection.close()


def clean_database():
    (connection, cursor) = get_connection_and_cursor()
    cursor.execute("DELETE FROM movie")
    connection.commit()
    connection.close()
