import api from "@/utils/lib/api"
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
  const formData = new FormData()
  formData.append("name", data.name)
  formData.append("role", data.role)
  formData.append("email", data.email)
  if (data.area) formData.append("area", data.area)
  if (data.group) formData.append("group", data.group)
  if (data.file) formData.append("file", data.file)
  await api.post("/team-members", formData)
}

export async function updateMember(id: string, data: MemberInput): Promise<void> {
  const formData = new FormData()
  formData.append("name", data.name)
  formData.append("role", data.role)
  formData.append("email", data.email)
  if (data.area) formData.append("area", data.area)
  if (data.group) formData.append("group", data.group)
  if (data.file) formData.append("file", data.file)
  await api.patch(`/team-members/${id}`, formData)
}

export async function deleteMember(id: string): Promise<void> {
  await api.delete(`/team-members/${id}`)
}
