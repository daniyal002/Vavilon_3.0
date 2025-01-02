import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosAuth } from '../api/axios';
import { UserRole } from '../types/user';

export const useUserRoles = () => {
  const queryClient = useQueryClient();

  // Получение всех ролей
  const rolesQuery = useQuery<UserRole[]>({
    queryKey: ['userRoles'],
    queryFn: async () => {
      const { data } = await axiosAuth.get('/roles');
      return data;
    },
  });

  // Получение роли по ID
  const useRole = (id: number) => {
    return useQuery<UserRole>({
      queryKey: ['userRole', id],
      queryFn: async () => {
        const { data } = await axiosAuth.get(`/roles/${id}`);
        return data;
      },
    });
  };

  // Создание роли
  const createRoleMutation = useMutation({
    mutationFn: async (name: string) => {
      const { data } = await axiosAuth.post('/roles', { name });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userRoles'] });
    },
  });

  // Обновление роли
  const updateRoleMutation = useMutation({
    mutationFn: async ({ id, name }: { id: number; name: string }) => {
      const { data } = await axiosAuth.put(`/roles/${id}`, { name });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userRoles'] });
    },
  });

  // Удаление роли
  const deleteRoleMutation = useMutation({
    mutationFn: async (id: number) => {
      await axiosAuth.delete(`/roles/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userRoles'] });
    },
  });

  return {
    rolesQuery,
    useRole,
    createRoleMutation,
    updateRoleMutation,
    deleteRoleMutation,
  };
};
