import api from "@/utils/lib/api"
import type { FaqTopic, SaveFaqTopic, FaqQuestion, SaveFaqQuestion } from "@/types/entities"

export async function getFaqTopics(): Promise<FaqTopic[]> {
  const response = await api.get("/faq/topics")
  return response.data.data ?? response.data
}

export async function createFaqTopic(data: SaveFaqTopic): Promise<void> {
  await api.post("/faq/topics", data)
}

export async function updateFaqTopic(id: string, data: SaveFaqTopic): Promise<void> {
  await api.patch(`/faq/topics/${id}`, data)
}

export async function deleteFaqTopic(id: string): Promise<void> {
  await api.delete(`/faq/topics/${id}`)
}

export async function createFaqQuestion(data: SaveFaqQuestion): Promise<void> {
  await api.post("/faq/questions", data)
}

export async function updateFaqQuestion(id: string, data: SaveFaqQuestion): Promise<void> {
  await api.patch(`/faq/questions/${id}`, data)
}

export async function deleteFaqQuestion(id: string): Promise<void> {
  await api.delete(`/faq/questions/${id}`)
}
