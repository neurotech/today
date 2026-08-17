"use server";

import { revalidatePath } from "next/cache";
import {
  type ConfigKey,
  createConfig,
  deleteConfig,
  updateConfig,
  type ValueFor,
} from "./config";

// The old SPA sent these to FastAPI over fetch, then refetched the whole list.
// Here they run in-process and `revalidatePath` re-renders the Server Component
// with fresh rows.

export type ActionResult = { ok: true } | { ok: false; error: string };

/**
 * Maps the tile's generic left/right pair back to the key's real field names.
 * Exhaustive over ConfigKey, so adding a key is a compile error until handled.
 */
const toValue = (
  key: ConfigKey,
  left: string,
  right: string,
): ValueFor<ConfigKey> => {
  switch (key) {
    case "birthdays":
      return { person: left, birthdate: right };
  }
};

const run = (work: () => void): ActionResult => {
  try {
    work();
    revalidatePath("/config");
    return { ok: true };
  } catch (error) {
    return { ok: false, error: (error as Error).message };
  }
};

export const createConfigAction = async (
  key: ConfigKey,
  left: string,
  right: string,
): Promise<ActionResult> =>
  run(() => {
    createConfig(key, toValue(key, left, right));
  });

export const updateConfigAction = async (
  id: number,
  key: ConfigKey,
  left: string,
  right: string,
): Promise<ActionResult> =>
  run(() => {
    updateConfig(id, key, toValue(key, left, right));
  });

export const deleteConfigAction = async (id: number): Promise<ActionResult> =>
  run(() => {
    deleteConfig(id);
  });
