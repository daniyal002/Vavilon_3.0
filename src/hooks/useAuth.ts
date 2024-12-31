import { useMutation } from '@tanstack/react-query';
import api from '../api/axios';
import { LoginCredentials, AuthResponse } from '../types/auth';

export const useAuth = () => {
  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      const { data } = await api.post<AuthResponse>('/auth/login', credentials);
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      return data;
    },
  });

  return { loginMutation };
};
