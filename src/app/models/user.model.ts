export interface User {
  id?: number;
  username: string;
  passwordHash?: string;
  roleId: number;
  role?: Role;
  fullName?: string;
  email?: string;
}

export interface Role {
  id: number;
  name: string;
}
