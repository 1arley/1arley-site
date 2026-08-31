import { useEffect, useState } from "react";

export function resolveImageUrl(source: string | null | undefined): string | null {
  // Garante que a função não quebre se receber null, undefined ou não-string.
  if (!source || typeof source !== 'string') {
    return null;
  }
  
  const trimmedSource = source.trim();

  // Retorna null se a URL for literalmente "undefined" ou vazia
  if (!trimmedSource || /(^|\/)undefined($|\?)/i.test(trimmedSource)) {
    return null;
  }

  // Retorna a URL como está se for um link absoluto
  if (/^https?:\/\//i.test(trimmedSource)) {
    return trimmedSource;
  }

  // Retorna como está se já for um caminho de API ou de upload
  if (trimmedSource.startsWith("/api/") || trimmedSource.startsWith("/uploads/")) {
    return trimmedSource;
  }

  // Adiciona o prefixo da API para caminhos relativos
  const normalizedPath = trimmedSource.startsWith("/")
    ? trimmedSource
    : `/${trimmedSource}`;

  return `/api${normalizedPath}`;
}

/**
 * Hook para converter uma string em uma URL valida para a tag Image.
 * Gerencia automaticamente a limpeza da memoria (revokeObjectURL).
 */
export function useImageObjectUrl(source: string | File | null | undefined): string | null {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!source) {
      setUrl(null);
      return;
    }

    // Se for string, resolve a URL
    if (typeof source === "string") {
      setUrl(resolveImageUrl(source));
      return;
    }

    // Se for um arquivo, cria uma URL de objeto
    if (source instanceof File) {
      const objectUrl = URL.createObjectURL(source);
      setUrl(objectUrl);

      // Limpa a URL do objeto da memória quando o componente for desmontado
      return () => URL.revokeObjectURL(objectUrl);
    }
    
    setUrl(null);
  }, [source]);

  return url;
}