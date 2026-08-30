'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Plus, Pencil, Trash2, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { FileImagePicker } from '@/components/admin/FileImagePicker'
import { getPosts, createPost, updatePost, deletePost } from '@/services/posts'
import type { PostProps } from '@/types/entities'

interface FormState {
  title: string
  description: string
  content: string
  category: string
  isHighlighted: boolean
  file: File | null
}

const EMPTY: FormState = { title: '', description: '', content: '', category: '', isHighlighted: false, file: null }

export default function AdminContentPage() {
  const [items, setItems] = useState<PostProps[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<PostProps | null>(null)
  const [form, setForm] = useState<FormState>(EMPTY)

  useEffect(() => {
    load()
  }, [])

  async function load() {
    try {
      const data = await getPosts()
      setItems(data ?? [])
    } catch {
      toast.error('Falha ao carregar conteúdo')
    } finally {
      setLoading(false)
    }
  }

  async function handleSave() {
    if (!form.title) return
    setSaving(true)
    try {
      const payload = {
        title: form.title,
        description: form.description,
        content: form.content,
        category: form.category,
        isHighlighted: form.isHighlighted,
        file: form.file ?? undefined,
      }
      if (editing) {
        await updatePost(editing.id, payload)
        toast.success('Conteúdo atualizado')
      } else {
        await createPost(payload)
        toast.success('Conteúdo criado')
      }
      setForm(EMPTY)
      setEditing(null)
      setOpen(false)
      await load()
    } catch {
      toast.error('Falha ao salvar')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: string) {
    try {
      await deletePost(id)
      toast.success('Conteúdo removido')
      await load()
    } catch {
      toast.error('Falha ao remover')
    }
  }

  function handleEdit(item: PostProps) {
    setEditing(item)
    setForm({
      title: item.title,
      description: item.description,
      content: item.content,
      category: item.category,
      isHighlighted: item.isHighlighted ?? false,
      file: null,
    })
    setOpen(true)
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-8">
        <h1 className="text-2xl font-bold text-white">Conteúdo</h1>
        <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) { setEditing(null); setForm(EMPTY) } }}>
          <DialogTrigger asChild>
            <Button className="btn-primary-gradient rounded-full">
              <Plus className="w-4 h-4 mr-2" /> Novo item
            </Button>
          </DialogTrigger>
          <DialogContent className="glass-card border-border max-w-lg max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-white">{editing ? 'Editar' : 'Novo'} item</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <FileImagePicker
                file={form.file}
                preview={editing?.coverImage ?? null}
                onFile={(f) => setForm({ ...form, file: f })}
                label="Imagem de capa"
              />
              <div>
                <Label className="text-muted-foreground">Título</Label>
                <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="mt-1" />
              </div>
              <div>
                <Label className="text-muted-foreground">Descrição</Label>
                <Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="mt-1" />
              </div>
              <div>
                <Label className="text-muted-foreground">Categoria</Label>
                <Input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="mt-1" />
              </div>
              <div>
                <Label className="text-muted-foreground">Conteúdo</Label>
                <Textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} className="mt-1 min-h-[140px]" />
              </div>
              <label className="flex items-center gap-2 text-sm text-muted-foreground">
                <input
                  type="checkbox"
                  checked={form.isHighlighted}
                  onChange={(e) => setForm({ ...form, isHighlighted: e.target.checked })}
                />
                Destaque
              </label>
              <Button onClick={handleSave} disabled={saving} className="w-full btn-primary-gradient rounded-full">
                {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                {editing ? 'Salvar' : 'Criar'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-3">
        {loading && (
          <div className="glass-card p-8 text-center flex justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        )}
        {!loading && items.length === 0 && (
          <div className="glass-card p-8 text-center">
            <p className="text-muted-foreground">Nenhum conteúdo ainda. Clique em &quot;Novo item&quot; para começar.</p>
          </div>
        )}
        {items.map((item) => (
          <div key={item.id} className="glass-card flex items-center justify-between gap-3 p-4">
            <div className="min-w-0 mr-4">
              <h3 className="text-white font-medium truncate">{item.title}</h3>
              <p className="text-muted-foreground text-sm truncate">{item.description}</p>
              {item.category && <span className="text-xs text-cyan mt-1 inline-block">{item.category}</span>}
            </div>
            <div className="flex gap-2 shrink-0">
              <Button variant="ghost" size="icon" className="h-11 w-11" onClick={() => handleEdit(item)}><Pencil className="w-4 h-4 text-muted-foreground" /></Button>
              <Button variant="ghost" size="icon" className="h-11 w-11" onClick={() => handleDelete(item.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
