export interface UserRole {
  id: number;
  name: string;
}

export interface User {
  id: number;
  phone: string;
  roleId: number;
  role: UserRole;
}

export interface CreateUserDTO {
  phone: string;
  password: string;
  roleId: number;
}

export interface UpdateUserDTO {
  phone?: string;
  password?: string;
  roleId?: number;
}
