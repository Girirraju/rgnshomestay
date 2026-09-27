import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import react from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

// Base URL of the separately deployed backend (e.g. https://my-backend.vercel.app),
// read at build time. When set, /api/* is proxied to it so the site can call
// the API same-origin via VITE_API_URL=/api. Left unset, no proxy is added.
const backendUrl = process.env["BACKEND_URL"]?.replace(/\/+$/, "");

export default defineConfig({
  plugins: [
    tailwindcss(),
    tsconfigPaths(),
    tanstackStart({ server: { entry: "server" } }),
    // Builds the SSR server for the target host. On Vercel the preset is
    // detected automatically and output goes to .vercel/output.
    nitro({
      routeRules: backendUrl ? { "/api/**": { proxy: `${backendUrl}/api/**` } } : {},
    }),
    react(),
  ],
  // Nitro's plugin defaults the dev server to :3000; keep Vite's usual port,
  // which the backend's local CORS_ORIGINS allows.
  server: { port: 5173 },
  resolve: {
    alias: { "@": `${process.cwd()}/src` },
    dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime"],
  },
});
