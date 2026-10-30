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
