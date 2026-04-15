/// <reference lib="webworker" />

import { clientsClaim } from "workbox-core";
import { ExpirationPlugin } from "workbox-expiration";
import { createHandlerBoundToURL, precacheAndRoute, cleanupOutdatedCaches } from "workbox-precaching";
import { NavigationRoute, registerRoute } from "workbox-routing";
import { CacheFirst, NetworkOnly, StaleWhileRevalidate } from "workbox-strategies";

declare let self: ServiceWorkerGlobalScope &
  typeof globalThis & {
    __WB_MANIFEST: Array<string | { url: string; revision: string | null }>;
  };

type PushPayload = {
  title?: string;
  body?: string;
  url?: string;
  icon?: string;
  badge?: string;
  tag?: string;
  data?: Record<string, unknown> & { url?: string };
};

const STATIC_CACHE_NAME = "vavilon-static-v1";
const IMAGE_CACHE_NAME = "vavilon-images-v1";
const DEFAULT_NOTIFICATION_ICON = "/icon.png";
const DEFAULT_NOTIFICATION_BADGE = "/android-chrome-192x192.png";
const APP_ORIGIN = self.location.origin;
const apiUrl = import.meta.env.VITE_API_URL;
const apiTarget = apiUrl ? new URL(apiUrl, APP_ORIGIN) : null;

self.skipWaiting();
clientsClaim();

// 🚫 Полностью пропускаем /api мимо Service Worker
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // Исключаем API-запросы (как относительные, так и абсолютные)
  if (url.pathname.startsWith('/api')) {
    return; // undefined = не перехватывать, браузер выполнит запрос напрямую
  }
  
  // 🔐 Дополнительно: если API на другом домене (VITE_API_URL)
  if (apiTarget && url.origin === apiTarget.origin) {
    return;
  }
});

precacheAndRoute(self.__WB_MANIFEST);
cleanupOutdatedCaches();

const navigationHandler = createHandlerBoundToURL("/index.html");

registerRoute(
  new NavigationRoute(navigationHandler, {
    denylist: [/^\/api(?:\/|$)/, /\/[^/?]+\.[^/]+$/],
  }),
);

registerRoute(
  ({ request, url }) =>
    url.origin === APP_ORIGIN &&
    ["script", "style", "worker", "font"].includes(request.destination),
  new StaleWhileRevalidate({
    cacheName: STATIC_CACHE_NAME,
  }),
);

registerRoute(
  ({ request, url }) => url.origin === APP_ORIGIN && request.destination === "image",
  new CacheFirst({
    cacheName: IMAGE_CACHE_NAME,
    plugins: [
      new ExpirationPlugin({
        maxEntries: 100,
        maxAgeSeconds: 60 * 60 * 24 * 30,
      }),
    ],
  }),
);

registerRoute(
  ({ url }) => url.origin === APP_ORIGIN && url.pathname.startsWith("/api"),
  new NetworkOnly(),
);

if (apiTarget) {
  registerRoute(
    ({ url }) =>
      url.origin === apiTarget.origin && url.pathname.startsWith(apiTarget.pathname),
    new NetworkOnly(),
  );
}

const parsePushPayload = (data: PushMessageData | null): PushPayload => {
  if (!data) {
    return {};
  }

  try {
    const jsonPayload = data.json();
    return typeof jsonPayload === "object" && jsonPayload !== null
      ? (jsonPayload as PushPayload)
      : { body: String(jsonPayload) };
  } catch {
    try {
      return { body: data.text() };
    } catch {
      return {};
    }
  }
};

self.addEventListener("push", (event) => {
  const payload = parsePushPayload(event.data);
  const notificationUrl = payload.data?.url ?? payload.url ?? "/";
  const title = payload.title?.trim() || "Vavilon";
  const body = payload.body?.trim() || "У вас новое уведомление";

  const options: NotificationOptions = {
    body,
    icon: payload.icon || DEFAULT_NOTIFICATION_ICON,
    badge: payload.badge || DEFAULT_NOTIFICATION_BADGE,
    tag: payload.tag,
    data: {
      ...payload.data,
      url: notificationUrl,
    },
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const targetUrl = new URL(
    typeof event.notification.data?.url === "string" ? event.notification.data.url : "/",
    APP_ORIGIN,
  ).toString();

  event.waitUntil(
    self.clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then(async (clientList: readonly WindowClient[]) => {
        const exactMatch = clientList.find((client: WindowClient) => client.url === targetUrl);

        if (exactMatch) {
          await exactMatch.focus();
          return;
        }

        const appWindow = clientList.find((client: WindowClient) =>
          client.url.startsWith(APP_ORIGIN),
        );

        if (appWindow) {
          await appWindow.navigate(targetUrl);
          await appWindow.focus();
          return;
        }

        await self.clients.openWindow(targetUrl);
      }),
  );
});
