'use client'

import { useEffect, useId, useRef, useState } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ArrowDown, ArrowUp, ImagePlus, Loader2, Plus, Save, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { deepMerge } from '@/lib/i18n'
import { dict, type Dict } from '@/lib/i18n-data'
import { getSiteContent, saveSiteContent, uploadImage } from '@/services/cms'
import { isHttpUrl, isValidImageSrc } from '@/utils/lib/url'

type Lang = 'pt' | 'en'

// ─── helpers de campo ─────────────────────────────────────────────

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
}) {
  const id = useId()
  return (
    <div>
      <Label htmlFor={id} className="text-xs text-muted-foreground">{label}</Label>
      <Input id={id} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="mt-1" />
    </div>
  )
}

function AreaField({
  label,
  value,
  onChange,
  rows = 3,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  rows?: number
}) {
  const id = useId()
  return (
    <div>
      <Label htmlFor={id} className="text-xs text-muted-foreground">{label}</Label>
      <Textarea id={id} value={value} rows={rows} onChange={(e) => onChange(e.target.value)} className="mt-1" />
    </div>
  )
}

function LinesField({
  label,
  value,
  onChange,
}: {
  label: string
  value: string[]
  onChange: (v: string[]) => void
}) {
  return (
    <AreaField
      label={label + ' (um por linha)'}
      value={value.join('\n')}
      onChange={(v) => onChange(v.split('\n').map((s) => s.trim()).filter(Boolean))}
      rows={Math.max(3, value.length + 1)}
    />
  )
}

function CmsImageField({
  label,
  value,
  onChange,
  aspect = 'aspect-video',
}: {
  label: string
  value: string
  onChange: (url: string) => void
  aspect?: string
}) {
  const urlInputId = useId()
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [uploading, setUploading] = useState(false)

  async function handleFile(file?: File) {
    if (!file) return
    setUploading(true)
    try {
      const url = await uploadImage(file)
      onChange(url)
      toast.success('Imagem enviada')
    } catch {
      toast.error('Falha ao enviar imagem')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div>
      <Label htmlFor={urlInputId} className="text-xs text-muted-foreground">{label}</Label>
      <div className={`mt-1 relative overflow-hidden border border-input bg-black/30 ${aspect}`}>
        {isValidImageSrc(value) ? (
          <Image src={value.trim()} alt="" fill className="object-cover" unoptimized />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-muted-foreground text-sm">
            Sem imagem
          </div>
        )}
        {uploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60">
            <Loader2 className="w-6 h-6 animate-spin text-white" />
          </div>
        )}
      </div>
      <div className="mt-2">
        <Input
          id={urlInputId}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="/projects/exemplo.png ou https://..."
          className="font-mono text-xs"
        />
      </div>
      <div className="mt-2 flex gap-2">
        <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleFile(e.target.files?.[0])} />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="inline-flex min-h-11 items-center gap-1.5 border border-input px-4 py-2 text-sm text-muted-foreground hover:text-white transition-colors disabled:opacity-50"
        >
          <ImagePlus className="w-4 h-4" />
          Upload
        </button>
        {value && (
          <button
            type="button"
            onClick={() => onChange('')}
            className="inline-flex min-h-11 items-center gap-1.5 border border-input px-4 py-2 text-sm text-muted-foreground hover:text-destructive transition-colors"
          >
            Remover
          </button>
        )}
      </div>
    </div>
  )
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border border-border bg-black-4 p-5">
      <h2 className="font-mono text-xs font-bold uppercase tracking-widest text-white/80 mb-4">{title}</h2>
      <div className="space-y-4">{children}</div>
    </section>
  )
}

function ListControls({
  onUp,
  onDown,
  onRemove,
  first,
  last,
  className,
}: {
  onUp: () => void
  onDown: () => void
  onRemove: () => void
  first: boolean
  last: boolean
  className?: string
}) {
  return (
    <div className={`flex gap-1 ${className ?? ''}`}>
      <Button variant="ghost" size="icon" className="h-11 w-11" aria-label="Mover para cima" onClick={onUp} disabled={first}><ArrowUp className="w-3.5 h-3.5" /></Button>
      <Button variant="ghost" size="icon" className="h-11 w-11" aria-label="Mover para baixo" onClick={onDown} disabled={last}><ArrowDown className="w-3.5 h-3.5" /></Button>
      <Button variant="ghost" size="icon" className="h-11 w-11" aria-label="Remover item" onClick={onRemove}><Trash2 className="w-3.5 h-3.5 text-destructive" /></Button>
    </div>
  )
}

function move<T>(list: T[], i: number, dir: -1 | 1): T[] {
  const j = i + dir
  if (j < 0 || j >= list.length) return list
  const copy = [...list]
  ;[copy[i], copy[j]] = [copy[j], copy[i]]
  return copy
}

// ─── página ───────────────────────────────────────────────────────

export default function AdminSitePage() {
  const [state, setState] = useState<Record<Lang, Dict> | null>(null)
  const [lang, setLang] = useState<Lang>('pt')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    getSiteContent()
      .then((ov) => {
        setState({
          pt: deepMerge(dict.pt, ov?.pt),
          en: deepMerge(dict.en, ov?.en),
        })
      })
      .catch(() => {
        setState({ pt: dict.pt, en: dict.en })
      })
  }, [])

  if (!state) {
    return (
      <div className="border border-border bg-black-4 p-8 flex justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  const d = state[lang]
  const patch = <K extends keyof Dict>(key: K, value: Partial<Dict[K]>) =>
    setState({ ...state, [lang]: { ...d, [key]: { ...(d[key] as object), ...value } } })

  async function handleSave() {
    if (!state) return
    for (const l of ['pt', 'en'] as const) {
      const invalidProject = state[l].projects.projects.find(
        (proj) => proj.href && !isHttpUrl(proj.href),
      )
      if (invalidProject) {
        toast.error('URL de projeto inválida (use http:// ou https://)')
        return
      }
    }
    setSaving(true)
    try {
      await saveSiteContent(state)
      toast.success('Conteúdo do site salvo')
    } catch {
      toast.error('Falha ao salvar')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <h1 className="text-2xl font-bold text-white">Conteúdo do Site</h1>
        <div className="flex items-center gap-2">
          <div className="flex items-center border border-input overflow-hidden">
            {(['pt', 'en'] as Lang[]).map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={`min-h-11 min-w-11 px-3 py-2.5 text-sm uppercase ${lang === l ? 'bg-white/15 text-white' : 'text-muted-foreground hover:text-white'}`}
              >
                {l}
              </button>
            ))}
          </div>
          <Button onClick={handleSave} disabled={saving} className="btn-brutal">
            {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
            Salvar
          </Button>
        </div>
      </div>

      <div className="space-y-6 max-w-3xl">
        {/* HERO */}
        <Card title="Hero">
          <AreaField label="Subtítulo" value={d.hero.subtitle} onChange={(v) => patch('hero', { subtitle: v })} />
          <Field label="CTA Projetos" value={d.hero.ctaProjects} onChange={(v) => patch('hero', { ctaProjects: v })} />
        </Card>

        {/* ABOUT */}
        <Card title="Sobre">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Título linha 1" value={d.about.title1} onChange={(v) => patch('about', { title1: v })} />
            <Field label="Título linha 2" value={d.about.title2} onChange={(v) => patch('about', { title2: v })} />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Texto antes do nome" value={d.about.p1Before} onChange={(v) => patch('about', { p1Before: v })} />
            <Field label="CTA" value={d.about.cta} onChange={(v) => patch('about', { cta: v })} />
          </div>
          <AreaField label="Texto depois do nome" value={d.about.p1After} onChange={(v) => patch('about', { p1After: v })} />
          <AreaField label="Segundo parágrafo" value={d.about.p2} onChange={(v) => patch('about', { p2: v })} />

          <div>
            <div className="flex items-center justify-between mb-2">
              <Label className="text-xs text-muted-foreground">Stack</Label>
              <Button
                variant="ghost" size="sm"
                onClick={() => patch('about', { stack: [...d.about.stack, { name: '', desc: '' }] })}
              >
                <Plus className="w-3.5 h-3.5 mr-1" /> Adicionar
              </Button>
            </div>
            <div className="space-y-2">
              {d.about.stack.map((item, i) => (
                <div key={i} className="flex flex-col gap-2 sm:flex-row sm:items-center">
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:flex-1">
                    <Input aria-label={`Stack ${i + 1} nome`} value={item.name} placeholder="Nome" onChange={(e) => {
                      const stack = [...d.about.stack]
                      stack[i] = { ...stack[i], name: e.target.value }
                      patch('about', { stack })
                    }} />
                    <Input aria-label={`Stack ${i + 1} descrição`} value={item.desc} placeholder="Descrição" onChange={(e) => {
                      const stack = [...d.about.stack]
                      stack[i] = { ...stack[i], desc: e.target.value }
                      patch('about', { stack })
                    }} />
                  </div>
                  <ListControls
                    className="shrink-0"
                    first={i === 0} last={i === d.about.stack.length - 1}
                    onUp={() => patch('about', { stack: move(d.about.stack, i, -1) })}
                    onDown={() => patch('about', { stack: move(d.about.stack, i, 1) })}
                    onRemove={() => patch('about', { stack: d.about.stack.filter((_, j) => j !== i) })}
                  />
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* PÁGINA /SOBRE */}
        <Card title="Página /sobre">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Label topo" value={d.sobre.label} onChange={(v) => patch('sobre', { label: v })} />
            <Field label="Role tag" value={d.sobre.roleTag} onChange={(v) => patch('sobre', { roleTag: v })} />
          </div>
          <Field label="Subtítulo hero" value={d.sobre.heroSubtitle} onChange={(v) => patch('sobre', { heroSubtitle: v })} />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Label origem" value={d.sobre.storyLabel} onChange={(v) => patch('sobre', { storyLabel: v })} />
            <Field label="Título origem" value={d.sobre.storyTitle} onChange={(v) => patch('sobre', { storyTitle: v })} />
          </div>
          <AreaField label="Origem — Parágrafo 1" value={d.sobre.storyP1} onChange={(v) => patch('sobre', { storyP1: v })} />
          <AreaField label="Origem — Parágrafo 2" value={d.sobre.storyP2} onChange={(v) => patch('sobre', { storyP2: v })} />
          <AreaField label="Origem — Parágrafo 3" value={d.sobre.storyP3} onChange={(v) => patch('sobre', { storyP3: v })} />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Legenda da foto" value={d.sobre.storyFigLabel} onChange={(v) => patch('sobre', { storyFigLabel: v })} />
            <Field label="Spec da foto" value={d.sobre.storyFigSpec} onChange={(v) => patch('sobre', { storyFigSpec: v })} />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Label filosofia" value={d.sobre.philLabel} onChange={(v) => patch('sobre', { philLabel: v })} />
            <Field label="Título filosofia" value={d.sobre.philTitle} onChange={(v) => patch('sobre', { philTitle: v })} />
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label className="text-xs text-muted-foreground">Frases de filosofia</Label>
              <Button
                variant="ghost" size="sm"
                onClick={() => patch('sobre', { philQuotes: [...d.sobre.philQuotes, { text: '', note: '' }] })}
              >
                <Plus className="w-3.5 h-3.5 mr-1" /> Adicionar
              </Button>
            </div>
            <div className="space-y-2">
              {d.sobre.philQuotes.map((q, i) => (
                <div key={i} className="flex flex-col gap-2 sm:flex-row sm:items-center">
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:flex-1">
                    <Input aria-label={`Filosofia ${i + 1} frase`} value={q.text} placeholder="Frase" onChange={(e) => {
                      const philQuotes = [...d.sobre.philQuotes]
                      philQuotes[i] = { ...philQuotes[i], text: e.target.value }
                      patch('sobre', { philQuotes })
                    }} />
                    <Input aria-label={`Filosofia ${i + 1} nota`} value={q.note} placeholder="Nota" onChange={(e) => {
                      const philQuotes = [...d.sobre.philQuotes]
                      philQuotes[i] = { ...philQuotes[i], note: e.target.value }
                      patch('sobre', { philQuotes })
                    }} />
                  </div>
                  <ListControls
                    className="shrink-0"
                    first={i === 0} last={i === d.sobre.philQuotes.length - 1}
                    onUp={() => patch('sobre', { philQuotes: move(d.sobre.philQuotes, i, -1) })}
                    onDown={() => patch('sobre', { philQuotes: move(d.sobre.philQuotes, i, 1) })}
                    onRemove={() => patch('sobre', { philQuotes: d.sobre.philQuotes.filter((_, j) => j !== i) })}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Label agora" value={d.sobre.nowLabel} onChange={(v) => patch('sobre', { nowLabel: v })} />
            <Field label="Título agora" value={d.sobre.nowTitle} onChange={(v) => patch('sobre', { nowTitle: v })} />
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label className="text-xs text-muted-foreground">Itens (Agora)</Label>
              <Button
                variant="ghost" size="sm"
                onClick={() => patch('sobre', { nowItems: [...d.sobre.nowItems, { label: '', value: '' }] })}
              >
                <Plus className="w-3.5 h-3.5 mr-1" /> Adicionar
              </Button>
            </div>
            <div className="space-y-2">
              {d.sobre.nowItems.map((item, i) => (
                <div key={i} className="flex flex-col gap-2 sm:flex-row sm:items-center">
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:flex-1">
                    <Input aria-label={`Agora ${i + 1} rótulo`} value={item.label} placeholder="Rótulo" onChange={(e) => {
                      const nowItems = [...d.sobre.nowItems]
                      nowItems[i] = { ...nowItems[i], label: e.target.value }
                      patch('sobre', { nowItems })
                    }} />
                    <Input aria-label={`Agora ${i + 1} valor`} value={item.value} placeholder="Valor" onChange={(e) => {
                      const nowItems = [...d.sobre.nowItems]
                      nowItems[i] = { ...nowItems[i], value: e.target.value }
                      patch('sobre', { nowItems })
                    }} />
                  </div>
                  <ListControls
                    className="shrink-0"
                    first={i === 0} last={i === d.sobre.nowItems.length - 1}
                    onUp={() => patch('sobre', { nowItems: move(d.sobre.nowItems, i, -1) })}
                    onDown={() => patch('sobre', { nowItems: move(d.sobre.nowItems, i, 1) })}
                    onRemove={() => patch('sobre', { nowItems: d.sobre.nowItems.filter((_, j) => j !== i) })}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Label colophon" value={d.sobre.colophonLabel} onChange={(v) => patch('sobre', { colophonLabel: v })} />
            <Field label="Título colophon" value={d.sobre.colophonTitle} onChange={(v) => patch('sobre', { colophonTitle: v })} />
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label className="text-xs text-muted-foreground">Itens (Colophon)</Label>
              <Button
                variant="ghost" size="sm"
                onClick={() => patch('sobre', { colophonItems: [...d.sobre.colophonItems, { label: '', value: '' }] })}
              >
                <Plus className="w-3.5 h-3.5 mr-1" /> Adicionar
              </Button>
            </div>
            <div className="space-y-2">
              {d.sobre.colophonItems.map((item, i) => (
                <div key={i} className="flex flex-col gap-2 sm:flex-row sm:items-center">
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:flex-1">
                    <Input aria-label={`Colophon ${i + 1} rótulo`} value={item.label} placeholder="Rótulo" onChange={(e) => {
                      const colophonItems = [...d.sobre.colophonItems]
                      colophonItems[i] = { ...colophonItems[i], label: e.target.value }
                      patch('sobre', { colophonItems })
                    }} />
                    <Input aria-label={`Colophon ${i + 1} valor`} value={item.value} placeholder="Valor" onChange={(e) => {
                      const colophonItems = [...d.sobre.colophonItems]
                      colophonItems[i] = { ...colophonItems[i], value: e.target.value }
                      patch('sobre', { colophonItems })
                    }} />
                  </div>
                  <ListControls
                    className="shrink-0"
                    first={i === 0} last={i === d.sobre.colophonItems.length - 1}
                    onUp={() => patch('sobre', { colophonItems: move(d.sobre.colophonItems, i, -1) })}
                    onDown={() => patch('sobre', { colophonItems: move(d.sobre.colophonItems, i, 1) })}
                    onRemove={() => patch('sobre', { colophonItems: d.sobre.colophonItems.filter((_, j) => j !== i) })}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Título CTA contato" value={d.sobre.ctaContact} onChange={(v) => patch('sobre', { ctaContact: v })} />
            <Field label="Assunto do e-mail" value={d.sobre.emailSubject} onChange={(v) => patch('sobre', { emailSubject: v })} />
          </div>
        </Card>

        {/* SKILLS */}
        <Card title="Skills">
          <Field label="Título" value={d.skills.title} onChange={(v) => patch('skills', { title: v })} />
          <div className="space-y-4">
            {d.skills.categories.map((cat, i) => (
              <div key={i} className="border border-input p-3 space-y-3">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                  <div className="grid grid-cols-[4rem_minmax(0,1fr)] items-center gap-2 sm:flex sm:flex-1">
                    <Input aria-label={`Categoria ${i + 1} ID`} value={cat.id} placeholder="01" className="w-16" onChange={(e) => {
                      const categories = [...d.skills.categories]
                      categories[i] = { ...categories[i], id: e.target.value }
                      patch('skills', { categories })
                    }} />
                    <Input aria-label={`Categoria ${i + 1} título`} value={cat.title} placeholder="Título" onChange={(e) => {
                      const categories = [...d.skills.categories]
                      categories[i] = { ...categories[i], title: e.target.value }
                      patch('skills', { categories })
                    }} />
                  </div>
                  <ListControls
                    className="shrink-0"
                    first={i === 0} last={i === d.skills.categories.length - 1}
                    onUp={() => patch('skills', { categories: move(d.skills.categories, i, -1) })}
                    onDown={() => patch('skills', { categories: move(d.skills.categories, i, 1) })}
                    onRemove={() => patch('skills', { categories: d.skills.categories.filter((_, j) => j !== i) })}
                  />
                </div>
                <LinesField
                  label="Itens"
                  value={cat.items}
                  onChange={(items) => {
                    const categories = [...d.skills.categories]
                    categories[i] = { ...categories[i], items }
                    patch('skills', { categories })
                  }}
                />
              </div>
            ))}
            <Button
              variant="ghost" size="sm"
              onClick={() => patch('skills', { categories: [...d.skills.categories, { id: '', title: '', items: [] }] })}
            >
              <Plus className="w-3.5 h-3.5 mr-1" /> Nova categoria
            </Button>
          </div>
        </Card>

        {/* EXPERIÊNCIA */}
        <Card title="Experiência">
          <Field label="Título" value={d.experience.title} onChange={(v) => patch('experience', { title: v })} />
          <div className="space-y-4">
            {d.experience.timeline.map((item, i) => (
              <div key={i} className="border border-input p-3 space-y-3">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                  <div className="grid grid-cols-[6rem_minmax(0,1fr)] items-center gap-2 sm:flex sm:flex-1">
                    <Input aria-label={`Experiência ${i + 1} ano`} value={item.year} placeholder="ATUAL" className="w-24" onChange={(e) => {
                      const timeline = [...d.experience.timeline]
                      timeline[i] = { ...timeline[i], year: e.target.value }
                      patch('experience', { timeline })
                    }} />
                    <Input aria-label={`Experiência ${i + 1} cargo`} value={item.title} placeholder="Cargo — Empresa" onChange={(e) => {
                      const timeline = [...d.experience.timeline]
                      timeline[i] = { ...timeline[i], title: e.target.value }
                      patch('experience', { timeline })
                    }} />
                  </div>
                  <ListControls
                    className="shrink-0"
                    first={i === 0} last={i === d.experience.timeline.length - 1}
                    onUp={() => patch('experience', { timeline: move(d.experience.timeline, i, -1) })}
                    onDown={() => patch('experience', { timeline: move(d.experience.timeline, i, 1) })}
                    onRemove={() => patch('experience', { timeline: d.experience.timeline.filter((_, j) => j !== i) })}
                  />
                </div>
                <AreaField label="Descrição" value={item.body} rows={2} onChange={(v) => {
                  const timeline = [...d.experience.timeline]
                  timeline[i] = { ...timeline[i], body: v }
                  patch('experience', { timeline })
                }} />
                <Field label="Tag" value={item.tag} onChange={(v) => {
                  const timeline = [...d.experience.timeline]
                  timeline[i] = { ...timeline[i], tag: v }
                  patch('experience', { timeline })
                }} />
              </div>
            ))}
            <Button
              variant="ghost" size="sm"
              onClick={() => patch('experience', { timeline: [...d.experience.timeline, { year: '', title: '', body: '', tag: '' }] })}
            >
              <Plus className="w-3.5 h-3.5 mr-1" /> Novo item
            </Button>
          </div>
        </Card>

        {/* PROJETOS */}
        <Card title="Projetos">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Título" value={d.projects.title} onChange={(v) => patch('projects', { title: v })} />
            <Field label="Contador" value={d.projects.count} onChange={(v) => patch('projects', { count: v })} />
          </div>
          <div className="space-y-4">
            {d.projects.projects.map((proj, i) => (
              <div key={i} className="border border-input p-3 space-y-3">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                  <div className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-2 sm:flex sm:flex-1">
                    <span className="font-mono text-xs text-muted-foreground">{proj.id}</span>
                    <Input aria-label={`Projeto ${i + 1} nome`} value={proj.title} placeholder="Nome" onChange={(e) => {
                      const projects = [...d.projects.projects]
                      projects[i] = { ...projects[i], title: e.target.value }
                      patch('projects', { projects })
                    }} />
                  </div>
                  <ListControls
                    className="shrink-0"
                    first={i === 0} last={i === d.projects.projects.length - 1}
                    onUp={() => patch('projects', { projects: move(d.projects.projects, i, -1) })}
                    onDown={() => patch('projects', { projects: move(d.projects.projects, i, 1) })}
                    onRemove={() => patch('projects', { projects: d.projects.projects.filter((_, j) => j !== i) })}
                  />
                </div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <Field label="Tipo" value={proj.kind} onChange={(v) => {
                    const projects = [...d.projects.projects]
                    projects[i] = { ...projects[i], kind: v }
                    patch('projects', { projects })
                  }} />
                  <Field label="URL (produção)" value={proj.href} onChange={(v) => {
                    const projects = [...d.projects.projects]
                    projects[i] = { ...projects[i], href: v }
                    patch('projects', { projects })
                  }} />
                </div>
                <AreaField label="Descrição" value={proj.body} rows={2} onChange={(v) => {
                  const projects = [...d.projects.projects]
                  projects[i] = { ...projects[i], body: v }
                  patch('projects', { projects })
                }} />
                <Field label="Tags (separadas por vírgula)" value={proj.tags.join(', ')} onChange={(v) => {
                  const projects = [...d.projects.projects]
                  projects[i] = { ...projects[i], tags: v.split(',').map((s) => s.trim()).filter(Boolean) }
                  patch('projects', { projects })
                }} />
                <CmsImageField
                  label="Imagem"
                  value={proj.img}
                  aspect="aspect-[16/10]"
                  onChange={(url) => {
                    const projects = [...d.projects.projects]
                    projects[i] = { ...projects[i], img: url }
                    patch('projects', { projects })
                  }}
                />
                <Field label="Alt da imagem" value={proj.alt} onChange={(v) => {
                  const projects = [...d.projects.projects]
                  projects[i] = { ...projects[i], alt: v }
                  patch('projects', { projects })
                }} />
              </div>
            ))}
            <Button
              variant="ghost" size="sm"
              onClick={() => patch('projects', { projects: [...d.projects.projects, { id: String(d.projects.projects.length + 1).padStart(2, '0'), title: '', kind: '', body: '', img: '', alt: '', tags: [], href: '' }] })}
            >
              <Plus className="w-3.5 h-3.5 mr-1" /> Novo projeto
            </Button>
          </div>
        </Card>

        {/* BACKEND */}
        <Card title="Backend">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Field label="Título linha 1" value={d.backend.title1} onChange={(v) => patch('backend', { title1: v })} />
            <Field label="Título linha 2" value={d.backend.title2} onChange={(v) => patch('backend', { title2: v })} />
            <Field label="CTA GitHub" value={d.backend.cta} onChange={(v) => patch('backend', { cta: v })} />
          </div>
          <AreaField label="Descrição" value={d.backend.body} onChange={(v) => patch('backend', { body: v })} />

          <div className="space-y-4">
            <Label className="text-xs text-muted-foreground block">Features</Label>
            {d.backend.features.map((feat, i) => (
              <div key={i} className="border border-input p-3 space-y-3">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                  <Input aria-label={`Feature ${i + 1} título`} value={feat.title} placeholder="Título da feature" className="sm:flex-1" onChange={(e) => {
                    const features = [...d.backend.features]
                    features[i] = { ...features[i], title: e.target.value }
                    patch('backend', { features })
                  }} />
                  <ListControls
                    className="shrink-0"
                    first={i === 0} last={i === d.backend.features.length - 1}
                    onUp={() => patch('backend', { features: move(d.backend.features, i, -1) })}
                    onDown={() => patch('backend', { features: move(d.backend.features, i, 1) })}
                    onRemove={() => patch('backend', { features: d.backend.features.filter((_, j) => j !== i) })}
                  />
                </div>
                <AreaField label="Descrição" value={feat.body} rows={2} onChange={(v) => {
                  const features = [...d.backend.features]
                  features[i] = { ...features[i], body: v }
                  patch('backend', { features })
                }} />
              </div>
            ))}
            <Button
              variant="ghost" size="sm"
              onClick={() => patch('backend', { features: [...d.backend.features, { title: '', body: '' }] })}
            >
              <Plus className="w-3.5 h-3.5 mr-1" /> Nova feature
            </Button>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <Label className="text-xs text-muted-foreground">Endpoints (terminal)</Label>
              <Button
                variant="ghost" size="sm"
                onClick={() => patch('backend', { endpoints: [...d.backend.endpoints, { method: 'GET', path: '', note: '' }] })}
              >
                <Plus className="w-3.5 h-3.5 mr-1" /> Novo endpoint
              </Button>
            </div>
            <div className="space-y-2">
              {d.backend.endpoints.map((ep, i) => (
                <div key={i} className="flex flex-col gap-2 sm:flex-row sm:items-center">
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-[5rem_minmax(0,1fr)_minmax(0,1fr)] sm:flex-1">
                    <Input aria-label={`Endpoint ${i + 1} método`} value={ep.method} placeholder="GET" onChange={(e) => {
                      const endpoints = [...d.backend.endpoints]
                      endpoints[i] = { ...endpoints[i], method: e.target.value }
                      patch('backend', { endpoints })
                    }} />
                    <Input aria-label={`Endpoint ${i + 1} rota`} value={ep.path} placeholder="/api/v1/..." onChange={(e) => {
                      const endpoints = [...d.backend.endpoints]
                      endpoints[i] = { ...endpoints[i], path: e.target.value }
                      patch('backend', { endpoints })
                    }} />
                    <Input aria-label={`Endpoint ${i + 1} nota`} value={ep.note} placeholder="Nota" onChange={(e) => {
                      const endpoints = [...d.backend.endpoints]
                      endpoints[i] = { ...endpoints[i], note: e.target.value }
                      patch('backend', { endpoints })
                    }} />
                  </div>
                  <ListControls
                    className="shrink-0"
                    first={i === 0} last={i === d.backend.endpoints.length - 1}
                    onUp={() => patch('backend', { endpoints: move(d.backend.endpoints, i, -1) })}
                    onDown={() => patch('backend', { endpoints: move(d.backend.endpoints, i, 1) })}
                    onRemove={() => patch('backend', { endpoints: d.backend.endpoints.filter((_, j) => j !== i) })}
                  />
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* CONTATO */}
        <Card title="Contato">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="CTA e-mail" value={d.contact.cta} onChange={(v) => patch('contact', { cta: v })} />
            <Field label="Status (terminal)" value={d.contact.status} onChange={(v) => patch('contact', { status: v })} />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Field label="Título linha 1" value={d.contact.title1} onChange={(v) => patch('contact', { title1: v })} />
            <Field label="Título linha 2" value={d.contact.title2} onChange={(v) => patch('contact', { title2: v })} />
            <Field label="Título linha 3" value={d.contact.title3} onChange={(v) => patch('contact', { title3: v })} />
          </div>
          <AreaField label="Subtítulo" value={d.contact.subtitle} onChange={(v) => patch('contact', { subtitle: v })} />
        </Card>

        {/* TICKERS + FOOTER + NAVBAR */}
        <Card title="Divisórias (tickers)">
          <Field label="T1" value={d.tickers.t1} onChange={(v) => patch('tickers', { t1: v })} />
        </Card>

        <Card title="Rodapé">
          <AreaField label="Descrição" value={d.footer.desc} rows={2} onChange={(v) => patch('footer', { desc: v })} />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Botão e-mail" value={d.footer.sendEmail} onChange={(v) => patch('footer', { sendEmail: v })} />
            <Field label="Direitos" value={d.footer.rights} onChange={(v) => patch('footer', { rights: v })} />
          </div>
        </Card>

        <Card title="Navbar">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Home" value={d.navbar.home} onChange={(v) => patch('navbar', { home: v })} />
            <Field label="Sobre" value={d.navbar.about} onChange={(v) => patch('navbar', { about: v })} />
          </div>
        </Card>
      </div>
    </div>
  )
}
