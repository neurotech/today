"use server";

import { revalidatePath } from "next/cache";
import { ZodError } from "zod";
import {
  type ConfigKey,
  createConfig,
  deleteConfig,
  updateConfig,
  type ValueFor,
} from "./config";

// These run in-process; `revalidatePath` re-renders the Server Component with
// fresh rows.

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

/**
 * A ZodError's `message` is the whole issues array as JSON, which is unreadable
 * on screen. The issue messages are already written for a human, so use those.
 */
const toMessage = (error: unknown): string =>
  error instanceof ZodError
    ? error.issues.map((issue) => issue.message).join(", ")
    : (error as Error).message;

const run = (work: () => void): ActionResult => {
  try {
    work();
    revalidatePath("/config");
    return { ok: true };
  } catch (error) {
    return { ok: false, error: toMessage(error) };
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

export const deleteConfigAction = async (
  id: number,
  key: ConfigKey,
): Promise<ActionResult> =>
  run(() => {
    // `deleteConfig` reports a missing row rather than throwing. Turning that
    // into an error here means the caller sees it, instead of a click that
    // silently does nothing.
    if (!deleteConfig(id, key)) {
      throw new Error(`config row ${id} (${key}) not found`);
    }
  });
