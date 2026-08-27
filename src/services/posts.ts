import api from "@/utils/lib/api"
import type { PostProps, PostInput } from "@/types/entities"

export async function getPosts(): Promise<PostProps[]> {
  const response = await api.get("/posts")
  return response.data.data ?? response.data.content ?? response.data
}

export async function getPostById(id: string): Promise<PostProps> {
  const response = await api.get(`/posts/${id}`)
  return response.data.data ?? response.data
}

export async function createPost(data: PostInput): Promise<void> {
  const formData = new FormData()
  formData.append("title", data.title)
  formData.append("description", data.description)
  formData.append("content", data.content)
  formData.append("category", data.category)
  if (data.isHighlighted) formData.append("isHighlighted", "true")
  if (data.file) formData.append("file", data.file)
  await api.post("/posts", formData)
}

export async function updatePost(id: string, data: PostInput): Promise<void> {
  const formData = new FormData()
  formData.append("title", data.title)
  formData.append("description", data.description)
  formData.append("content", data.content)
  formData.append("category", data.category)
  if (data.isHighlighted) formData.append("isHighlighted", "true")
  if (data.file) formData.append("file", data.file)
  await api.patch(`/posts/${id}`, formData)
}

export async function deletePost(id: string): Promise<void> {
  await api.delete(`/posts/${id}`)
}
