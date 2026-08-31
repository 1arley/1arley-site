import api from "@/utils/lib/api";

/**
 * Cliente do CMS (backend no Render).
 * Usa a instância axios existente (baseURL /api) que passa pelo
 * proxy /api/[...path] até API_BASE_URL e já anexa o token Bearer.
 */

export function getSiteContent() {
  return api.get("/site").then((r) => r.data?.data ?? {});
}

export function saveSiteContent(content: unknown) {
  return api.put("/site", content).then((r) => r.data);
}

export async function uploadImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  const res = await api.post("/upload", formData);
  return (res.data?.url as string) ?? "";
}
