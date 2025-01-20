// src/utils/pushNotifications.ts

export const subscribeToPushNotifications = async (): Promise<PushSubscription | null> => {
  if (!('serviceWorker' in navigator && 'PushManager' in window)) {
    alert('Push API не поддерживается этим браузером');
    return null;
  }

  const registration = await navigator.serviceWorker.ready;
    // Проверка существующей подписки
    let subscription = await registration.pushManager.getSubscription();

    if (!subscription) {
      // Создание новой подписки, если нет существующей
      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(import.meta.env.VITE_VAPID_PUBLIC),
      });
    }

  return subscription;
};

// Преобразование ключа VAPID в формат Uint8Array
const urlBase64ToUint8Array = (base64String: string): Uint8Array => {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
};
