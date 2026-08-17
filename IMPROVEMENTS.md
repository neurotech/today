# Improvements

Post-migration review of the whole tree, 2026-08-17. `tsc -b` and `biome check`
both pass, `pnpm build` is clean, and all 19 Living Worlds scene slugs in
`public/living-worlds/scenes.js` resolve to a file on disk. What follows is
everything found on top of that.

Grouped by kind, with a proposed order at the end.

## Verified as not a problem

Worth recording, because both looked wrong on inspection:

* **`force-dynamic` does not disable the tagged fetch caches.** In Next 13/14,
  `dynamic = "force-dynamic"` implied `fetchCache: "force-no-store"`, which
  would have made the 1 h GitHub cache and every refresh button useless.
  Measured against the standalone build: `/` takes 1.26 s cold and 0.03 s warm,
  `/reading` 1.16 s then 0.01 s. The `next: { revalidate, tags }` options are
  honoured.
* **Scene slugs.** All 19 `${name}-${month}-${scpt}` combinations in `scenes.js`
  match a file in `scenes/`. No scene 404s.

## A. Bugs

### A1. Config action failures are invisible

`lib/config-actions.ts` carefully returns `{ ok: false, error }`, and no caller
reads it.

* `features/Config/ConfigTile.tsx:45` awaits `updateConfigAction` then calls
  `setEditing(false)` unconditionally, so a rejected save closes the editor and
  looks like it worked. The edited values are still on screen because they are
  local state, so the row appears saved until the next reload.
* `ConfigTile.tsx:51` ignores the delete result entirely.
* `features/Config/AddNewConfig.tsx:32` checks `result.ok` only to decide
  whether to clear the inputs, and drops `result.error`.

Fix: hold the error in state, render it in the tile, and only leave edit mode on
success.

### A2. Birthday values are validated as "is a string"

`birthdayValueSchema` in `lib/config.ts:14` is two bare `z.string()`s, so:

* editing a row to blank saves an empty `person` and an empty `birthdate`
  (`AddNewConfig` guards against empty on create, the update path does not),
* `birthdate` accepts arbitrary text, which is the reason `formatBirthdate` in
  `BirthdaysPanel.tsx:10` needs its try/catch at all.

Fix: `z.string().trim().min(1)` for `person`, `z.iso.date()` for `birthdate`,
and trim in `toValue`. The validation already runs on both the write and read
paths, so this tightens both at once.

### A3. Delete has no confirmation

`ConfigTile.tsx:121` wires the bin icon straight to `deleteConfigAction`. One
stray click destroys a row, with no undo and no confirm. Fix: a two-step
confirm in the tile.

### A4. A failed advice fetch renders the string "undefined"

`public/living-worlds/main.js:389` does `await fetch("/api/advice")` then reads
`json.advice` with no `response.ok` check. `app/api/advice/route.ts` returns
`{ error }` with status 502 when Advice Slip is down, so the overlay shows
"undefined" as the quote. Fix: check `ok`, and leave the previous quote in place
on failure.

### A5. The database permission hint no longer reaches the user

`lib/db.ts` opens the database during module evaluation, so a root-owned bind
mount throws at import time. That is an uncaught Server Component error, and in
production Next replaces the message with a generic "Application error"; the
carefully worded `chown -R 1000:1000 data` hint only appears in
`docker compose logs`. Fix: make `db` lazy (`getDb()`, memoised), which moves
the throw into `getConfig`'s call site, then wrap `BirthdaysPanel` in the same
try/catch the feed features use so the hint lands in `Panel`'s error slot.

### A6. `deleteConfig` is not key-scoped

`updateConfig` narrows with `AND key = ?`; `deleteConfig` (`lib/config.ts:109`)
takes a bare id. Server Actions are public HTTP endpoints, so any row id can be
deleted, including the `properties` rows the migration deliberately preserved.
Fix: pass the key through and scope the `DELETE`, matching `updateConfig`.

## B. Performance

### B1. Scene JSON is served with `max-age=0`

Measured: `Cache-Control: public, max-age=0`, `Content-Length: 1304931` for a
single scene, 20 MB across all 19. Every scene switch is a conditional request;
the ETag saves the download but not the round trip, and nothing survives a
reload. The filenames are content-fixed, so a `headers()` rule in
`next.config.ts` for `/living-worlds/scenes/:path*` with
`max-age=31536000, immutable` removes the traffic outright. Worth doing for the
other static living-worlds assets (`*.js`, cursors) too.

### B2. The clock re-renders 60 times more often than it needs to

`features/Clock/Clock.tsx:29` ticks every 1000 ms to display `hh:mm a`. Fix:
schedule the next tick on the minute boundary.

### B3. `slice().length` to count hidden items

`GitHubPanel.tsx:24`, `HackerNewsPanel.tsx:28` and `LobstersPanel.tsx:28` each
copy the tail of the array just to count it. `Math.max(0, length - VISIBLE)`.
Trivial, but it is the line that was wrong before, so it may as well be obvious.

## C. Semantics and accessibility

### C1. `role="tab"` outside a `tablist`

`components/TabLink.tsx:37` sets `role="tab"` and `aria-selected` on a
`next/link`, but `features/Tabs/TabBar.tsx` renders a plain `<nav>`. A `tab`
must be inside a `tablist`, so this is invalid ARIA rather than a partial
implementation. These are real navigation links, so the correct signal is
`aria-current="page"`; drop the tab roles.

### C2. Heading levels

`app/layout.tsx:30` has the page `<h1>Today</h1>`, `Clock.tsx:38` renders a
second `<h1>` for the date, and every reading tile
(`components/ReadingTile.tsx:32`) and repo card (`GitHubPanel.tsx:42`) is
another `<h1>` nested under a Panel's `<h2>`. One `h1` per document; the tiles
should be `h3` under the panel heading. `Clock` is not a heading at all.

### C3. Panel's error state is unstyled

`components/Panel.tsx:49` renders `<h3>Error: {error}</h3>` outside the padded
content wrapper, with no colour and no padding. This is exactly the state that
shows when a source dies, so it is worth as much care as the happy path.

### C4. No favicon, and every page is titled "Today"

Verified: `/favicon.ico` returns 404 on every page load. Add an `app/icon.svg`,
and per-route `metadata` so `/reading` and `/config` are distinguishable as
browser history entries.

## D. Housekeeping

### D1. `.gitignore` is still the GitHub Python template

204 lines of `__pycache__/`, `htmlcov/`, `celerybeat.pid`, `.venv`, `.mypy_cache`
and so on. It has already cost real time once: its `lib/` entry silently kept
the whole `lib/` directory out of a commit during the migration. Replace with
the Next template plus `/data/*` and `!/data/.gitkeep`.

### D2. Dead CSS in `app/globals.css`

`.connector`, `.connector-active`, `.connector-inactive` and `@keyframes flow`
are unreferenced anywhere in the tree, as are `--animate-fade-in` and its
`@keyframes fade-in`. `.wobble` is live (`components/Loading.tsx`).

### D3. `tsconfig` target is the scaffold default

`target: "ES2017"` against a Node 24 runtime and a current browser. ES2022 is a
better fit. `noUncheckedIndexedAccess` is also worth turning on.

Correction, from doing it: I expected `noUncheckedIndexedAccess` to flag the
boolean-keyed `Record<string, string>` style maps in `Panel`, `Button`,
`TabLink` and `RefreshButton`. It does not. Those lookups all feed a template
literal, and interpolating `string | undefined` is legal, so the compiler stays
silent and the latent hole survives. The maps had to be replaced by hand.
`Panel`'s and `Button`'s turned out to be dead props no caller ever passed, and
`Button`'s `compressed` could not have worked anyway: its `p-[0px]` competed
with a hardcoded `p-1` later in the same class string, and precedence between
two same-specificity utilities depends on their order in the generated
stylesheet, not in the string.

### D4. Biome only checks `.ts` and `.tsx`

`postcss.config.mjs`, `app/globals.css`, `compose.yaml` and every JSON file are
unchecked. Widen `files.includes`, and explicitly exclude
`public/living-worlds/**` (2010-era global-scoped JS that will never lint
clean, and must not be reformatted).

### D5. No container healthcheck

`compose.yaml` sets `restart: always`, which only helps if the process exits. A
wedged Node process reports healthy forever. Add a `healthcheck` hitting a cheap
route so Docker restarts it.

### D6. No tests

Still nothing. The highest-value minimum, all pure functions or in-memory:

* `cleanStars` in `lib/sources/github.ts`, against a saved fixture of the
  trending HTML,
* the Lobsters mapper's empty-url fallback and the Hacker News mapper's
  null/dead-item and missing-url branches,
* `parseRow` skipping invalid JSON and schema failures rather than throwing,
* config CRUD against `new Database(":memory:")`, including A6's key scoping.

## E. Needs a decision, not a patch

* **There is no authentication anywhere.** `createConfigAction`,
  `updateConfigAction` and `deleteConfigAction` are unauthenticated HTTP
  endpoints, and compose publishes `7000` on all interfaces. Nothing regressed
  here (the FastAPI version was the same), but if the port is reachable beyond
  the LAN then anyone can read and destroy the config.
* **`/api/advice` is an uncached open proxy** to api.adviceslip.com. Deliberate,
  so each scene gets a different slip, but anyone who finds it can use this host
  to hammer that API.
* **`MIGRATION.md` is 44 KB of history** sitting in the repo root. Fine to keep,
  possibly better under `docs/`.
* **Carried over from the migration, still outstanding:** merge
  `next-migration` into `main`; stop the old FastAPI backend if it is still
  running, since the path-traversal bug is live in that process; and the one-off
  `docker image rm -f today-backend today-frontend` plus
  `docker volume rm today_static`.

## Proposed order

Each step is one commit, with `tsc -b` and `biome check` between them.

1. **Config correctness.** A1, A2, A3, A5, A6. All in `lib/config.ts`,
   `lib/config-actions.ts`, `lib/db.ts` and the three `features/Config` files,
   so they are one coherent change rather than five.
2. **Living Worlds and caching.** A4, B1. Both touch how the iframe's assets and
   API are served.
3. **Semantics and chrome.** C1 to C4, B2, B3.
4. **Housekeeping.** D1 to D5. No behaviour change, so it can go in or be
   skipped independently of the rest.
5. **Tests.** D6. Last, because steps 1 to 3 change the exact behaviour being
   asserted. Needs a test runner added; vitest is the least intrusive with
   Turbopack.

Step 1 is the only one with user-visible bugs in it. Steps 2 and 3 are
noticeable but cosmetic. Step 4 is a tidy-up that mostly buys back future
debugging time. Step 5 is the real gap, and the only item here that changes
whether the next change to this codebase is safe.
