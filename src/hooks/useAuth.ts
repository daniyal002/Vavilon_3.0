import { useMutation } from '@tanstack/react-query';
import { LoginCredentials } from '../types/auth';
import { AuthService } from '../services/auth.service';

export const useAuth = () => {
  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      const { data } = await AuthService.login(credentials.phone,credentials.password)
      return data;
    },
  });

  return { loginMutation };
};
