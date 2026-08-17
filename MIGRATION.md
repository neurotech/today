# Migration plan: Vite SPA + FastAPI to Next.js

Rebuild `today` as a single Next.js (App Router) application, dropping the Python
backend entirely.

## Assumptions

Stated rather than asked. Change these and the plan changes with them.

1. **Self-hosted**, on the `slab` box, via Docker Compose. Not Vercel. Playwright
   and a local SQLite file both rule out serverless.
2. **Path of Exile is cut**, decided after Phase 0 found the data source dead.
   Not ported, not replaced.
3. **Living Worlds is deferred**, not cut. Its scene files are unrecoverable so
   far, so Phase 7 is parked and the rest of the migration proceeds without it.
4. **domain.com.au property screenshots are kept**, though unverified until
   Phase 5.
5. **One container replaces two.** No Python remains.
6. Tailwind theme, Biome config and all visual design carry over unchanged.

## Target layout

```
today/
  app/
    layout.tsx            # shell: header, tab bar, footer
    page.tsx              # home
    reading/page.tsx
    tools/page.tsx
    config/page.tsx
    api/
      advice/route.ts     # consumed by the living-worlds iframe
      scene/route.ts      # consumed by the living-worlds iframe
      property/route.ts   # returns a PNG
  components/             # Panel, Button, Textbox, Connector, ...
  features/               # GitHub, Lobsters, HackerNews, PathOfExile, ...
  lib/
    db.ts                 # better-sqlite3 connection + schema init
    config.ts             # config table CRUD
    sources/              # github.ts, lobsters.ts, hackernews.ts, advice.ts
    property.ts           # Playwright screenshot + disk cache
  public/living-worlds/   # vendored, unchanged
  data/                   # gitignored: today.db, images/, scenes/
  compose.yaml
  Dockerfile
  Makefile
```

`frontend/` and `backend/` both disappear. The app moves to the repo root.

## Phase 0: pre-flight

**Status: run 2026-08-17 on branch `next-migration`. Two features are dead at
the source.**

### Results

| Check | Result |
|---|---|
| `tsc --noEmit` | **Fails.** 4 errors, all in `Properties.tsx`. |
| `biome check` | 5 errors, all `organizeImports`, all auto-fixable. |
| Lobsters `hottest.json` | **OK.** 200, valid JSON. |
| Hacker News firebase API | **OK.** 200, `topstories.json` and `item/<id>.json` both fine. |
| Advice Slip API | **OK.** 200. |
| GitHub Trending | **Selectors intact**, but see caveat below. |
| poe.ninja currency API | **Dead.** 404. |
| effectgames.com scenes | **Dead.** Site is gone. |
| domain.com.au | **Inconclusive.** Needs a real browser to test. |
| Local `today.db` | Absent. Repo dirs hold only `.keep`. |

### Detail

**tsc fails with 4 errors**, all cascading from the half-finished
genericisation in `Properties.tsx:27`. Confirms the missing-typecheck theory.
Fix during Phase 6, when `useConfig` is deleted anyway.

**biome**: 5 auto-fixable import-order errors in the ConfigTab tree. Run
`biome check --write` once. Not worth fixing on the old code given it is being
deleted, but the ported files should land clean.

**GitHub Trending scrapes fine.** `<article>`, `h2 > a`, `itemprop="programmingLanguage"`
and `aria-label="star"` all still match. Caveat: an unauthenticated request
returned only **7** articles, while `GitHub.tsx` slices to 10 when "more" is
toggled. Either accept a short list or handle it. Port as-is.

**poe.ninja is dead for this use.** `currencyoverview` 404s even for
`league=Standard`, so it is not an expired-league problem. `getindexstate` also
404s. Tried three URL shapes, all 404. They appear to have restructured the API
around PoE 2. The official `api.pathofexile.com/leagues` endpoint still works
and returns current leagues, so league names are obtainable, but the pricing
data source itself needs rediscovering. **Decision required** (see below).

**effectgames.com is gone.** `www.effectgames.com` now serves a static
S3/CloudFront bucket; `scene.php` returns `404 NoSuchKey`. The scene JSON cannot
be re-fetched from source. This is worse than the plan assumed: `loadImage`
(`main.js:139`) fetches that JSON to get the bitmap *and* palette, so with no
JSON the canvas renders **nothing**. Living Worlds is entirely broken in
production today, not merely missing its overlay. archive.org was returning 503
during this check, so recoverability is unconfirmed. **Decision required.**

**domain.com.au returned 403** to a bare curl with a browser user-agent, which
proves nothing either way. Real Playwright with a full browser may well pass.
Untestable until Phase 5, so treat property screenshots as unverified rather
than broken.

**No local data.** `backend/{database,images,scenes}` hold only `.keep`. Back up
`today.db` **from the slab host** before migrating. If it does not exist there
either, there is nothing to migrate and Phase 3 starts empty.

### Decisions taken

1. **Path of Exile: cut.** The data source is gone and finding a replacement is
   a research task, not a migration task. Not ported, not replaced. Removal is
   in Phase 9.
2. **Living Worlds: deferred.** Scene JSON recovery is parked, not abandoned.
   Phase 7 blocks nothing else, so the migration proceeds without it and the
   feature can be revived whenever the files turn up.

Both occupied a fixed 373px column in the home grid
(`grid-cols-[373px_1fr_0.75fr_373px]`: Living Worlds column 1, PoE column 4),
so home needs relaying regardless. See Phase 6.

## Phase 1: scaffold

**Status: done.** Versions installed: **Next 16.3.1, React 19.2.8, Tailwind
4.3.3, TypeScript 5.9.3, Biome 2.0.6** (pinned to match the old config's schema).

- [x] New Next app at the repo root. App Router, TypeScript, no `src/` dir.
- [x] Tailwind 4 via `@tailwindcss/postcss`. `frontend/src/index.css` copied
      verbatim to `app/globals.css`: `@theme` block, velvet palette,
      `.connector`, `.wobble`, `flow` and `fade-in` keyframes.
- [x] Biome config at the repo root. Workspace file renamed.
- [x] Fonts via `next/font/google`. Self-hosted, zero requests to
      `fonts.googleapis.com`, 2 `@font-face` rules emitted.
- [x] `next.config.ts` with `output: "standalone"` and
      `serverExternalPackages: ["better-sqlite3", "playwright"]`, declared ahead
      of Phases 3 and 5.
- [x] `typecheck` script, verified non-trivially (see below).

### How it was done

`create-next-app` **refuses a non-empty directory** and the repo root has
`README.md`, `Makefile`, `compose.yaml` etc. Scaffold into a temp dir, then copy
`app/`, `next.config.ts`, `next-env.d.ts`, `postcss.config.mjs`, `tsconfig.json`,
`pnpm-workspace.yaml` and `package.json` to the root. Skip the generated
`README.md`, `AGENTS.md`, `CLAUDE.md`, `public/*.svg` and `app/favicon.ico`.

### Gotchas hit

1. **`tsconfig.json` and `biome.json` must exclude `frontend/` and `backend/`.**
   The scaffold's `include` is `**/*.ts(x)`, which happily picks up the old
   broken SPA and reports its 4 pre-existing errors as if they were new. Both
   configs now exclude those trees explicitly.
2. **`frontend/biome.json` had to go.** Biome 2 refuses two root configs
   ("Found a nested root configuration"). Setting `"root": false` on it silences
   the error but makes Biome treat `frontend/` as a nested project and lint it
   anyway, defeating the exclude. Deleting it was the only clean fix. Root
   config now governs; Biome checks 4 files instead of 43.
3. **The typecheck gate was verified with a deliberate probe**, not just a green
   run, given the old repo's `tsc --noEmit` was a silent no-op. A file with
   `const x: number = "string"` correctly failed the script, then was removed.
   In the **old** repo `tsc --noEmit` exits 0 without checking anything, because
   the root `tsconfig.json` is `"files": []` plus project references; only
   `tsc -b` is real there. Never cite a green `tsc --noEmit` against
   `frontend/` as evidence.
4. **Ports**: `dev` and `start` both on 7000, matching the single-service target
   in Phase 8. The old split (7000 backend, 7100 frontend) is gone.
5. `.gitignore` was Python-only at the root and had no `node_modules` or
   `.next`. Appended a Node/Next section plus `/data/`.

### Verified

`pnpm build` compiles, typechecks and prerenders. `pnpm check` clean.
`.next/standalone/server.js` produced. Server on :7000 returns 200 with
`<title>Today</title>`, the velvet palette, both self-hosted fonts and the
custom `wobble`/`connector` CSS all present in the bundle.

Note: `fade-in` is absent from the built CSS. Expected, not a fault. Tailwind 4
only emits `--animate-fade-in` once something uses `animate-fade-in`, and no
component does yet.

## Phase 2: shared components

**Status: done.** 11 components ported to `components/`, all verbatim except the
one fix noted below. `@heroicons/react` 2.2.0 added.

| Component | Client? | Notes |
|---|---|---|
| `Panel` | no | Pure props. Keeps the `loading`/`error` props for now; they get simpler in Phase 4. |
| `HorizontalRule`, `Separator`, `ReadingTile`, `Connector`, `Loading` | no | Pure. |
| `Button`, `MoreLessButton`, `RefreshButton`, `TabButton`, `Textbox` | yes | `onClick` / `onChange`. |

- [x] All 11 ported. Styling untouched, so Phase 6 should land pixel-identical.
- [x] `ReadingTile` hostname guarded (the one behaviour change).
- [x] `TabButton` moved to `components/`, from `features/Tabs/`.

### The one behaviour change

`ReadingTile` called `new URL(url).hostname` bare during render. It throws on a
malformed URL, and since Lobsters and Hacker News both supply the URL, one bad
item would take down the entire list. Now wrapped: on failure the hostname
`<aside>` is omitted and the tile still renders its title and link. Verified
with a deliberately malformed URL alongside a valid one.

### Verified

Rendered every component through a temporary gallery in the running production
server, with `page.tsx` deliberately left as a **Server Component** so the
server/client boundary was genuinely exercised rather than assumed. All render:
panel heading/loading/error/footer slots, both `ReadingTile` variants, active
and inactive `Connector`, `Loading` (20 wobble spans across two instances), and
all five client components SSR'd correctly including `animate-spin` on the
loading `RefreshButton`. Gallery deleted afterwards; `page.tsx` is a placeholder
again until Phase 6.

### Note for Phase 6

`TabButton` was ported verbatim, meaning it is still a `<button onClick>`.
Phase 6 converts tabs to real routes, so the handler goes away and this gets
wrapped in a `next/link`. The styling is the part worth preserving; the API is
not.

## Phase 3: data layer

**Status: done.** `better-sqlite3` 13.0.3, `zod` 4.4.3.

- [x] `better-sqlite3`. Schema unchanged and inlined in `lib/db.ts`, byte-for-byte
      equivalent to `backend/today/db/schema.sql`, so migration stays a file copy.
      Inlining also kills the old absolute-path read
      (`open("/backend/today/db/schema.sql")`), which only worked inside Docker.
- [x] `lib/db.ts`: singleton connection, schema init at import, `journal_mode =
      WAL`, `foreign_keys = ON`. Cached on `globalThis` in dev so Next's hot
      reload does not leak a handle per reload.
- [x] Path from env: `DATABASE_PATH`, default `./data/today.db`. Parent dir is
      created if missing, since the volume mount may arrive empty.
- [x] `lib/config.ts`: `getConfig`, `createConfig`, `updateConfig`,
      `deleteConfig`, with zod schemas per key.
- [ ] Data migration is a file copy: `backend/database/today.db` to
      `data/today.db`. No transform. **Still outstanding**, and only doable on
      the slab host: no database exists in this repo.

### Design notes

- **zod over a hand-rolled guard.** Values are validated on the way *out* of the
  database as well as in, so a corrupt or legacy row cannot crash a page. A row
  that fails validation is skipped with a `console.warn` naming its id, rather
  than throwing. Verified with deliberately corrupt rows: invalid JSON and a
  wrong-shape object were both skipped and logged while valid rows still
  returned.
- **`getConfig` is generic over the key**, so `getConfig("properties")` returns
  `Address[]` rather than the `ConfigEntity` union. This is exactly what the
  abandoned `useConfig<Address, Address[]>()` genericisation was reaching for,
  and it removes the need for the `isAddress`/`isBirthday` type guards the old
  `ConfigTile` used.
- **`updateConfig` is scoped by key as well as id**, so a birthdays update
  cannot silently overwrite a properties row. The Python version keyed on id
  alone.
- **`deleteConfig` returns a boolean** instead of failing silently on a missing
  row, and ids are `number` throughout (the old SPA typed them
  `string | undefined`).

### Verified

Exercised through a temporary route handler inside the running production
server, not just in isolation, since the real risk was the native module under
Next rather than the library itself. Create, read, update, delete, cross-key
rejection, bad-shape rejection and corrupt-row tolerance all pass. WAL files
appear alongside the db. The route was deleted afterwards.

### Gotchas hit

1. **`better-sqlite3` must have `allowBuilds: false`.** pnpm 11 blocks install
   scripts by default (`ERR_PNPM_IGNORED_BUILDS`), which looks like something to
   fix. It is not. The package has *no* install script, but it does ship a
   `binding.gyp`, so allowing builds makes pnpm run an implicit
   `node-gyp rebuild` that compiles from source and needs Python plus a
   toolchain. That is pointless (v13 ships prebuilt bindings in `prebuilds/`,
   which is what actually loads) and it breaks the Docker build outright, since
   `node:24-slim` has neither. See Phase 8.
2. **App Router private folders.** The verification route was first created at
   `app/api/_phase3_selftest/`, and never registered: a `_` prefix marks a
   *private folder* that opts out of routing. It built clean and 404'd. Watch
   for this in Phase 4.
3. Extensionless imports (`./db`) do not resolve under raw `node`, so the data
   layer cannot be smoke-tested with a plain script. Test through Next.
4. **The root `.gitignore` was silently excluding the entire `lib/` directory.**
   It is Python-derived, and Python gitignores list `lib/` and `lib64/` as build
   artifacts. `git add -A` reported success while adding nothing, and the loss
   would only have surfaced on a fresh clone. Both lines are now removed; the
   backend never had a `lib/` directory, so nothing else relied on them. Worth
   re-checking `git status` after adding any new top-level directory, since
   `build/`, `dist/`, `share/` and `var/` are all still ignored for the same
   reason.

## Phase 4: server-side data sources

This is where the rewrite actually pays. Each source becomes a cached async
function called directly from a Server Component. `useFetch`, `useGitHub`,
`useLobsters`, `useHackerNews`, `usePathOfExile` and every `useEffect(..., [])`
fetch-on-mount all get deleted.

| Source | From | To | Suggested revalidate |
|---|---|---|---|
| GitHub Trending | `github.py`, BeautifulSoup | `lib/sources/github.ts`, cheerio | 1 h |
| Lobsters | `lobsters.py` | `lib/sources/lobsters.ts` | 15 min |
| Hacker News | `useHackerNews.ts` (client!) | `lib/sources/hackernews.ts` | 15 min |
| Advice | `advice.py` | `lib/sources/advice.ts` + route handler | no cache |
| Scene (deferred) | `scenes.py` | route handler reading `data/scenes/*.json` | static |

**Status: done** (except the deferred scene route). `cheerio` 1.2.0,
`date-fns` 4.4.0 added.

- [x] All four live sources ported to `lib/sources/`. `useFetch`, `useGitHub`,
      `useLobsters`, `useHackerNews` and every `useEffect(..., [])`
      fetch-on-mount are gone.
- [x] Refresh buttons are Server Actions in `lib/actions.ts`.
- [x] Hacker News moved server-side.
- [x] `/api/advice` kept at its exact path, uncached.
- [x] `apscheduler` dropped. Nothing replaces it.

### Structure

Each feature is a pair: an async **Server Component** that fetches and formats,
and a **client panel** that owns only `showMore` state. Data crosses the
boundary already prepared.

    features/GitHub/GitHub.tsx        server: fetch + error boundary
    features/GitHub/GitHubPanel.tsx   client: showMore, renders Panel

A failed source renders an error inside its own `Panel` rather than throwing,
matching the old per-panel UX. Each feature is wrapped in `<Suspense>` with a
`<Panel loading />` fallback, which is what keeps Panel's `loading`/`error`
props earning their place.

### Decisions

- **`export const dynamic = "force-dynamic"` on pages using these sources.**
  Without it Next prerenders at build, which would mean the Docker build needs
  network access to github.com, lobste.rs and firebaseio.com, and a source being
  down at build time would bake an error panel into a static page. Confirmed:
  the build reports `ƒ /` and makes no network calls. **Phase 8 depends on
  this** — do not drop it.
- **The fetch Data Cache still applies under `force-dynamic`**, because each
  fetch sets `next: { revalidate, tags }` explicitly. Measured: 1.24 s cold,
  0.041 s warm. Roughly 30x.
- **Dates are formatted on the server**, and the client panels receive strings.
  Formatting in the client would risk a hydration mismatch against the
  server-rendered time.
- **GitHub owner/repo now comes from the anchor's `href`** (`/owner/repo`)
  rather than parsing and splitting the link text on `" / "`. Same result, much
  less brittle.

### Gotchas hit

1. **`revalidateTag` is the wrong API in Next 16, and it is a type error, not a
   silent one.** It now takes a mandatory second `cacheLife` argument and
   expires *lazily*. The right call for a refresh button is **`updateTag(tag)`**:
   Server-Action-only, single argument, immediate expiry with
   read-your-own-writes. The plan said `revalidateTag`; it was wrong.
2. `RefreshButton` wants a sync `onClick` and a `loading` boolean, but a Server
   Action is async and carries no pending state. `components/RefreshAction.tsx`
   bridges the two with `useTransition`, whose pending flag replaces what
   `useFetch`'s `loading` used to supply.

### Verified

All three feeds render live data, no error panels. Counts match expectations:
5 GitHub repos shown, 16 Lobsters tiles, 10 Hacker News tiles.

All three Server Actions invoked directly over HTTP by extracting their ids from
`.next/server/server-reference-manifest.json` and POSTing with a `Next-Action`
header. Each returned 200 and took ~1 s against a 0.04 s warm page, i.e. the tag
expired and the source was genuinely refetched.

`/api/advice` returns 200 and a different slip on each call, confirming it is
uncached.

**The Hacker News more/less bug is fixed and proven**: the footer now reports 10
hidden stories. Under the old code it fetched 10 and computed `slice(10)`, so
the count was always 0 and the footer never rendered at all.

### Known cosmetic issue, inherited

GitHub's footer says "and N more..." where N is `repos.length - 5`, but
expanding only ever shows 10. With 14 repos returned it reads "and 9 more" then
reveals 5. This is a faithful port of the old behaviour, not a new fault. Fixing
it means either capping the label at 5 or letting "more" show everything. Left
alone so the port stays honest; worth deciding in Phase 6.

## Phase 5: property screenshots

**Status: CUT.** The feature was built, then removed once the data source proved
to be blocked. Details below, because the reasoning matters if anyone revisits
it.

The implementation was completed first (Playwright 1.62.1, mtime-based cache,
shared browser instance, slug validation) and it worked as code: route
validation was fully exercised, with missing/empty/traversal/encoded-traversal
and malformed slugs all returning 400 and no filesystem side effects. Only the
capture itself could not succeed, and not for want of correctness.

Three real bugs were found in `properties.py` while porting, worth recording
even though the code is gone:

- **Path traversal.** The slug was interpolated into both a URL and a filesystem
  path, and passed unvalidated to `os.makedirs(f"./images/{address}/")`. So
  `?address=../../etc/passwd` escaped the images directory. **This is still live
  in `backend/` until Phase 9 deletes it.**
- **Filename-encoded timestamps.** Freshness came from
  `int(os.path.splitext(base)[0])`, which throws on any file it did not write
  itself.
- **Zero-byte placeholder.** `get_screenshot` created an empty file *before*
  navigating, so a failed capture left a 0-byte PNG that the freshness check
  then served as a valid cache entry for an hour.

### RESOLVED: domain.com.au blocks automated browsers. The feature is dead.

System dependencies installed with
`sudo env "PATH=$PATH" pnpm exec playwright install-deps chromium` (plain `sudo
pnpm` fails: sudo resets PATH and Node lives in `~/n/bin`). Chromium 151 then
launched fine.

Results:

| Target | Result |
|---|---|
| `domain.com.au/` homepage | **200**, real page |
| `domain.com.au/sale/richmond-vic-3121/` | **403** |
| `domain.com.au/suburb-profile/...` | **403** |
| `domain.com.au/property-profile/<any slug>` | **403 "Access Denied"** |

The 403 is identical for a real-looking slug and a deliberately fake one, so it
is the *route* that is gated, not the address. Three mitigations were tried and
all returned 403:

1. Default headless.
2. Realistic user agent, viewport, `en-AU` locale, Sydney timezone.
3. As above, plus loading the homepage first for cookies and referer.

Anything beyond this means deliberate fingerprint evasion against a site that
has explicitly said no. Not pursued.

**This is rot, not a migration failure.** The feature presumably worked when it
was written in mid-2025; Domain has tightened since. The Python version would
fail the same way today.

### Decision taken: cut

Removed entirely:

- `lib/property.ts`, `app/api/property/route.ts`
- `features/Properties/` (both files)
- `features/Config/PropertiesPanel.tsx`
- `components/Connector.tsx`, which only Properties used
- the `playwright` dependency and its `serverExternalPackages` entry
- the `"properties"` key from the config model

**Existing `properties` rows are left untouched in the database.** They are
simply never read. Nothing is destroyed, so reviving the feature later loses no
data.

The generic config machinery is kept rather than collapsed to a single hardcoded
shape, so adding a key back is a two-line change. `toValue` in
`config-actions.ts` is now an exhaustive `switch` over `ConfigKey`, which also
let the two `as any` casts go: adding a key becomes a compile error until it is
handled.

**Layout consequence.** Home is down to one panel (GitHub) and is now a single
full-width column. Config is two columns (Birthdays, Placeholder) instead of
three. Both are honest reflections of what survived, but home in particular is
worth a design pass once you see it: a lone full-width GitHub panel is wide.

If the capability is ever wanted back, `developer.domain.com.au` offers a proper
keyed API. That is a new feature rather than a migration, and returns data
rather than a screenshot, so the panel would need redesigning.

### Verified after the cut

All four routes still 200. `/api/property` now 404s, `/api/advice` still 200.
No reference to Properties or `/api/property` in any rendered page. Config
renders Birthdays, Placeholder and the add form. Build, typecheck and Biome all
clean.
      This is the main reason the image stays large.

## Phase 6: routes and tabs

**Status: done**, except the Properties panel, which moved to Phase 5 (see
below).

- [x] Tabs are real routes: `/`, `/reading`, `/tools`, `/config`.
- [x] `useLocalStorage` and `activeTab` state gone. The URL is the state.
- [x] `TabBar` uses `next/link` + `usePathname()`, via a new `TabLink`.
- [x] `Today.tsx` split: chrome into `app/layout.tsx`, home grid into
      `app/page.tsx`.
- [x] Home grid relaid to `[1fr_0.75fr]`.
- [x] Header clock is a mount-gated client component.
- [x] Footer and `ZenOfPython` dropped.
- [x] Config tab is Server Components + Server Actions. `useConfig` never
      existed here; `ConfigTile` genericisation finished.

### `TabLink` replaces `TabButton`

Phase 2 ported `TabButton` verbatim knowing this was coming. It is now deleted.
`TabLink` keeps the styling byte-for-byte but derives `isActive` from
`usePathname()` instead of a prop, and renders an `<a>` rather than a `<button>`,
so tabs are linkable, bookmarkable and survive a reload. `aria-selected` is set
from the same comparison.

### The clock is mount-gated, not `suppressHydrationWarning`

The plan offered either. Mount-gating won: server and client format different
instants and potentially different timezones, and `suppressHydrationWarning`
only covers one level of nesting, whereas the clock's date/`Separator`/time
structure is nested deeper. It renders nothing until mounted, with `min-h-6`
holding the header height so nothing shifts.

### Config genericisation, finished

The abandoned attempt tried to make `ConfigTile` generic while still sniffing
entity shape with `isAddress`/`isBirthday`. The fix was to move the key-specific
knowledge up: each panel flattens its rows into a `left`/`right` pair plus
placeholders, and `ConfigTile` is then genuinely generic with no type guards at
all. `AddNewAddress` and `AddNewBirthday` collapse into one `AddNewConfig`,
since they differed only in labels and whether the right input is a date.

`rightDisplay` is passed separately from `right` so birthdates can render as
"10 December 1815" while editing still sees the raw `yyyy-MM-dd`. Formatting
happens on the server, keeping date logic out of the client and avoiding a
hydration mismatch.

### Verified

All four routes return 200 and carry the tab bar. The active tab is URL-derived
on every page, confirmed via both `aria-selected` and the active background
class. No `localStorage`, no `activeTab`, no footer, no Zen of Python anywhere in
the output.

Config CRUD was exercised end-to-end through the real Server Actions, invoked
over HTTP with `Next-Action` headers and verified against SQLite after each
step: create a property, create a birthday, update the property, attempt a
cross-key update (correctly rejected, no change), delete the property. The page
then rendered the surviving birthday as "10 December 1815" and showed the empty
prompt for properties.

### Deviation: Properties moved to Phase 5

The plan had the home grid as GitHub + Properties. The Properties panel is
useless without `/api/property`, which Phase 5 builds, so the feature component
ships with the endpoint instead of stranding a half-working panel. Home is
GitHub alone until then. The grid is `[1fr_0.75fr]`, matching the two flexible
tracks the old four-column grid used for exactly these two features.

## Phase 7: living worlds

> **DEFERRED.** Not part of this migration. effectgames.com is gone, so the 20
> scene JSON files cannot be fetched from source, and without them the canvas
> renders nothing. The feature is already dark in production, so deferring it
> costs nothing that is not already lost.
>
> Nothing else depends on this phase. Do the migration without it, leave
> `public/living-worlds/` in place unported, and pick this up if the JSON turns
> up. Everything below is the recipe for that day.

- [ ] **Source the scene JSON.** Retry archive.org (it was 503 during Phase 0)
      for the 20 URLs in `scenes.py`, or find a Canvas Cycle mirror. The
      original work is Joseph Huckaby's, and the demo was widely copied, so a
      mirror is plausible.
- [ ] Commit the recovered JSON to `data/scenes/`. Once committed, the feature
      has no external dependency ever again.
- [ ] Do **not** port `hydrate()` as runtime code. It points at a dead host and
      has never successfully run in production (see Known bugs).
- [ ] Copy `public/living-worlds/` across unchanged. 1732 lines of 2010-era
      global-scoped JS in an iframe, and it should work as-is once the JSON
      exists.
- [ ] One required edit: `main.js` hardcodes `http://slab:7000/api/scene` and
      `http://slab:7000/api/advice`. Make both relative (`/api/scene`,
      `/api/advice`).
- [ ] Verify the canvas actually renders. Nobody has seen this feature work in
      some time, so treat "it rendered" as the acceptance criterion rather than
      assuming a clean port.

## Phase 8: containerisation

**Status: written and functionally verified, but the image has NOT been built.**
Docker is not installed in this WSL distro (no binary, no `/var/run/docker.sock`),
so `docker build` needs to run on your machine.

- [x] Single `Dockerfile`, multi-stage: base, deps, build, runner on
      `node:24-slim`. Copies `.next/standalone`, `.next/static` and `public`.
- [x] ~~Native module gotcha~~ Not needed. better-sqlite3 v13 ships prebuilt
      bindings, and no chromium deps either now that Playwright is cut.
- [x] `compose.yaml` collapsed from two services to one. The shared `static`
      volume is gone.
- [x] Volume: `./data:/app/data`.
- [x] Port: single service on 7000.
- [x] `Makefile`: banner kept, targets rewritten.
- [x] Env: `.env.sample` committed, `DATABASE_PATH` wired.

### How it was verified without Docker

The Dockerfile's runner stage was replicated by hand: copy `.next/standalone`,
overlay `.next/static` and `public`, then run
`PORT=... HOSTNAME=0.0.0.0 DATABASE_PATH=... node server.js`. This exercises the
same artefact the container runs.

Result: all four routes and `/api/advice` return 200, CSS and a self-hosted
woff2 both serve from `.next/static`, and SQLite is created at the container
path with its WAL files.

### Bug caught: standalone was broken, and would have been broken in Docker too

The first run died immediately with:

```
Cannot find module '.../@swc/helpers/esm/_interop_require_default.js'
```

Next's file tracer copied **only the CJS build** of `@swc/helpers` (0 of 112 esm
files), while the standalone server resolves the ESM subpath at startup. This is
a pnpm-layout tracing gap, and it would have produced an image that built
successfully and then crash-looped on boot. Fixed in `next.config.ts`:

```ts
outputFileTracingIncludes: {
  "/**/*": ["./node_modules/.pnpm/@swc+helpers*/node_modules/@swc/helpers/**"],
},
```

108 esm files now trace and the server boots. Worth remembering that a green
`next build` says nothing about whether the standalone output actually runs.

### Other notes

- **`HOSTNAME=0.0.0.0` is required.** The standalone server otherwise binds to
  localhost and is unreachable from outside the container.
- **`next build` needs network**, because `next/font/google` downloads and
  self-hosts the fonts at build time. It does *not* need to reach github.com,
  lobste.rs or firebaseio.com, because every page using them is
  `force-dynamic` (Phase 4).
- **Next's standalone output copies the entire project tree**, including
  `frontend/`, `backend/`, `data/` and a 384 KB `tsbuildinfo`. `.dockerignore`
  excludes all of them from the build context so they never reach the image.
  Phase 9 makes most of this moot.
- **Runs as `node` (uid 1000)**, which matches the host user, so the `./data`
  bind mount is writable without chown games.
- **No `develop.watch` in compose.** The image runs a production standalone
  build; syncing source into it would do nothing. `make dev` runs `next dev`
  locally instead.

### Three fixes from the first real build attempts

1. **`RUN --mount=type=cache` is BuildKit-only** and fails hard on the legacy
   builder with "the --mount option requires BuildKit". The host had no buildx
   plugin, so Compose fell back to the legacy builder. The cache mount only
   saved pnpm re-download time, so it was removed rather than requiring a
   toolchain upgrade. Nothing BuildKit-specific remains: `COPY --from`,
   `COPY --chown` and multi-stage all work on the legacy builder.
2. **The Makefile banner printed raw `\033[...]`.** Some `/bin/sh` `echo`
   builtins do not interpret backslash escapes, and Make uses `/bin/sh`, not
   bash. Every colour-bearing `echo` is now `printf '%b\n'`, which is POSIX and
   behaves consistently. This was pre-existing, inherited from the original
   Makefile, not introduced by the migration.

3. **`allowBuilds: better-sqlite3: true` broke the install.** pnpm ran an
   implicit `node-gyp rebuild` (the package has no install script, but it does
   ship a `binding.gyp`), which needs Python and a compiler. `node:24-slim` has
   neither, so `pnpm install --frozen-lockfile` died with
   `Could not find any Python installation to use`.

   Setting it to **`false`** is the fix, not adding Python. v13 ships prebuilt
   bindings in `prebuilds/` and that is what loads at runtime; no
   `build/Release` is ever produced, locally or in the container. Verified by
   deleting `node_modules`, reinstalling clean with builds disabled, and
   confirming the module loads and runs SQL. This had been masked locally
   because pnpm was blocking the build script anyway.

The build context is 35 kB, confirming `.dockerignore` is doing its job.

### Still to do on a machine with Docker

```bash
make start && make logs
```

Then confirm http://localhost:7000 serves, and that `./data/today.db` appears on
the host.

If cache mounts are wanted back later, install the buildx plugin and restore the
`--mount=type=cache` line; it is a pure speed optimisation.

## Phase 9: decommission

- [ ] Delete `backend/` and `frontend/`.
- [ ] Delete `features/ZenOfPython/`. Do not port it.
- [ ] Drop the `motion` dependency. `ZenOfPython` was its only consumer, so
      nothing else in the app uses it.
- [ ] **Path of Exile, do not port any of:**
      - `frontend/src/features/PathOfExile/` (`PathOfExile.tsx`,
        `CurrencyChip.tsx`, `LeagueChip.tsx`)
      - `frontend/src/hooks/usePathOfExile.ts`
      - `backend/today/poe.py` and the `/api/poe` route in `main.py`
      - the `PathOfExile` import and column in `HomeTab.tsx`
      - the PoE line in `README.md`'s DONE list
      These all disappear with the `frontend/`+`backend/` deletion above, so no
      separate cleanup pass is needed. Listed so nothing gets ported by reflex.
- [ ] Delete `getUrlPrefix.ts`. Same-origin everywhere means no prefix and no
      `http://slab:7000` hardcoding.
- [ ] Delete the CORS config. Single origin.
- [ ] Rename `castle.code-workspace` to `today.code-workspace`. It was missed in
      the rename commit.
- [ ] Update `README.md`.

## Known bugs to fix in transit

Found during analysis. Do not port these across.

1. **`lifespan` is never wired up.** `main.py:104` defines it but never passes it
   to `FastAPI()`. Consequences: scene hydration has never run, so
   `backend/scenes/` holds only `.keep`, so `/api/scene` 500s, so `loadImage`
   gets no bitmap or palette and **Living Worlds renders nothing at all**. Not
   just the overlay, the whole canvas. The scheduler also never shuts down
   cleanly. Worse, the bug is now unfixable in place: effectgames.com went away
   in the meantime, so hydration could not succeed even if it ran (Phase 0).
2. `hydrate()` is `async` but called without `await` in that same dead lifespan.
3. `useConfig<Address, Address[]>()` in `Properties.tsx:27` is a type error.
   Half-finished genericisation from the last commit.
4. Dockerfile pins `python3.12`; `pyproject.toml` requires `>=3.13`.
5. Hacker News "more/less" is dead: the hook fetches 10 stories, then
   `stories.slice(10)` is always empty, so the footer never renders and the
   button does nothing. Fetch 20 and slice at 10.
6. No `tsc` in the build. Add it.

## Risks

| Risk | Severity | Mitigation |
|---|---|---|
| Playwright in Docker: image size, chromium deps, memory | Medium | Do it last, in isolation. It is the one part that can genuinely stall. |
| ~~`better-sqlite3` native build in the Next build~~ | Resolved | Phase 3 verified it end-to-end inside the running server. v13 ships prebuilds, so no compiler toolchain is needed, and `.next/standalone` traces the `.node` binding correctly. |
| ~~Scraped sources already broken~~ | Resolved | Phase 0 confirmed 2 of 5 dead. PoE cut, Living Worlds deferred. The 3 survivors (GitHub, Lobsters, HN) all verified working. |
| Living Worlds never comes back | Accepted | Deferred by decision. The feature is already dark in production, so the downside is realised, not pending. |
| ~~domain.com.au blocks headless Chromium~~ | **Confirmed, feature dead** | Phase 5 tested it properly: `/property-profile/` returns 403 "Access Denied" to any automated browser, for real and fake slugs alike. Three legitimate mitigations failed. Decision required, see Phase 5. |
| Losing config data during the move | Low | Back up `today.db` from the host first. It is a plain file copy. |
| RSC ceremony exceeds the value for a single-user LAN dashboard | Known trade-off | Accepted. The win is consolidation (one runtime, one language, one lockfile), not performance. |

## Sequencing

Phases 1 to 3 are the foundation and should land together. Phase 4 is the bulk of
the value and can ship feature by feature. Phases 5 and 8 are the fiddly
infrastructure ones and belong at the end, where they cannot block the rest.
**Phase 7 is skipped**, and Phase 0 is done.

Rough effort: roughly a day, down from the original 1 to 2. Cutting PoE and
deferring Living Worlds removes two of six home-page features, one data source,
one scraper port and the scene route handler. Phase 5 plus Phase 8 still account
for close to half of what remains.

## Out of scope

Deliberately not included, to keep the migration a migration:

- Path of Exile, cut outright. Reviving it means finding a live pricing source
  first, at which point it is a new feature rather than a migration.
- Living Worlds, deferred. Blocked on recovering the scene JSON. Phase 7 keeps
  the recipe for whenever that happens.
- Tests. There are none today. Worth adding, but afterwards, against a stable
  target.
- The `README.md` TODO items (RSS reader, birthday notifications).
- The `/tools` tab, which is still a placeholder.
- Redesign. Visual output should be pixel-identical when this is done, with the
  one deliberate exception of the removed footer.
