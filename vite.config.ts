import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
  base: "/",
  plugins: [
    react(),
    VitePWA({
      srcDir: "src",
      filename: "sw.ts",
      registerType: "autoUpdate",
      injectRegister: "auto",
      strategies: "injectManifest",
      includeAssets: [
        "favicon.ico",
        "favicon-16x16.png",
        "favicon-32x32.png",
        "apple-touch-icon.png",
        "icon.png",
        "android-chrome-192x192.png",
        "android-chrome-512x512.png",
      ],
      manifest: {
        name: "Vavilon Admin",
        short_name: "Vavilon Admin",
        scope: "/admin/",      // ← ограничиваем область действия
        start_url: "/admin/",  // ← запускаем из админки
        description: "Vavilon - кинотеатр на крыше",
        theme_color: "#ffffff",
        background_color: "#ffffff",
        display: "standalone",
        orientation: "portrait",
        lang: "ru",
        icons: [
          {
            src: "/android-chrome-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/android-chrome-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
      devOptions: {
        enabled: false,
      },
    }),
  ],
  optimizeDeps: {
    exclude: ["lucide-react"],
  },
});
