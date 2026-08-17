import { z } from "zod";
import { db } from "./db";

// The old backend/today/config.py had `Literal["properties", "birthdays"]`.
// "properties" went with the Domain screenshot feature, which was cut after
// domain.com.au began returning 403 to automated browsers. Existing
// `properties` rows are left untouched in the database, just unread.
//
// The generic machinery below is kept rather than collapsed, so adding a second
// key later is a two-line change.
export const CONFIG_KEYS = ["birthdays"] as const;
export type ConfigKey = (typeof CONFIG_KEYS)[number];

const birthdayValueSchema = z.object({
  person: z.string(),
  birthdate: z.string(),
});

const valueSchemas = {
  birthdays: birthdayValueSchema,
} as const;

export type BirthdayValue = z.infer<typeof birthdayValueSchema>;

export type Birthday = { id: number; key: "birthdays"; value: BirthdayValue };
export type ConfigEntity = Birthday;

type EntityMap = { birthdays: Birthday };
type EntityFor<K extends ConfigKey> = EntityMap[K];
export type ValueFor<K extends ConfigKey> = z.infer<(typeof valueSchemas)[K]>;

type ConfigRow = { id: number; key: string; value: string };

/**
 * Rows are validated on the way out. A row that fails is skipped with a warning
 * rather than throwing, so one bad record cannot take down the whole page.
 */
const parseRow = <K extends ConfigKey>(
  row: ConfigRow,
  key: K,
): EntityFor<K> | null => {
  let raw: unknown;

  try {
    raw = JSON.parse(row.value);
  } catch {
    console.warn(`config row ${row.id} (${key}): value is not valid JSON`);
    return null;
  }

  const parsed = valueSchemas[key].safeParse(raw);

  if (!parsed.success) {
    console.warn(
      `config row ${row.id} (${key}): ${parsed.error.issues.map((i) => i.message).join(", ")}`,
    );
    return null;
  }

  return { id: row.id, key, value: parsed.data } as EntityFor<K>;
};

export const getConfig = <K extends ConfigKey>(key: K): EntityFor<K>[] => {
  const rows = db
    .prepare("SELECT id, key, value FROM config WHERE key = ?")
    .all(key) as ConfigRow[];

  return rows
    .map((row) => parseRow(row, key))
    .filter((entity): entity is EntityFor<K> => entity !== null);
};

export const createConfig = <K extends ConfigKey>(
  key: K,
  value: ValueFor<K>,
): EntityFor<K> => {
  const parsed = valueSchemas[key].parse(value);

  const result = db
    .prepare("INSERT INTO config (key, value) VALUES (?, ?)")
    .run(key, JSON.stringify(parsed));

  return {
    id: Number(result.lastInsertRowid),
    key,
    value: parsed,
  } as EntityFor<K>;
};

export const updateConfig = <K extends ConfigKey>(
  id: number,
  key: K,
  value: ValueFor<K>,
): EntityFor<K> => {
  const parsed = valueSchemas[key].parse(value);

  const result = db
    .prepare("UPDATE config SET value = ? WHERE id = ? AND key = ?")
    .run(JSON.stringify(parsed), id, key);

  if (result.changes === 0) {
    throw new Error(`config row ${id} (${key}) not found`);
  }

  return { id, key, value: parsed } as EntityFor<K>;
};

/** Returns false when the row did not exist, rather than failing silently. */
export const deleteConfig = (id: number): boolean => {
  const result = db.prepare("DELETE FROM config WHERE id = ?").run(id);

  return result.changes > 0;
};
