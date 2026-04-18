export interface User {
  id?: number;
  username: string;
  name: string;
  email: string;
  password?: string;
  role: Role;
}

export enum Role {
  USER = 'USER',
  ADMIN = 'ADMIN'
}

export interface LoginDTO {
  username: string;
  password: string;
}

export interface RegisterDTO {
  username: string;
  name: string;
  email: string;
  password: string;
  role: Role;
}

export interface ResponseDTO {
  token: string;
  role: string;
}