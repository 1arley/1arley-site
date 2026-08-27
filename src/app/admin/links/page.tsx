'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Plus, Pencil, Trash2, ExternalLink } from 'lucide-react'

interface QuickLink {
  id: string
  title: string
  description: string
  url: string
}

export default function AdminLinksPage() {
  const [links, setLinks] = useState<QuickLink[]>([])
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<QuickLink | null>(null)
  const [form, setForm] = useState({ title: '', description: '', url: '' })

  function handleSave() {
    if (!form.title || !form.url) return
    if (editing) {
      setLinks(links.map((l) => (l.id === editing.id ? { ...l, ...form } : l)))
    } else {
      setLinks([...links, { ...form, id: crypto.randomUUID() }])
    }
    setForm({ title: '', description: '', url: '' })
    setEditing(null)
    setOpen(false)
  }

  function handleEdit(link: QuickLink) {
    setEditing(link)
    setForm({ title: link.title, description: link.description, url: link.url })
    setOpen(true)
  }

  function handleDelete(id: string) {
    setLinks(links.filter((l) => l.id !== id))
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-white">Links Rápidos</h1>
        <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) { setEditing(null); setForm({ title: '', description: '', url: '' }) } }}>
          <DialogTrigger asChild>
            <Button className="btn-primary-gradient rounded-full">
              <Plus className="w-4 h-4 mr-2" /> Novo link
            </Button>
          </DialogTrigger>
          <DialogContent className="glass-card border-border">
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
              <Button onClick={handleSave} className="w-full btn-primary-gradient rounded-full">{editing ? 'Salvar' : 'Criar'}</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-3">
        {links.length === 0 && (
          <div className="glass-card p-8 text-center">
            <p className="text-muted-foreground">Nenhum link ainda.</p>
          </div>
        )}
        {links.map((link) => (
          <div key={link.id} className="glass-card p-4 flex items-center justify-between">
            <div>
              <h3 className="text-white font-medium">{link.title}</h3>
              <p className="text-muted-foreground text-sm">{link.description}</p>
              <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-xs text-cyan hover:underline inline-flex items-center gap-1 mt-1">
                {link.url} <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" onClick={() => handleEdit(link)}><Pencil className="w-4 h-4 text-muted-foreground" /></Button>
              <Button variant="ghost" size="icon" onClick={() => handleDelete(link.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
