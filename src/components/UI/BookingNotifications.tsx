import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";

const BookingNotifications = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const webSocketUrl = import.meta.env.VITE_API_WS;

    if (!webSocketUrl) {
      console.warn("VITE_API_WS не задан, realtime-уведомления отключены");
      return;
    }

    let ws: WebSocket;

    try {
      ws = new WebSocket(webSocketUrl);
    } catch (error) {
      console.error("Некорректный URL для WebSocket:", error);
      return;
    }

    ws.onopen = () => {
      console.log("WebSocket соединение установлено");
    };

    ws.onerror = (error) => {
      console.error("Ошибка WebSocket:", error);
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data) as { type?: string };

      if (data.type === "NEW_BOOKING") {
        toast.success("Новая бронь");
        queryClient.invalidateQueries({ queryKey: ["showTimesWithBookings"] });
      }

      if (data.type === "DELETE_BOOKING") {
        queryClient.invalidateQueries({ queryKey: ["showTimesWithBookings"] });
        toast.error("Бронь удалена");
      }
    };

    return () => {
      ws.close();
    };
  }, [queryClient]);

  return (
    <div>
      <Toaster />
    </div>
  );
};

export default BookingNotifications;
