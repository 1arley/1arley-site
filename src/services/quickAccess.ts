import api from "@/utils/lib/api"
import type { QuickLink, QuickLinkInput } from "@/types/entities"

export async function getLinks(): Promise<QuickLink[]> {
  const response = await api.get("/quick-access")
  return response.data.data ?? response.data
}

export async function createLink(data: QuickLinkInput): Promise<void> {
  await api.post("/quick-access", data)
}

export async function updateLink(id: string, data: QuickLinkInput): Promise<void> {
  await api.patch(`/quick-access/${id}`, data)
}

export async function deleteLink(id: string): Promise<void> {
  await api.delete(`/quick-access/${id}`)
}
