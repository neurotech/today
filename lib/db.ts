import { mkdirSync } from "node:fs";
import { dirname } from "node:path";
import Database from "better-sqlite3";

// Inlined rather than read from a .sql file, so there is no path to resolve at
// runtime and nothing extra to ship into the image.
const SCHEMA = `
CREATE TABLE
  IF NOT EXISTS config (
    id INTEGER PRIMARY KEY,
    key TEXT NOT NULL,
    value TEXT NOT NULL
  );
`;

// Deliberately NOT path.resolve()'d. Turbopack's static analysis treats
// `resolve()` on a dynamic value as filesystem access and responds by tracing
// the entire project into .next/standalone, source files and public/ included.
// better-sqlite3 and mkdirSync both resolve relative paths against cwd anyway,
// and compose passes an absolute path.
const databasePath = process.env.DATABASE_PATH ?? "./data/today.db";

/**
 * A bind-mounted ./data owned by root produces a bare `SQLITE_CANTOPEN` thrown
 * during module evaluation, which says nothing about the cause. Both failure
 * points are wrapped so the message names the fix.
 */
const permissionHint = (action: string, cause: unknown) =>
  new Error(
    `${action} ${databasePath}: ${(cause as Error).message}. ` +
      `In Docker this usually means the ./data bind mount on the host is owned ` +
      `by root while the container runs as uid 1000. Fix with: ` +
      `chown -R 1000:1000 data`,
  );

const openDatabase = () => {
  // The volume mount may hand us an empty directory, or none at all.
  try {
    mkdirSync(dirname(databasePath), { recursive: true });
  } catch (error) {
    throw permissionHint("Cannot create the directory for", error);
  }

  let connection: Database.Database;

  try {
    connection = new Database(databasePath);
  } catch (error) {
    throw permissionHint("Cannot open the database at", error);
  }

  // WAL lets reads proceed while a write is in flight.
  connection.pragma("journal_mode = WAL");
  connection.pragma("foreign_keys = ON");

  connection.exec(SCHEMA);

  return connection;
};

// Next's dev server re-evaluates modules on hot reload. Without a global, each
// reload leaks another open handle to the same file.
const globalForDatabase = globalThis as typeof globalThis & {
  todayDatabase?: Database.Database;
};

let database: Database.Database | undefined;

/**
 * Opened on first query, not at module evaluation. Connecting eagerly would
 * make a root-owned bind mount throw during import, which is an uncaught Server
 * Component error: production Next replaces the message with a generic
 * "Application error", so `permissionHint` would only reach the container logs.
 * Deferring it lets the caller catch the throw and render the hint.
 *
 * A failed open leaves `database` unset, so the next request retries. Fixing
 * the permissions therefore does not need a restart.
 */
export const getDb = (): Database.Database => {
  database ??= globalForDatabase.todayDatabase ?? openDatabase();

  if (process.env.NODE_ENV !== "production") {
    globalForDatabase.todayDatabase = database;
  }

  return database;
};
