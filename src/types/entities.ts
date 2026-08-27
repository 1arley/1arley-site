export interface PostProps {
  id: string
  title: string
  description: string
  content: string
  category: string
  isHighlighted?: boolean
  coverImage?: string
  createdAt?: string
  updatedAt?: string
}

export type PostInput = Omit<PostProps, "id" | "createdAt" | "updatedAt"> & {
  file?: File
}

export interface Member {
  id: string
  name: string
  role: string
  area?: string
  email: string
  avatarUrl?: string
  group?: string
}

export type MemberInput = Omit<Member, "id"> & {
  file?: File
}

export interface QuickLink {
  id: string
  title: string
  description: string
  url: string
}

export type QuickLinkInput = Omit<QuickLink, "id">

export interface FaqTopic {
  id: string
  name: string
  questions: FaqQuestion[]
}

export type SaveFaqTopic = Omit<FaqTopic, "id" | "questions"> & { id?: string }

export interface FaqQuestion {
  id: string
  question: string
  answer: string
  topicId: string
  isPublished: boolean
}

export type SaveFaqQuestion = Omit<FaqQuestion, "id"> & { id?: string }

export interface AdminUser {
  id: string
  name: string
  email: string
  role: string
  position: string
  createdAt: string
  updatedAt: string
}

export type AdminUserInput = Omit<AdminUser, "id" | "createdAt" | "updatedAt"> & {
  password?: string
}
