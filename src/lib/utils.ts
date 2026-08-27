export { cn } from "@/utils/lib/utils";

export function formatPreviewDate(dateString?: string | null): string {
  if (!dateString) return "";
  
  const date = new Date(dateString + "T00:00:00Z");
  
  return date.toLocaleDateString("pt-BR", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).replace(/ de /g, " ").replace(".", "");
}