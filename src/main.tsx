import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { registerSW } from "virtual:pwa-register";
import { App } from "./App";
import "./index.css";

const LEGACY_CACHE_NAMES = ["kino-vavilon-cache-v1"];

const cleanupLegacyServiceWorkerState = async () => {
  if (!("serviceWorker" in navigator)) {
    return;
  }

  const registrations = await navigator.serviceWorker.getRegistrations();

  await Promise.all(
    registrations.map(async (registration) => {
      const scriptURL =
        registration.active?.scriptURL ??
        registration.waiting?.scriptURL ??
        registration.installing?.scriptURL;

      if (!scriptURL) {
        return;
      }

      const url = new URL(scriptURL);
      const isLegacyScript = url.pathname.endsWith("/service-worker.js");
      const isCurrentPwaWorker =
        url.pathname.endsWith("/sw.js") || url.pathname.endsWith("/dev-sw.js");

      if (url.origin === window.location.origin && (isLegacyScript || !isCurrentPwaWorker)) {
        await registration.unregister();
      }
    }),
  );

  if (!("caches" in window)) {
    return;
  }

  const cacheNames = await caches.keys();

  await Promise.all(
    cacheNames
      .filter((cacheName) => LEGACY_CACHE_NAMES.includes(cacheName))
      .map((cacheName) => caches.delete(cacheName)),
  );
};

void cleanupLegacyServiceWorkerState().finally(() => {
  registerSW({
    immediate: true,
    onNeedRefresh() {
      console.log("Доступна новая версия приложения");
    },
    onOfflineReady() {
      console.log("Приложение готово для офлайн-работы");
    },
  });
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
