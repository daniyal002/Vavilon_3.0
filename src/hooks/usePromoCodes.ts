import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosAuth, axiosClassic } from '../api/axios';
import {
  PromoCode,
  CreatePromoCodeDTO,
  UpdatePromoCodeDTO,
} from '../types/promocode';

export const usePromoCodes = () => {
  const queryClient = useQueryClient();

  // Получение всех промокодов
  const promoCodesQuery = () => useQuery<PromoCode[]>({
    queryKey: ['promoCodes'],
    queryFn: async () => {
      const { data } = await axiosAuth.get('/promocodes');
      return data;
    },
  });

  // Получение промокода по ID
  const usePromoCode = (id: number) => {
    return useQuery<PromoCode>({
      queryKey: ['promoCode', id],
      queryFn: async () => {
        const { data } = await axiosAuth.get(`/promocodes/${id}`);
        return data;
      },
    });
  };

  // Проверка промокода по коду
  const useCheckPromoCode = (code: string, options?: { enabled: boolean }) => {
    return useQuery<PromoCode>({
      queryKey: ['promoCode', code],
      queryFn: async () => {
        const { data } = await axiosClassic.get(`/promocodes/code/${code}`);
        return data;
      },
      enabled: options?.enabled ?? !!code,
    });
  };

  // Создание промокода
  const createPromoCodeMutation = useMutation({
    mutationFn: async (newPromoCode: CreatePromoCodeDTO) => {
      const { data } = await axiosAuth.post('/promocodes', newPromoCode);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['promoCodes'] });
    },
  });

  // Обновление промокода
  const updatePromoCodeMutation = useMutation({
    mutationFn: async (updatedPromoCode: UpdatePromoCodeDTO) => {
      const { data } = await axiosAuth.put(
        `/promocodes/${updatedPromoCode.id}`,
        updatedPromoCode
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['promoCodes'] });
    },
  });

  // Удаление промокода
  const deletePromoCodeMutation = useMutation({
    mutationFn: async (id: number) => {
      await axiosAuth.delete(`/promocodes/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['promoCodes'] });
    },
  });

  return {
    promoCodesQuery,
    usePromoCode,
    useCheckPromoCode,
    createPromoCodeMutation,
    updatePromoCodeMutation,
    deletePromoCodeMutation,
  };
};
