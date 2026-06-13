import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    TanStackRouterVite(),
    react(),
    tsconfigPaths(),
    tailwindcss(),
  ],
  server: {
    allowedHosts: true,
    host: "0.0.0.0",
    port: 5000,
  },
  build: {
    outDir: "dist",
  },
});
