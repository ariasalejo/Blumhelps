import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

const base = process.env.GITHUB_PAGES === "true" ? "/Blumhelps/" : "/";

export default defineConfig(() => ({
  base,
  plugins: [
    react(),
    VitePWA({
      base,
      registerType: "autoUpdate",
      includeAssets: ["icon.svg", "manifest-icon.svg"],
      manifest: {
        id: base,
        name: "BlumHelps — Bienestar y hábitos",
        short_name: "BlumHelps",
        description: "Pequeños pasos, recursos confiables y progreso sin castigos.",
        lang: "es-CO",
        start_url: base,
        scope: base,
        display: "standalone",
        orientation: "portrait-primary",
        background_color: "#f8f6ef",
        theme_color: "#1c4b3e",
        icons: [{ src: "manifest-icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any maskable" }]
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,svg,woff2}"],
        cleanupOutdatedCaches: true,
        runtimeCaching: [{
          urlPattern: /\/api\/v1\/resources(?:\?.*)?$/,
          handler: "NetworkFirst",
          options: {
            cacheName: "blumhelps-reviewed-public-resources",
            networkTimeoutSeconds: 3,
            expiration: { maxEntries: 40, maxAgeSeconds: 86400 },
            cacheableResponse: { statuses: [0, 200] }
          }
        }]
      },
      devOptions: { enabled: false }
    })
  ],
  server: {
    host: true,
    port: 5173,
    proxy: { "/api": { target: "http://127.0.0.1:8000", changeOrigin: true } }
  }
}));
