import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["icon.svg"],
      manifest: {
        id: "/",
        name: "BlumHelps — Bienestar y hábitos",
        short_name: "BlumHelps",
        description: "Pequeños pasos, recursos confiables y progreso sin castigos.",
        lang: "es-CO",
        start_url: "/",
        scope: "/",
        display: "standalone",
        orientation: "portrait-primary",
        background_color: "#f8f6ef",
        theme_color: "#1c4b3e",
        icons: [{ src: "/manifest-icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any maskable" }]
      },
      workbox: {
        navigateFallback: "/index.html",
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