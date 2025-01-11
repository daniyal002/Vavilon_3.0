import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosAuth } from '../api/axios';
import { Setting, UpdateSettingInput } from '../types/settings';


// Получение всех настроек
const useGetSettings = () => {
  return useQuery<Setting[], Error>({
    queryKey: ['settings'],
    queryFn: async () => {
      const { data } = await axiosAuth.get<Setting[]>('/settings');
      return data;
    },
  });
};

// Обновление настройки по ключу
const useUpdateSetting = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: UpdateSettingInput) => {
      const { data } = await axiosAuth.put<Setting>('/settings', input);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey:['settings']});
    },
  });
};

// Основной хук useSettings, объединяющий функциональность получения и обновления настроек
export const useSettings = () => {
  return {
    getSettings: useGetSettings(),
    updateSetting: useUpdateSetting(),
  };
};