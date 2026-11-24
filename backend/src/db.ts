import { DatabaseSync } from "node:sqlite";

const database = new DatabaseSync(process.env.DB_PATH ?? "./today.db");
const sql = database.createTagStore();

export type ConfigEntry = {
  key: string;
  value: string;
};

export const setup = () => {
  database.exec(`
    PRAGMA journal_mode = WAL;
    PRAGMA synchronous = NORMAL;
  `);

  database.exec(`
    CREATE TABLE IF NOT EXISTS config (
      key   TEXT PRIMARY KEY,
      value TEXT NOT NULL
    )
  `);
};

export const listConfigEntries = () => {
  const results = sql.all`SELECT * FROM config`;
  const entries: Record<string, string> = Object.fromEntries(
    results.map((o) => [o.key, o.value]),
  );
  return entries;
};

export const getConfigEntry = (key: string) =>
  sql.all`SELECT * FROM config WHERE key = ${key}`;

export const setConfigEntry = (configEntry: ConfigEntry) =>
  sql.run`
  INSERT INTO config (key, value) VALUES (${configEntry.key}, ${configEntry.value})
  ON CONFLICT(key) DO UPDATE SET value = excluded.value
`;
