'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { ImagePlus, X } from 'lucide-react'

/**
 * Seletor de imagem local: devolve um File para o formulário.
 * O upload real acontece via FormData nos serviços (posts/team).
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
      <span className="text-sm text-muted-foreground">{label}</span>
      <div className={`mt-1 relative overflow-hidden rounded-lg border border-input bg-black/30 ${aspect}`}>
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
          id="file-input"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handle(e.target.files?.[0])}
        />
        <button
          type="button"
          onClick={() => document.getElementById('file-input')?.click()}
          className="inline-flex items-center gap-1.5 rounded-md border border-input px-3 py-1.5 text-sm text-muted-foreground hover:text-white transition-colors"
        >
          <ImagePlus className="w-4 h-4" />
          {file || preview ? 'Trocar' : 'Enviar'}
        </button>
        {(file || preview) && (
          <button
            type="button"
            onClick={() => { if (objectUrl) URL.revokeObjectURL(objectUrl); setObjectUrl(null); onFile(null) }}
            className="inline-flex items-center gap-1.5 rounded-md border border-input px-3 py-1.5 text-sm text-muted-foreground hover:text-destructive transition-colors"
          >
            <X className="w-4 h-4" />
            Remover
          </button>
        )}
      </div>
    </div>
  )
}
