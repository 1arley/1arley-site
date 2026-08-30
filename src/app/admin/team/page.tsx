'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Plus, Pencil, Trash2, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { FileImagePicker } from '@/components/admin/FileImagePicker'
import { getMembers, createMember, updateMember, deleteMember } from '@/services/teamMembers'
import type { Member } from '@/types/entities'

interface FormState {
  name: string
  role: string
  email: string
  area: string
  group: string
  file: File | null
}

const EMPTY: FormState = { name: '', role: '', email: '', area: '', group: '', file: null }

export default function AdminTeamPage() {
  const [members, setMembers] = useState<Member[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Member | null>(null)
  const [form, setForm] = useState<FormState>(EMPTY)

  useEffect(() => {
    load()
  }, [])

  async function load() {
    try {
      const data = await getMembers()
      setMembers(data ?? [])
    } catch {
      toast.error('Falha ao carregar equipe')
    } finally {
      setLoading(false)
    }
  }

  async function handleSave() {
    if (!form.name) return
    setSaving(true)
    try {
      const payload = {
        name: form.name,
        role: form.role,
        email: form.email,
        area: form.area || undefined,
        group: form.group || undefined,
        file: form.file ?? undefined,
      }
      if (editing) {
        await updateMember(editing.id, payload)
        toast.success('Membro atualizado')
      } else {
        await createMember(payload)
        toast.success('Membro criado')
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
      await deleteMember(id)
      toast.success('Membro removido')
      await load()
    } catch {
      toast.error('Falha ao remover')
    }
  }

  function handleEdit(member: Member) {
    setEditing(member)
    setForm({
      name: member.name,
      role: member.role,
      email: member.email,
      area: member.area ?? '',
      group: member.group ?? '',
      file: null,
    })
    setOpen(true)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-white">Equipe</h1>
        <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) { setEditing(null); setForm(EMPTY) } }}>
          <DialogTrigger asChild>
            <Button className="btn-primary-gradient rounded-full">
              <Plus className="w-4 h-4 mr-2" /> Novo membro
            </Button>
          </DialogTrigger>
          <DialogContent className="glass-card border-border max-w-lg max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-white">{editing ? 'Editar' : 'Novo'} membro</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <FileImagePicker
                file={form.file}
                preview={editing?.avatarUrl ?? null}
                onFile={(f) => setForm({ ...form, file: f })}
                aspect="aspect-square"
                label="Avatar"
              />
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
              <div>
                <Label className="text-muted-foreground">Área</Label>
                <Input value={form.area} onChange={(e) => setForm({ ...form, area: e.target.value })} className="mt-1" />
              </div>
              <div>
                <Label className="text-muted-foreground">Grupo</Label>
                <Input value={form.group} onChange={(e) => setForm({ ...form, group: e.target.value })} className="mt-1" />
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
        {!loading && members.length === 0 && (
          <div className="glass-card p-8 text-center">
            <p className="text-muted-foreground">Nenhum membro ainda.</p>
          </div>
        )}
        {members.map((member) => (
          <div key={member.id} className="glass-card p-4 flex items-center justify-between">
            <div className="min-w-0 mr-4">
              <h3 className="text-white font-medium">{member.name}</h3>
              <p className="text-muted-foreground text-sm">{member.role}</p>
              <p className="text-xs text-cyan truncate">{member.email}</p>
            </div>
            <div className="flex gap-2 shrink-0">
              <Button variant="ghost" size="icon" onClick={() => handleEdit(member)}><Pencil className="w-4 h-4 text-muted-foreground" /></Button>
              <Button variant="ghost" size="icon" onClick={() => handleDelete(member.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
