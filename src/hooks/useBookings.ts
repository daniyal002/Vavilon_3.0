import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosAuth, axiosClassic } from '../api/axios';
import { Booking, CreateBookingDTO, UpdateBookingDTO } from '../types/booking';

export const useBookings = () => {
  const queryClient = useQueryClient();

  // Получение всех бронирований
  const bookingsQuery = useQuery<Booking[]>({
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

  return {
    bookingsQuery,
    useBookingsByPhone,
    useBooking,
    createBookingMutation,
    updateBookingMutation,
    deleteBookingMutation,
  };
};
