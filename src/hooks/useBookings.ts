import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosAuth, axiosClassic } from '../api/axios';
import { Booking, BookingSummarysByPhone, CreateBookingDTO, UpdateBookingDTO } from '../types/booking';

export const useBookings = () => {
  const queryClient = useQueryClient();

  // Получение всех бронирований
  const useBookingsQuery = () =>
    useQuery<Booking[]>({
      queryKey: ['bookings'],
      queryFn: async () => {
        const { data } = await axiosAuth.get('/bookings');
        return data;
      },
    });

  // Получение бронирований по телефону
  const useBookingsByPhone = (phone: string) => {
    return useQuery<Booking[]>({
      queryKey: ['bookings', 'phone', phone],
      queryFn: async () => {
        const { data } = await axiosAuth.get(`/bookings/phone/${phone}`);
        return data;
      },
      enabled: !!phone,
    });
  };

  // Получение бронирования по ID
  const useBooking = (id: number) => {
    return useQuery<Booking>({
      queryKey: ['booking', id],
      queryFn: async () => {
        const { data } = await axiosAuth.get(`/bookings/${id}`);
        return data;
      },
      enabled: !!id,
    });
  };

  // Создание бронирования (без авторизации)
  const createBookingMutation = useMutation({
    mutationFn: async (bookingData: CreateBookingDTO) => {
      const { data } = await axiosClassic.post('/bookings', bookingData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
  });

  // Обновление бронирования
  const updateBookingMutation = useMutation({
    mutationFn: async ({
      id,
      bookingData,
    }: {
      id: number;
      bookingData: UpdateBookingDTO;
    }) => {
      const { data } = await axiosAuth.put(`/bookings/${id}`, bookingData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
  });

  // Удаление бронирования (без авторизации)
  const deleteBookingMutation = useMutation({
    mutationFn: async ({ id, phone }: { id: number; phone: string }) => {
      await axiosClassic.delete(`/bookings/${id}`, { data: { phone } });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
  });

  const deleteBookingByIdMutation = useMutation({
    mutationFn: async ({ id }: { id: number }) => {
      await axiosAuth.delete(`/bookings/delete/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
  });

  const confirmBookingMutation = useMutation({
    mutationFn: async (id: number) => {
      const { data } = await axiosAuth.patch(`/bookings/${id}/confirm`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
  });

  const useBookingSummariesByPhone = () => {
    return useQuery<BookingSummarysByPhone[]>({
      queryKey: ['summariesByPhone'],
      queryFn: async () => {
        const { data } = await axiosAuth.get("/bookings/summaries/summaries");
        return data;
      },
    });
  }

  // Проверка подтверждений бронирования
const useCheckConfirmation = () => {
  const queryClient = useQueryClient();

  return useMutation<{ bookings: { showTimeId: number; phone: string,confirmation:boolean }[] }, Error, { bookings: { showTimeId: number; phone: string }[] }>({
    mutationFn: async (data) => {
      const { data: confirmations } = await axiosClassic.post('/bookings/check-confirmation', data);
      return confirmations;
    },
    onSuccess: () => {
      // Здесь можно обновить кэш или выполнить другие действия при успешном запросе
      queryClient.invalidateQueries({queryKey:['bookings']});
    },
  });
};

  return {
    useBookingsQuery,
    useBookingsByPhone,
    useBooking,
    useBookingSummariesByPhone,
    useCheckConfirmation,
    createBookingMutation,
    updateBookingMutation,
    deleteBookingMutation,
    confirmBookingMutation,
    deleteBookingByIdMutation,
  };
};
