FROM node:24-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
WORKDIR /app
# `corepack enable` only drops in shims; the pnpm tarball is fetched lazily on
# the first `pnpm` call. `deps` and `build` are siblings off `base`, so neither
# sees the other's corepack cache. Fetching here puts pnpm in one layer both
# stages inherit, so it downloads once and then stays cached.
# `corepack install` takes no version: it reads `packageManager` from
# package.json, which stays the single source of truth.
COPY package.json ./
RUN corepack enable && corepack install

# pnpm-workspace.yaml must be copied: it carries `allowBuilds: better-sqlite3:
# false`, which stops pnpm running an implicit `node-gyp rebuild`. Without it
# the install tries to compile from source and fails here, because node:24-slim
# has no Python or build toolchain. The prebuilt binding is used instead.
FROM base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
# No `RUN --mount=type=cache` for the pnpm store: that is BuildKit-only syntax
# and fails outright on the legacy builder. It only saves re-download time.
RUN pnpm install --frozen-lockfile

FROM base AS build
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Needs network: next/font/google downloads and self-hosts the fonts at build
# time. It does NOT need to reach github.com / lobste.rs / firebaseio.com,
# because every page using them is `force-dynamic`.
RUN pnpm build

FROM base AS runner
ENV NODE_ENV=production
ENV PORT=7000
# Without this the standalone server binds to localhost and is unreachable from
# outside the container.
ENV HOSTNAME=0.0.0.0
ENV DATABASE_PATH=/app/data/today.db

# `output: "standalone"` traces only the modules actually used, including
# better-sqlite3's prebuilt linux binding, so the runner needs no install step
# and no compiler toolchain.
COPY --from=build --chown=node:node /app/.next/standalone ./
COPY --from=build --chown=node:node /app/.next/static ./.next/static
COPY --from=build --chown=node:node /app/public ./public

# Bind-mounted at runtime. Created here so the container still starts without a
# mount, and owned by `node` (uid 1000) to match the host user.
RUN mkdir -p /app/data && chown node:node /app/data

USER node
EXPOSE 7000

CMD ["node", "server.js"]
