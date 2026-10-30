import api from "@/utils/lib/api"
import { uploadImage } from "@/services/cms"
import type { Member, MemberInput } from "@/types/entities"

interface MemberGetParams {
  page?: number
  limit?: number
  group?: string
}

export async function getMembers(params?: MemberGetParams): Promise<Member[]> {
  const response = await api.get("/team-members", { params })
  return response.data.data ?? response.data
}

export async function createMember(data: MemberInput): Promise<void> {
  const avatarUrl = data.file ? await uploadImage(data.file) : data.avatarUrl
  await api.post("/team-members", {
    name: data.name,
    role: data.role,
    email: data.email,
    ...(data.area !== undefined ? { area: data.area } : {}),
    ...(data.group !== undefined ? { group: data.group } : {}),
    ...(avatarUrl !== undefined ? { avatarUrl } : {}),
  })
}

export async function updateMember(id: string, data: MemberInput): Promise<void> {
  const avatarUrl = data.file ? await uploadImage(data.file) : data.avatarUrl
  await api.patch(`/team-members/${id}`, {
    name: data.name,
    role: data.role,
    email: data.email,
    ...(data.area !== undefined ? { area: data.area } : {}),
    ...(data.group !== undefined ? { group: data.group } : {}),
    ...(avatarUrl !== undefined ? { avatarUrl } : {}),
  })
}

export async function deleteMember(id: string): Promise<void> {
  await api.delete(`/team-members/${id}`)
}
