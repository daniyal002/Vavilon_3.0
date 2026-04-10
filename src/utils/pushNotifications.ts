const isPushSupported = () => {
  return (
    typeof window !== "undefined" &&
    "serviceWorker" in navigator &&
    "PushManager" in window &&
    "Notification" in window
  );
};

const hasStandaloneDisplay = () => {
  return (
    window.matchMedia?.("(display-mode: standalone)").matches ||
    (typeof navigator !== "undefined" && "standalone" in navigator && navigator.standalone === true)
  );
};

export const subscribeToPushNotifications = async (): Promise<PushSubscription | null> => {
  if (!isPushSupported()) {
    console.error("Push API не поддерживается этим браузером");
    return null;
  }

  if (Notification.permission === "denied") {
    console.error("Пользователь запретил push-уведомления");
    return null;
  }

  const isAppleMobileDevice =
    /iPad|iPhone|iPod/.test(window.navigator.userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

  if (isAppleMobileDevice && !hasStandaloneDisplay()) {
    console.warn("На iOS push-уведомления доступны только для установленных PWA");
    return null;
  }

  if (Notification.permission === "default") {
    const permission = await Notification.requestPermission();

    if (permission !== "granted") {
      console.error("Разрешение на push-уведомления не получено");
      return null;
    }
  }

  const vapidPublicKey = import.meta.env.VITE_VAPID_PUBLIC;

  if (!vapidPublicKey) {
    console.error("VITE_VAPID_PUBLIC не задан");
    return null;
  }

  const registration = await navigator.serviceWorker.ready;
  let subscription = await registration.pushManager.getSubscription();

  if (!subscription) {
    subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToArrayBuffer(vapidPublicKey),
    });
  }

  return subscription;
};

const urlBase64ToArrayBuffer = (base64String: string): ArrayBuffer => {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let index = 0; index < rawData.length; index += 1) {
    outputArray[index] = rawData.charCodeAt(index);
  }

  return outputArray.buffer.slice(0);
};
