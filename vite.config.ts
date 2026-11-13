import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";

// https://vite.dev/config/
export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  if (command === "serve" && !env.API_PROXY_TARGET) {
    throw new Error("API_PROXY_TARGET must be set (see .env.example)");
  }

  return {
    plugins: [react(), tailwindcss()],
    server: {
      port: env.DEV_PORT ? Number(env.DEV_PORT) : undefined,
      host: "0.0.0.0",
      allowedHosts: ["slab"],

      proxy: {
        "/api": {
          target: env.API_PROXY_TARGET,
          rewrite: (path: string) => path.replace(/^\/api/, ""),
        },
      },

      watch: {
        awaitWriteFinish: { stabilityThreshold: 50, pollInterval: 10 },
      },
    },
  };
});
