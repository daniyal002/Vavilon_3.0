export interface LoginCredentials {
  phone: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
}

export interface User {
  id: number;
  phone: string;
  roleId: number;
}
