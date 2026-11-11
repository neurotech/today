import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
	plugins: [react()],
	server: {
		port: 8000,
		host: "0.0.0.0",
		allowedHosts: ["macbookpro"],
	},
});
