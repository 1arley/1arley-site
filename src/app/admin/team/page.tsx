'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Plus, Pencil, Trash2 } from 'lucide-react'

interface Member {
  id: string
  name: string
  role: string
  email: string
}

export default function AdminTeamPage() {
  const [members, setMembers] = useState<Member[]>([])
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Member | null>(null)
  const [form, setForm] = useState({ name: '', role: '', email: '' })

  function handleSave() {
    if (!form.name) return
    if (editing) {
      setMembers(members.map((m) => (m.id === editing.id ? { ...m, ...form } : m)))
    } else {
      setMembers([...members, { ...form, id: crypto.randomUUID() }])
    }
    setForm({ name: '', role: '', email: '' })
    setEditing(null)
    setOpen(false)
  }

  function handleEdit(member: Member) {
    setEditing(member)
    setForm({ name: member.name, role: member.role, email: member.email })
    setOpen(true)
  }

  function handleDelete(id: string) {
    setMembers(members.filter((m) => m.id !== id))
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-white">Equipe</h1>
        <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) { setEditing(null); setForm({ name: '', role: '', email: '' }) } }}>
          <DialogTrigger asChild>
            <Button className="btn-primary-gradient rounded-full">
              <Plus className="w-4 h-4 mr-2" /> Novo membro
            </Button>
          </DialogTrigger>
          <DialogContent className="glass-card border-border">
            <DialogHeader>
              <DialogTitle className="text-white">{editing ? 'Editar' : 'Novo'} membro</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <Label className="text-muted-foreground">Nome</Label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="mt-1" />
              </div>
              <div>
                <Label className="text-muted-foreground">Cargo</Label>
                <Input value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="mt-1" />
              </div>
              <div>
                <Label className="text-muted-foreground">Email</Label>
                <Input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="mt-1" />
              </div>
              <Button onClick={handleSave} className="w-full btn-primary-gradient rounded-full">{editing ? 'Salvar' : 'Criar'}</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-3">
        {members.length === 0 && (
          <div className="glass-card p-8 text-center">
            <p className="text-muted-foreground">Nenhum membro ainda.</p>
          </div>
        )}
        {members.map((member) => (
          <div key={member.id} className="glass-card p-4 flex items-center justify-between">
            <div>
              <h3 className="text-white font-medium">{member.name}</h3>
              <p className="text-muted-foreground text-sm">{member.role}</p>
              <p className="text-xs text-cyan">{member.email}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" onClick={() => handleEdit(member)}><Pencil className="w-4 h-4 text-muted-foreground" /></Button>
              <Button variant="ghost" size="icon" onClick={() => handleDelete(member.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
