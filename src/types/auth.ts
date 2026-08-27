export interface LoginCredentials {
  email: string
  password: string
}

export interface LoginUser {
  id: string
  name: string
  email: string
  role: string
  position: string
  createdAt: string
  updatedAt: string
}

export interface LoginResponse {
  access_token?: string
  user?: LoginUser
  message?: string
}

export type AdminRole = "USER" | "ADMIN" | "SUPERADMIN"
