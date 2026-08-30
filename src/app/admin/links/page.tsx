'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Plus, Pencil, Trash2, ExternalLink, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { getLinks, createLink, updateLink, deleteLink } from '@/services/quickAccess'
import type { QuickLink } from '@/types/entities'

interface FormState {
  title: string
  description: string
  url: string
}

const EMPTY: FormState = { title: '', description: '', url: '' }

export default function AdminLinksPage() {
  const [links, setLinks] = useState<QuickLink[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<QuickLink | null>(null)
  const [form, setForm] = useState<FormState>(EMPTY)

  useEffect(() => {
    load()
  }, [])

  async function load() {
    try {
      const data = await getLinks()
      setLinks(data ?? [])
    } catch {
      toast.error('Falha ao carregar links')
    } finally {
      setLoading(false)
    }
  }

  async function handleSave() {
    if (!form.title || !form.url) return
    setSaving(true)
    try {
      if (editing) {
        await updateLink(editing.id, form)
        toast.success('Link atualizado')
      } else {
        await createLink(form)
        toast.success('Link criado')
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
      await deleteLink(id)
      toast.success('Link removido')
      await load()
    } catch {
      toast.error('Falha ao remover')
    }
  }

  function handleEdit(link: QuickLink) {
    setEditing(link)
    setForm({ title: link.title, description: link.description, url: link.url })
    setOpen(true)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-white">Links Rápidos</h1>
        <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) { setEditing(null); setForm(EMPTY) } }}>
          <DialogTrigger asChild>
            <Button className="btn-primary-gradient rounded-full">
              <Plus className="w-4 h-4 mr-2" /> Novo link
            </Button>
          </DialogTrigger>
          <DialogContent className="glass-card border-border max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-white">{editing ? 'Editar' : 'Novo'} link</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <Label className="text-muted-foreground">Título</Label>
                <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="mt-1" />
              </div>
              <div>
                <Label className="text-muted-foreground">Descrição</Label>
                <Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="mt-1" />
              </div>
              <div>
                <Label className="text-muted-foreground">URL</Label>
                <Input value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} placeholder="https://..." className="mt-1" />
              </div>
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
        {!loading && links.length === 0 && (
          <div className="glass-card p-8 text-center">
            <p className="text-muted-foreground">Nenhum link ainda.</p>
          </div>
        )}
        {links.map((link) => (
          <div key={link.id} className="glass-card p-4 flex items-center justify-between">
            <div className="min-w-0 mr-4">
              <h3 className="text-white font-medium">{link.title}</h3>
              <p className="text-muted-foreground text-sm truncate">{link.description}</p>
              <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-xs text-cyan hover:underline inline-flex items-center gap-1 mt-1">
                {link.url} <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <div className="flex gap-2 shrink-0">
              <Button variant="ghost" size="icon" onClick={() => handleEdit(link)}><Pencil className="w-4 h-4 text-muted-foreground" /></Button>
              <Button variant="ghost" size="icon" onClick={() => handleDelete(link.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
