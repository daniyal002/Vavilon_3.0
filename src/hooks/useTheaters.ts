import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/axios';
import { Theater } from '../types/theater';

export const useTheaters = () => {
  const queryClient = useQueryClient();

  const theatersQuery = useQuery({
    queryKey: ['theaters'],
    queryFn: async () => {
      const { data } = await api.get<Theater[]>('/theaters');
      return data;
    },
  });

  const createTheaterMutation = useMutation({
    mutationFn: async (theater: Omit<Theater, 'id'>) => {
      const { data } = await api.post<Theater>('/theaters', theater);
      return data;
    },
    onSuccess: (newTheater) => {
      queryClient.setQueryData<Theater[]>(['theaters'], (oldData) => {
        if (!oldData) return [newTheater];
        return [...oldData, newTheater];
      });
    },
  });

  const updateTheaterMutation = useMutation({
    mutationFn: async (theater: Theater) => {
      const { data } = await api.put<Theater>(
        `/theaters/${theater.id}`,
        theater
      );
      return data;
    },
    onSuccess: (updatedTheater) => {
      queryClient.setQueryData<Theater[]>(['theaters'], (oldData) => {
        if (!oldData) return [updatedTheater];
        return oldData.map((theater) =>
          theater.id === updatedTheater.id ? updatedTheater : theater
        );
      });
    },
  });

  const deleteTheaterMutation = useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/theaters/${id}`);
      return id;
    },
    onSuccess: (deletedId) => {
      queryClient.setQueryData<Theater[]>(['theaters'], (oldData) => {
        if (!oldData) return [];
        return oldData.filter((theater) => theater.id !== deletedId);
      });
    },
  });

  return {
    theatersQuery,
    createTheaterMutation,
    updateTheaterMutation,
    deleteTheaterMutation,
  };
};
