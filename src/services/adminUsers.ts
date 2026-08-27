import api from "@/utils/lib/api"
import type { AdminUser, AdminUserInput } from "@/types/entities"

export async function getUsers(): Promise<AdminUser[]> {
  const response = await api.get("/users")
  return response.data.data ?? response.data
}

export async function createUser(data: AdminUserInput): Promise<void> {
  await api.post("/users", data)
}

export async function updateUser(id: string, data: AdminUserInput): Promise<void> {
  await api.patch(`/users/${id}`, data)
}

export async function deleteUser(id: string): Promise<void> {
  await api.delete(`/users/${id}`)
}
