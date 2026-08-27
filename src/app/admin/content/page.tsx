'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Plus, Pencil, Trash2 } from 'lucide-react'

interface ContentItem {
  id: string
  title: string
  description: string
  category: string
}

export default function AdminContentPage() {
  const [items, setItems] = useState<ContentItem[]>([])
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<ContentItem | null>(null)
  const [form, setForm] = useState({ title: '', description: '', category: '' })

  function handleSave() {
    if (!form.title) return
    if (editing) {
      setItems(items.map((i) => (i.id === editing.id ? { ...i, ...form } : i)))
    } else {
      setItems([...items, { ...form, id: crypto.randomUUID() }])
    }
    setForm({ title: '', description: '', category: '' })
    setEditing(null)
    setOpen(false)
  }

  function handleEdit(item: ContentItem) {
    setEditing(item)
    setForm({ title: item.title, description: item.description, category: item.category })
    setOpen(true)
  }

  function handleDelete(id: string) {
    setItems(items.filter((i) => i.id !== id))
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-white">Conteúdo</h1>
        <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) { setEditing(null); setForm({ title: '', description: '', category: '' }) } }}>
          <DialogTrigger asChild>
            <Button className="btn-primary-gradient rounded-full">
              <Plus className="w-4 h-4 mr-2" /> Novo item
            </Button>
          </DialogTrigger>
          <DialogContent className="glass-card border-border">
            <DialogHeader>
              <DialogTitle className="text-white">{editing ? 'Editar' : 'Novo'} item</DialogTitle>
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
                <Label className="text-muted-foreground">Categoria</Label>
                <Input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="mt-1" />
              </div>
              <Button onClick={handleSave} className="w-full btn-primary-gradient rounded-full">{editing ? 'Salvar' : 'Criar'}</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-3">
        {items.length === 0 && (
          <div className="glass-card p-8 text-center">
            <p className="text-muted-foreground">Nenhum conteúdo ainda. Clique em &quot;Novo item&quot; para começar.</p>
          </div>
        )}
        {items.map((item) => (
          <div key={item.id} className="glass-card p-4 flex items-center justify-between">
            <div>
              <h3 className="text-white font-medium">{item.title}</h3>
              <p className="text-muted-foreground text-sm">{item.description}</p>
              {item.category && <span className="text-xs text-cyan mt-1 inline-block">{item.category}</span>}
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" onClick={() => handleEdit(item)}><Pencil className="w-4 h-4 text-muted-foreground" /></Button>
              <Button variant="ghost" size="icon" onClick={() => handleDelete(item.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
