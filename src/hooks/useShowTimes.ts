import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosAuth, axiosClassic } from "../api/axios";
import {
  ShowTime,
  CreateShowTimeDTO,
  UpdateShowTimeDTO,
  ShowTimesResponse,
} from "../types/showtime";

export const useShowTimes = () => {
  const queryClient = useQueryClient();

  // Получение всех сеансов для публичной части
  const showTimesQuery = useQuery({
    queryKey: ["showTimes"],
    queryFn: async () => {
      const { data } = await axiosClassic.get<ShowTimesResponse>("/showtimes");
      return data;
    },
  });

  const showAllTimesQuery = () => useQuery({
    queryKey: ["allShowTimes"],
    queryFn: async () => {
      const { data } = await axiosAuth.get<ShowTimesResponse>("/showtimes/getAllShowTimes");
      return data;
    },
  });

  // Получение сеансов с бронированиями для админки
  const useShowTimesWithBookings = () =>
    useQuery({
      queryKey: ["showTimesWithBookings"],
      queryFn: async () => {
        const { data } = await axiosAuth.get(
          "/showtimes/allShowTimesWithBookingCount"
        );
        return data;
      },
    });

  // Создание сеанса
  const createShowTimeMutation = useMutation({
    mutationFn: async (showTimeData: CreateShowTimeDTO) => {
      const { data } = await axiosAuth.post<ShowTime>(
        "/showtimes",
        showTimeData
      );
      return data;
    },
    onSuccess: (newShowTime) => {
      queryClient.setQueryData<ShowTimesResponse>(["allShowTimes"], (oldData) => {
        if (!oldData) {
          return { showTimes: [newShowTime], ENABLE_PROMOCODE: false }; // или true, в зависимости от вашей логики
        }
        return {
          ...oldData, // сохраняем старые данные
          showTimes: [...oldData.showTimes, newShowTime], // добавляем новый сеанс
        };
      });
      queryClient.invalidateQueries({ queryKey: ["showTimesWithBookings"] });
    },
  });

  // Обновление сеанса
  const updateShowTimeMutation = useMutation({
    mutationFn: async ({ id, ...showTimeData }: UpdateShowTimeDTO) => {
      const { data } = await axiosAuth.put<ShowTime>(
        `/showtimes/${id}`,
        showTimeData
      );
      return data;
    },
    onSuccess: (updatedShowTime) => {
      queryClient.setQueryData<ShowTimesResponse>(["allShowTimes"], (oldData) => {
        if (!oldData) return { showTimes: [updatedShowTime], ENABLE_PROMOCODE: false };
        return {...oldData,
          showTimes: oldData.showTimes.map((showTime) =>
          showTime.id === updatedShowTime.id ? updatedShowTime : showTime)};
      });
      queryClient.invalidateQueries({ queryKey: ["showTimesWithBookings"] });
    },
  });

  // Удаление сеанса
  const deleteShowTimeMutation = useMutation({
    mutationFn: async (id: number) => {
      await axiosAuth.delete(`/showtimes/${id}`);
      return id;
    },
    onSuccess: (deletedId) => {
      queryClient.setQueryData<ShowTimesResponse>(["allShowTimes"], (oldData) => {
        if (!oldData) return { showTimes: [], ENABLE_PROMOCODE: false };
        return {...oldData,
          showTimes: oldData.showTimes.filter((showTime) =>
            showTime.id !== deletedId)};
      });
      queryClient.invalidateQueries({ queryKey: ["showTimesWithBookings"] });
    },
  });

  // Проверка бронирования
  const useCheckBooking = (showTimeId: number) =>
    useQuery({
      queryKey: ["booking", showTimeId],
      queryFn: async () => {
        const { data } = await axiosAuth.get(
          `/showtimes/checkBooking/${showTimeId}`
        );
        return data;
      },
      enabled: !!showTimeId,
    });

  // Получение отдельного сеанса
  const useShowTime = (id: number) =>
    useQuery({
      queryKey: ["showTimes", id],
      queryFn: async () => {
        const { data } = await axiosAuth.get<ShowTime>(`/showtimes/${id}`);
        return data;
      },
      enabled: !!id,
    });

  return {
    showTimesQuery,
    useShowTimesWithBookings,
    createShowTimeMutation,
    updateShowTimeMutation,
    deleteShowTimeMutation,
    useCheckBooking,
    useShowTime,
    showAllTimesQuery,
  };
};
