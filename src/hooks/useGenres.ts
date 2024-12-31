import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/axios';
import { Genre } from '../types/genre';

export const useGenres = () => {
  const queryClient = useQueryClient();

  const genresQuery = useQuery({
    queryKey: ['genres'],
    queryFn: async () => {
      const { data } = await api.get<Genre[]>('/genres');
      return data.sort((a, b) => a.id - b.id);
    },
  });

  const createGenreMutation = useMutation({
    mutationFn: async (name: string) => {
      const { data } = await api.post<Genre>('/genres', { name });
      return data;
    },
    onSuccess: (newGenre) => {
      queryClient.setQueryData<Genre[]>(['genres'], (oldData) => {
        if (!oldData) return [newGenre];
        return [newGenre, ...oldData];
      });
    },
  });

  const updateGenreMutation = useMutation({
    mutationFn: async ({ id, name }: { id: number; name: string }) => {
      const { data } = await api.put<Genre>(`/genres/${id}`, { name });
      return data;
    },
    onSuccess: (updatedGenre) => {
      queryClient.setQueryData<Genre[]>(['genres'], (oldData) => {
        if (!oldData) return [updatedGenre];
        return oldData.map((genre) =>
          genre.id === updatedGenre.id ? updatedGenre : genre
        );
      });
    },
  });

  const deleteGenreMutation = useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/genres/${id}`);
      return id;
    },
    onSuccess: (deletedId) => {
      queryClient.setQueryData<Genre[]>(['genres'], (oldData) => {
        if (!oldData) return [];
        return oldData.filter((genre) => genre.id !== deletedId);
      });
    },
  });

  return {
    genresQuery,
    createGenreMutation,
    updateGenreMutation,
    deleteGenreMutation,
  };
};
