import { mkdirSync } from "node:fs";
import { dirname } from "node:path";
import Database from "better-sqlite3";

// Schema is inlined rather than read from a .sql file. The Python version did
// `open("/backend/today/db/schema.sql")` with an absolute container path, which
// only worked inside Docker. Inlining removes that whole class of bug.
//
// Deliberately identical to backend/today/db/schema.sql, so migrating the
// existing database is a plain file copy with no transform.
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

  // WAL lets reads proceed while a write is in flight. The old code opened and
  // closed a connection per query, which made this moot; a long-lived
  // connection makes it worth setting.
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
 * Opened on first query, not at module evaluation. Eagerly connecting made a
 * root-owned bind mount throw during import, which is an uncaught Server
 * Component error: production Next replaces the message with a generic
 * "Application error", so `permissionHint` only ever reached the container
 * logs. Deferring it lets the caller catch the throw and render the hint.
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
