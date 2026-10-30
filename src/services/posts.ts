import api from "@/utils/lib/api"
import { uploadImage } from "@/services/cms"
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
  const coverImage = data.file ? await uploadImage(data.file) : data.coverImage
  await api.post("/posts", {
    title: data.title,
    description: data.description,
    content: data.content,
    category: data.category,
    isHighlighted: Boolean(data.isHighlighted),
    ...(coverImage !== undefined ? { coverImage } : {}),
  })
}

export async function updatePost(id: string, data: PostInput): Promise<void> {
  const coverImage = data.file ? await uploadImage(data.file) : data.coverImage
  await api.patch(`/posts/${id}`, {
    title: data.title,
    description: data.description,
    content: data.content,
    category: data.category,
    isHighlighted: Boolean(data.isHighlighted),
    ...(coverImage !== undefined ? { coverImage } : {}),
  })
}

export async function deletePost(id: string): Promise<void> {
  await api.delete(`/posts/${id}`)
}
