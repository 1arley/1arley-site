'use client'

import { useId, useState } from 'react'
import Image from 'next/image'
import { ImagePlus, X } from 'lucide-react'
import { Label } from '@/components/ui/label'

/**
 * Seletor de imagem local: devolve um File para o formulário.
 * O upload real acontece nos serviços (posts/team).
 */
export function FileImagePicker({
  file,
  preview,
  onFile,
  aspect = 'aspect-video',
  label = 'Imagem',
}: {
  file?: File | null
  preview?: string | null
  onFile: (f: File | null) => void
  aspect?: string
  label?: string
}) {
  const inputId = useId()
  const [objectUrl, setObjectUrl] = useState<string | null>(null)
  const shown = objectUrl || preview

  function handle(f?: File) {
    if (!f) return
    if (objectUrl) URL.revokeObjectURL(objectUrl)
    setObjectUrl(URL.createObjectURL(f))
    onFile(f)
  }

  return (
    <div>
      <Label htmlFor={inputId} className="text-sm text-muted-foreground">{label}</Label>
      <div className={`mt-1 relative overflow-hidden border border-input bg-black/30 ${aspect}`}>
        {shown ? (
          <Image src={shown} alt="" fill className="object-cover" unoptimized />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-muted-foreground text-sm">
            Sem imagem
          </div>
        )}
      </div>
      <div className="mt-2 flex gap-2">
        <input
          id={inputId}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handle(e.target.files?.[0])}
        />
        <button
          type="button"
          onClick={() => document.getElementById(inputId)?.click()}
          className="inline-flex min-h-11 items-center gap-1.5 border border-input px-4 py-2 text-sm text-muted-foreground hover:text-white transition-colors"
        >
          <ImagePlus className="w-4 h-4" />
          {file || preview ? 'Trocar' : 'Enviar'}
        </button>
        {(file || preview) && (
          <button
            type="button"
            onClick={() => { if (objectUrl) URL.revokeObjectURL(objectUrl); setObjectUrl(null); onFile(null) }}
            className="inline-flex min-h-11 items-center gap-1.5 border border-input px-4 py-2 text-sm text-muted-foreground hover:text-destructive transition-colors"
          >
            <X className="w-4 h-4" />
            Remover
          </button>
        )}
      </div>
    </div>
  )
}
