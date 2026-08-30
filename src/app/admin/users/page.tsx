'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Plus, Pencil, Trash2, Shield, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { getUsers, createUser, updateUser, deleteUser } from '@/services/adminUsers'
import type { AdminUser } from '@/types/entities'

interface FormState {
  name: string
  email: string
  role: string
  position: string
}

const EMPTY: FormState = { name: '', email: '', role: 'USER', position: '' }

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<AdminUser | null>(null)
  const [form, setForm] = useState<FormState>(EMPTY)

  useEffect(() => {
    load()
  }, [])

  async function load() {
    try {
      const data = await getUsers()
      setUsers(data ?? [])
    } catch {
      toast.error('Falha ao carregar usuários')
    } finally {
      setLoading(false)
    }
  }

  async function handleSave() {
    if (!form.name || !form.email) return
    setSaving(true)
    try {
      if (editing) {
        await updateUser(editing.id, form)
        toast.success('Usuário atualizado')
      } else {
        await createUser(form)
        toast.success('Usuário criado')
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
      await deleteUser(id)
      toast.success('Usuário removido')
      await load()
    } catch {
      toast.error('Falha ao remover')
    }
  }

  function handleEdit(user: AdminUser) {
    setEditing(user)
    setForm({ name: user.name, email: user.email, role: user.role, position: user.position })
    setOpen(true)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-white">Usuários</h1>
        <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) { setEditing(null); setForm(EMPTY) } }}>
          <DialogTrigger asChild>
            <Button className="btn-primary-gradient rounded-full">
              <Plus className="w-4 h-4 mr-2" /> Novo usuário
            </Button>
          </DialogTrigger>
          <DialogContent className="glass-card border-border max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-white">{editing ? 'Editar' : 'Novo'} usuário</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <Label className="text-muted-foreground">Nome</Label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="mt-1" />
              </div>
              <div>
                <Label className="text-muted-foreground">Email</Label>
                <Input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="mt-1" />
              </div>
              <div>
                <Label className="text-muted-foreground">Cargo</Label>
                <Input value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value })} className="mt-1" />
              </div>
              <div>
                <Label className="text-muted-foreground">Papel</Label>
                <select
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="USER">Usuário</option>
                  <option value="ADMIN">Admin</option>
                  <option value="SUPERADMIN">Super Admin</option>
                </select>
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
        {!loading && users.length === 0 && (
          <div className="glass-card p-8 text-center">
            <p className="text-muted-foreground">Nenhum usuário ainda.</p>
          </div>
        )}
        {users.map((user) => (
          <div key={user.id} className="glass-card p-4 flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0 mr-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                <Shield className="w-5 h-5 text-primary" />
              </div>
              <div className="min-w-0">
                <h3 className="text-white font-medium truncate">{user.name}</h3>
                <p className="text-muted-foreground text-sm truncate">{user.email}</p>
                <span className="text-xs text-cyan">{user.role}</span>
              </div>
            </div>
            <div className="flex gap-2 shrink-0">
              <Button variant="ghost" size="icon" onClick={() => handleEdit(user)}><Pencil className="w-4 h-4 text-muted-foreground" /></Button>
              <Button variant="ghost" size="icon" onClick={() => handleDelete(user.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
