# Single image replacing the old two-container setup, where the frontend
# container built `dist` into a shared volume and then exited so the backend
# could serve it.

FROM node:24-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
WORKDIR /app

# pnpm-workspace.yaml carries the `allowBuilds` entry for better-sqlite3.
# Without it pnpm silently skips the install script.
FROM base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

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
