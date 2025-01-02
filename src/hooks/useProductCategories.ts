import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosAuth } from '../api/axios';
import { ProductCategory } from '../types/productCategory';

export const useProductCategories = () => {
  const queryClient = useQueryClient();

  // Получение всех категорий
  const categoriesQuery = useQuery<ProductCategory[]>({
    queryKey: ['productCategories'],
    queryFn: async () => {
      const { data } = await axiosAuth.get('/product-categories');
      return data;
    },
  });

  // Получение категории по ID
  const useCategory = (id: number) => {
    return useQuery<ProductCategory>({
      queryKey: ['productCategory', id],
      queryFn: async () => {
        const { data } = await axiosAuth.get(`/product-categories/${id}`);
        return data;
      },
    });
  };

  // Создание категории
  const createCategoryMutation = useMutation({
    mutationFn: async (name: string) => {
      const { data } = await axiosAuth.post('/product-categories', { name });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productCategories'] });
    },
  });

  // Обновление категории
  const updateCategoryMutation = useMutation({
    mutationFn: async ({ id, name }: { id: number; name: string }) => {
      const { data } = await axiosAuth.put(`/product-categories/${id}`, {
        name,
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productCategories'] });
    },
  });

  // Удаление категории
  const deleteCategoryMutation = useMutation({
    mutationFn: async (id: number) => {
      await axiosAuth.delete(`/product-categories/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productCategories'] });
    },
  });

  return {
    categoriesQuery,
    useCategory,
    createCategoryMutation,
    updateCategoryMutation,
    deleteCategoryMutation,
  };
};
