import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosAuth } from '../api/axios';
import { User, CreateUserDTO, UpdateUserDTO } from '../types/user';

export const useUsers = () => {
  const queryClient = useQueryClient();

  // Получение всех пользователей
  const usersQuery = useQuery<User[]>({
    queryKey: ['users'],
    queryFn: async () => {
      const { data } = await axiosAuth.get('/users');
      return data;
    },
  });

  // Получение пользователя по ID
  const useUser = (id: number) => {
    return useQuery<User>({
      queryKey: ['user', id],
      queryFn: async () => {
        const { data } = await axiosAuth.get(`/users/${id}`);
        return data;
      },
    });
  };

  // Создание пользователя
  const createUserMutation = useMutation({
    mutationFn: async (userData: CreateUserDTO) => {
      const { data } = await axiosAuth.post('/users', userData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  // Обновление пользователя
  const updateUserMutation = useMutation({
    mutationFn: async ({
      id,
      userData,
    }: {
      id: number;
      userData: UpdateUserDTO;
    }) => {
      const { data } = await axiosAuth.put(`/users/${id}`, userData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  // Удаление пользователя
  const deleteUserMutation = useMutation({
    mutationFn: async (id: number) => {
      await axiosAuth.delete(`/users/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  return {
    usersQuery,
    useUser,
    createUserMutation,
    updateUserMutation,
    deleteUserMutation,
  };
};
