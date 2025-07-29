import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosAuth, axiosClassic } from '../api/axios';
import { SeatType } from '../types/theater';

export const useSeatTypes = () => {
  const queryClient = useQueryClient();

  const seatTypesQuery = useQuery({
    queryKey: ['seatTypes'],
    queryFn: async () => {
      const { data } = await axiosClassic.get<SeatType[]>('/seat-types');
      return data;
    },
  });

  const createSeatTypeMutation = useMutation({
    mutationFn: async (seatType: Omit<SeatType, 'id'>) => {
      const { data } = await axiosAuth.post<SeatType>('/seat-types', seatType);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['seatTypes'] });
    },
  });

  const updateSeatTypeMutation = useMutation({
    mutationFn: async (seatType: SeatType) => {
      const { data } = await axiosAuth.put<SeatType>(
        `/seat-types/${seatType.id}`,
        seatType
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['seatTypes'] });
    },
  });

  const deleteSeatTypeMutation = useMutation({
    mutationFn: async (id: number) => {
      await axiosAuth.delete(`/seat-types/${id}`);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['seatTypes'] });
    },
  });

  return {
    seatTypesQuery,
    createSeatTypeMutation,
    updateSeatTypeMutation,
    deleteSeatTypeMutation,
  };
};
