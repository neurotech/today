import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The Docker image copies .next/standalone rather than the whole tree.
  output: "standalone",

  // better-sqlite3 is a native module and must not be bundled into the server
  // build.
  serverExternalPackages: ["better-sqlite3"],

  // Next's file tracer copies only the CJS build of @swc/helpers, but the
  // standalone server resolves the ESM subpath at startup and dies with
  // MODULE_NOT_FOUND. Force the whole package in.
  outputFileTracingIncludes: {
    "/**/*": [
      "./node_modules/.pnpm/@swc+helpers*/node_modules/@swc/helpers/**",
    ],
  },

  async headers() {
    return [
      {
        // Next serves everything in public/ as `public, max-age=0`, so each of
        // these ~1.3 MB scene files (20 MB across the 19) costs a conditional
        // request on every scene change and after every reload. The filename
        // encodes the scene identity and the contents are recovered archive
        // data, so they will never change under a given name.
        //
        // Deliberately limited to scenes/. The rest of living-worlds
        // (main.js, style.css, index.html) is hand-edited and has no content
        // hash in its name, so an immutable year would make any future change
        // invisible until a hard reload. Those keep revalidating.
        source: "/living-worlds/scenes/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
