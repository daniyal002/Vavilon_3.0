import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {axiosAuth,axiosClassic} from '../api/axios';
import { Movie } from '../types/movie';


export const useMovies = () => {
  const queryClient = useQueryClient();

  const moviesQuery = useQuery({
    queryKey: ['movies'],
    queryFn: async () => {
      const { data } = await axiosAuth.get<Movie[]>('/movies');
      return data;
    },
  });

  const createMovieMutation = useMutation({
    mutationFn: async (movieData: Movie) => {
      const formData = new FormData();

      // Добавляем все поля в FormData
      Object.entries(movieData).forEach(([key, value]) => {
        if (key === 'image' && value instanceof File) {
          formData.append('image', value);
        } else if (key === 'genreIds') {
          // Добавляем каждый ID жанра отдельно
          (value as number[]).forEach((id) => {
            formData.append('genreIds', id.toString());
          });
        } else {
          formData.append(key, value.toString());
        }
      });

      const { data } = await axiosAuth.post<Movie>('/movies', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return data;
    },
    onSuccess: (newMovie) => {
      queryClient.setQueryData<Movie[]>(['movies'], (oldData) => {
        if (!oldData) return [newMovie];
        return [...oldData, newMovie];
      });
    },
  });

  const updateMovieMutation = useMutation({
    mutationFn: async ({ id, ...movieData }: Movie) => {
      const formData = new FormData();

      // Добавляем все поля в FormData
      Object.entries(movieData).forEach(([key, value]) => {
        if (key === 'image' && value instanceof File) {
          formData.append('image', value);
        } else if (key === 'genreIds' && Array.isArray(value)) {
          value.forEach((id) => {
            formData.append('genreIds', id.toString());
          });
        } else if (value !== undefined) {
          formData.append(key, value.toString());
        }
      });

      const { data } = await axiosAuth.put<Movie>(`/movies/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return data;
    },
    onSuccess: (updatedMovie) => {
      queryClient.setQueryData<Movie[]>(['movies'], (oldData) => {
        if (!oldData) return [updatedMovie];
        return oldData.map((movie) =>
          movie.id === updatedMovie.id ? updatedMovie : movie
        );
      });
    },
  });

  const deleteMovieMutation = useMutation({
    mutationFn: async (id: number) => {
      await axiosAuth.delete(`/movies/${id}`);
      return id;
    },
    onSuccess: (deletedId) => {
      queryClient.setQueryData<Movie[]>(['movies'], (oldData) => {
        if (!oldData) return [];
        return oldData.filter((movie) => movie.id !== deletedId );
      });
    },
  });

  // Хук для получения отдельного фильма
  const useMovie = (id: number) =>
    useQuery({
      queryKey: ['movies', id],
      queryFn: async () => {
        const { data } = await axiosClassic.get<Movie>(`/movies/${id}`);
        return data;
      },
      enabled: !!id, // Запрос будет выполнен только если есть id
    });

  return {
    moviesQuery,
    createMovieMutation,
    updateMovieMutation,
    deleteMovieMutation,
    useMovie,
  };
};
