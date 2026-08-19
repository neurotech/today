# today

A personal dashboard. Next.js 16 (App Router), Tailwind 4, SQLite.

Feeds are fetched server-side in Server Components and cached, so the browser
does no data fetching. Config is stored in SQLite and edited through Server
Actions.

## Running

```bash
make dev     # next dev on :7000
make check   # tsc --noEmit, then biome check
make start   # build and run the container, daemonised
make deploy  # the same, over ssh on DEPLOY_HOST
make logs    # follow container logs
make stop    # stop the container
make clean   # stop and remove the container and image
make prune   # remove dangling images to reclaim disk
make help    # the box with the colours in it
```

Everything except `dev`, `check` and `deploy` needs a local Docker daemon, and
says so plainly if there is not one rather than failing with a socket error.
That is the normal case when developing in WSL, where `make dev` and `make
deploy` are the two targets that matter.

`make deploy` builds on the remote host instead of locally:

```bash
make deploy DEPLOY_HOST=your-server
```

It runs `git pull --ff-only && docker compose up -d --build` over ssh, so the
branch has to be pushed first, and a diverged checkout on the server fails
loudly rather than opening a merge in a non-interactive shell. To avoid passing
`DEPLOY_HOST` every time, put it in `Makefile.local` (untracked, included
automatically):

```make
DEPLOY_HOST = your-server
DEPLOY_PATH = ~/projects/today
```

Every `make start` rebuild leaves the previous image dangling, so run
`make prune` occasionally. It is deliberately not part of `start`, since it also
discards layers the next build would have reused. `docker system df` shows what
has accumulated.

Docker builds with the legacy builder as well as BuildKit. The container runs a
Next standalone build as an unprivileged user, with `./data` bind-mounted for
the SQLite database.

Compose healthchecks the container against `/api/health`, which answers
`{"ok": true}` and deliberately touches neither the database nor any feed: a
permissions problem on `./data` should show the explanation on the page, not
send `restart: always` into a restart loop.

## Configuration

Copy `.env.sample` to `.env.local`. Only `DATABASE_PATH` is read from it,
defaulting to `./data/today.db`. Compose sets it to `/app/data/today.db`.

The port defaults to 7000 everywhere and is overridden with `PORT`:

```bash
PORT=7100 make dev
```

`PORT` is an environment variable, not a `.env.local` entry: `pnpm dev` expands
it in the shell before Next starts, so Next's own env loading is too late to
affect it. Compose reads it from the shell or from `.env`, and applies it to the
published port, the port inside the container and the healthcheck at once.
Worth knowing on Windows, which reserves blocks of the dynamic port range for
Hyper-V and can take 7000 out from under you.

`./data` is bind-mounted into the container, which runs as uid 1000. The
directory is tracked (via `data/.gitkeep`) so a checkout creates it owned by
you. If Docker ever creates it instead, it will be owned by root and the app
will fail to open the database:

```bash
sudo chown -R 1000:1000 data
```

## Editor

`.vscode/` carries the shared setup: Biome as the formatter and linter, the
workspace TypeScript rather than the one bundled with VS Code, and the Living
Worlds scene data excluded from search. `.gitattributes` normalises everything
to LF, so a file touched from the Windows side does not come back as a
whole-file diff.

## Tabs

| Route | Contents |
|---|---|
| `/` | Living Worlds, GitHub Trending |
| `/reading` | Lobsters, Hacker News |
| `/tools` | Placeholder |
| `/config` | Birthdays |

## Data sources

| Source | How |
|---|---|
| [GitHub Trending](https://github.com/trending) | HTML scrape with `cheerio`, 1 h cache |
| [lobste.rs](https://lobste.rs/) | [hottest.json](https://lobste.rs/hottest.json), 15 min cache |
| Hacker News | [Firebase API](https://github.com/HackerNews/API), 15 min cache |
| [Advice Slip](https://api.adviceslip.com/) | `/api/advice`, uncached |

Refresh buttons are Server Actions that expire the relevant cache tag.

## TODO

* RSS Reader - https://feeds.kottke.org/main - https://palmreport.substack.com/feed
* Birthday notifications (the config side exists, nothing surfaces them yet)


## Removed

* **Path of Exile currency prices.** poe.ninja's `currencyoverview` endpoint
  returns 404 for every league.
* **Domain property screenshots.** domain.com.au returns 403 to automated
  browsers on `/property-profile/`.

## History

Previously a Vite + React SPA with a FastAPI backend, in two containers. See
[MIGRATION.md](MIGRATION.md) for the migration plan, what was verified and the
bugs found along the way.

## Credits

* Cursor from [Zachtronics'](https://www.zachtronics.com/) [Opus Magnum](https://www.zachtronics.com/opus-magnum/)
* Living Worlds is Joseph Huckaby's [Canvas Cycle](https://www.effectgames.com/demos/canvascycle/), art by Mark Ferrari.
  The 19 scene files in `public/living-worlds/scenes/` were recovered from
  effectgames.com and converted from JS object literals to JSON.
