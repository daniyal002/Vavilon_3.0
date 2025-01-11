import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosAuth, axiosClassic } from '../api/axios';
import { Product } from '../types/product';

export const useProducts = () => {
  const queryClient = useQueryClient();

  // Получение всех продуктов
  const productsQuery = useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: async () => {
      const { data } = await axiosClassic.get('/products');
      return data;
    },
  });

  // Получение продукта по ID
  const useProduct = (id: number) => {
    return useQuery<Product>({
      queryKey: ['product', id],
      queryFn: async () => {
        const { data } = await axiosClassic.get(`/products/${id}`);
        return data;
      },
    });
  };

  // Создание продукта
  const createProductMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const { data } = await axiosAuth.post('/products', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });

  // Обновление продукта
  const updateProductMutation = useMutation({
    mutationFn: async ({
      id,
      formData,
    }: {
      id: number;
      formData: FormData;
    }) => {
      const { data } = await axiosAuth.put(`/products/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });

  // Удаление продукта
  const deleteProductMutation = useMutation({
    mutationFn: async (id: number) => {
      await axiosAuth.delete(`/products/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });

  return {
    productsQuery,
    useProduct,
    createProductMutation,
    updateProductMutation,
    deleteProductMutation,
  };
};
