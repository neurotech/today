import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Phase 8: the Docker image copies .next/standalone rather than the whole tree.
  output: "standalone",

  // better-sqlite3 is a native module and must not be bundled into the server
  // build. (playwright was here too, until the property screenshot feature was
  // cut in Phase 5.)
  serverExternalPackages: ["better-sqlite3"],

  // Next's file tracer copies only the CJS build of @swc/helpers, but the
  // standalone server resolves the ESM subpath at startup and dies with
  // MODULE_NOT_FOUND. Force the whole package in.
  outputFileTracingIncludes: {
    "/**/*": [
      "./node_modules/.pnpm/@swc+helpers*/node_modules/@swc/helpers/**",
    ],
  },
};

export default nextConfig;
