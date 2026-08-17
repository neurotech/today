# today

A personal dashboard. Next.js 16 (App Router), Tailwind 4, SQLite.

Feeds are fetched server-side in Server Components and cached, so the browser
does no data fetching. Config is stored in SQLite and edited through Server
Actions.

## Running

```bash
make dev     # next dev on :7000
make start   # build and run the container, daemonised
make logs    # follow container logs
make stop    # stop the container
make clean   # stop and remove the container and image
make prune   # remove dangling images to reclaim disk
make help    # the box with the colours in it
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

Copy `.env.sample` to `.env.local`. Only `DATABASE_PATH` is used, defaulting to
`./data/today.db`. Compose sets it to `/app/data/today.db`.

`./data` is bind-mounted into the container, which runs as uid 1000. The
directory is tracked (via `data/.gitkeep`) so a checkout creates it owned by
you. If Docker ever creates it instead, it will be owned by root and the app
will fail to open the database:

```bash
sudo chown -R 1000:1000 data
```

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
