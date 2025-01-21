// src/components/BookingNotifications.js
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";

const BookingNotifications = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const ws = new WebSocket(`${import.meta.env.VITE_API_WS}`); // Убедитесь, что порт совпадает с вашим сервером

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
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
  }, []);

  return (
    <div>
      <Toaster />
    </div>
  );
};

export default BookingNotifications;
