'use client'

import { useEffect, useRef, useState } from 'react'
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
  return (
    <div>
      <Label className="text-xs text-muted-foreground">{label}</Label>
      <Input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="mt-1" />
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
  return (
    <div>
      <Label className="text-xs text-muted-foreground">{label}</Label>
      <Textarea value={value} rows={rows} onChange={(e) => onChange(e.target.value)} className="mt-1" />
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
      <Label className="text-xs text-muted-foreground">{label}</Label>
      <div className={`mt-1 relative overflow-hidden rounded-lg border border-input bg-black/30 ${aspect}`}>
        {value ? (
          <Image src={value} alt="" fill className="object-cover" unoptimized />
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
          className="inline-flex items-center gap-1.5 rounded-md border border-input px-3 py-1.5 text-sm text-muted-foreground hover:text-white transition-colors disabled:opacity-50"
        >
          <ImagePlus className="w-4 h-4" />
          Upload
        </button>
        {value && (
          <button
            type="button"
            onClick={() => onChange('')}
            className="inline-flex items-center gap-1.5 rounded-md border border-input px-3 py-1.5 text-sm text-muted-foreground hover:text-destructive transition-colors"
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
    <section className="glass-card p-5">
      <h2 className="text-sm font-bold uppercase tracking-widest text-cyan mb-4">{title}</h2>
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
      <Button variant="ghost" size="icon" className="h-11 w-11" onClick={onUp} disabled={first}><ArrowUp className="w-3.5 h-3.5" /></Button>
      <Button variant="ghost" size="icon" className="h-11 w-11" onClick={onDown} disabled={last}><ArrowDown className="w-3.5 h-3.5" /></Button>
      <Button variant="ghost" size="icon" className="h-11 w-11" onClick={onRemove}><Trash2 className="w-3.5 h-3.5 text-destructive" /></Button>
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
      <div className="glass-card p-8 flex justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  const d = state[lang]
  const patch = <K extends keyof Dict>(key: K, value: Partial<Dict[K]>) =>
    setState({ ...state, [lang]: { ...d, [key]: { ...(d[key] as object), ...value } } })

  async function handleSave() {
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
          <div className="flex items-center border border-input rounded-md overflow-hidden">
            {(['pt', 'en'] as Lang[]).map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={`px-3 py-2.5 text-sm uppercase ${lang === l ? 'bg-primary/20 text-primary' : 'text-muted-foreground hover:text-white'}`}
              >
                {l}
              </button>
            ))}
          </div>
          <Button onClick={handleSave} disabled={saving} className="btn-primary-gradient rounded-full">
            {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
            Salvar
          </Button>
        </div>
      </div>

      <div className="space-y-6 max-w-3xl">
        {/* HERO */}
        <Card title="Hero">
          <Field label="Label (cargo)" value={d.hero.label} onChange={(v) => patch('hero', { label: v })} />
          <AreaField label="Subtítulo" value={d.hero.subtitle} onChange={(v) => patch('hero', { subtitle: v })} />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="CTA Projetos" value={d.hero.ctaProjects} onChange={(v) => patch('hero', { ctaProjects: v })} />
            <Field label="CTA Sobre" value={d.hero.ctaAbout} onChange={(v) => patch('hero', { ctaAbout: v })} />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Field label="Link Sobre" value={d.hero.aboutLink} onChange={(v) => patch('hero', { aboutLink: v })} />
            <Field label="Coordenadas" value={d.hero.coords} onChange={(v) => patch('hero', { coords: v })} />
            <Field label="Local" value={d.hero.place} onChange={(v) => patch('hero', { place: v })} />
          </div>
        </Card>

        {/* ABOUT */}
        <Card title="Sobre">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Label intro" value={d.about.intro} onChange={(v) => patch('about', { intro: v })} />
            <Field label="CTA" value={d.about.cta} onChange={(v) => patch('about', { cta: v })} />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Título linha 1" value={d.about.title1} onChange={(v) => patch('about', { title1: v })} />
            <Field label="Título linha 2" value={d.about.title2} onChange={(v) => patch('about', { title2: v })} />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Texto antes do nome" value={d.about.p1Before} onChange={(v) => patch('about', { p1Before: v })} />
            <AreaField label="Texto depois do nome" value={d.about.p1After} onChange={(v) => patch('about', { p1After: v })} />
          </div>
          <AreaField label="Segundo parágrafo" value={d.about.p2} onChange={(v) => patch('about', { p2: v })} />
          <Field label="Label da stack" value={d.about.stackLabel} onChange={(v) => patch('about', { stackLabel: v })} />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Legenda da foto" value={d.about.figLabel} onChange={(v) => patch('about', { figLabel: v })} />
            <Field label="Spec da foto" value={d.about.figSpec} onChange={(v) => patch('about', { figSpec: v })} />
          </div>

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
                    <Input value={item.name} placeholder="Nome" onChange={(e) => {
                      const stack = [...d.about.stack]
                      stack[i] = { ...stack[i], name: e.target.value }
                      patch('about', { stack })
                    }} />
                    <Input value={item.desc} placeholder="Descrição" onChange={(e) => {
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

        {/* SKILLS */}
        <Card title="Skills">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Label" value={d.skills.label} onChange={(v) => patch('skills', { label: v })} />
            <Field label="Título" value={d.skills.title} onChange={(v) => patch('skills', { title: v })} />
          </div>
          <div className="space-y-4">
            {d.skills.categories.map((cat, i) => (
              <div key={i} className="border border-input rounded-lg p-3 space-y-3">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                  <div className="grid grid-cols-[4rem_minmax(0,1fr)] items-center gap-2 sm:flex sm:flex-1">
                    <Input value={cat.id} placeholder="01" className="w-16" onChange={(e) => {
                      const categories = [...d.skills.categories]
                      categories[i] = { ...categories[i], id: e.target.value }
                      patch('skills', { categories })
                    }} />
                    <Input value={cat.title} placeholder="Título" onChange={(e) => {
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
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Label" value={d.experience.label} onChange={(v) => patch('experience', { label: v })} />
            <Field label="Título" value={d.experience.title} onChange={(v) => patch('experience', { title: v })} />
          </div>
          <div className="space-y-4">
            {d.experience.timeline.map((item, i) => (
              <div key={i} className="border border-input rounded-lg p-3 space-y-3">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                  <div className="grid grid-cols-[6rem_minmax(0,1fr)] items-center gap-2 sm:flex sm:flex-1">
                    <Input value={item.year} placeholder="ATUAL" className="w-24" onChange={(e) => {
                      const timeline = [...d.experience.timeline]
                      timeline[i] = { ...timeline[i], year: e.target.value }
                      patch('experience', { timeline })
                    }} />
                    <Input value={item.title} placeholder="Cargo — Empresa" onChange={(e) => {
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
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Field label="Label" value={d.projects.label} onChange={(v) => patch('projects', { label: v })} />
            <Field label="Título" value={d.projects.title} onChange={(v) => patch('projects', { title: v })} />
            <Field label="Contador" value={d.projects.count} onChange={(v) => patch('projects', { count: v })} />
          </div>
          <div className="space-y-4">
            {d.projects.projects.map((proj, i) => (
              <div key={i} className="border border-input rounded-lg p-3 space-y-3">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                  <div className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-2 sm:flex sm:flex-1">
                    <span className="font-mono text-xs text-muted-foreground">{proj.id}</span>
                    <Input value={proj.title} placeholder="Nome" onChange={(e) => {
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

        {/* CONTATO */}
        <Card title="Contato">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Field label="Label" value={d.contact.label} onChange={(v) => patch('contact', { label: v })} />
            <Field label="CTA e-mail" value={d.contact.cta} onChange={(v) => patch('contact', { cta: v })} />
            <Field label="CTA sobre" value={d.contact.aboutCta} onChange={(v) => patch('contact', { aboutCta: v })} />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Field label="Título linha 1" value={d.contact.title1} onChange={(v) => patch('contact', { title1: v })} />
            <Field label="Título linha 2" value={d.contact.title2} onChange={(v) => patch('contact', { title2: v })} />
            <Field label="Título linha 3" value={d.contact.title3} onChange={(v) => patch('contact', { title3: v })} />
          </div>
          <AreaField label="Subtítulo" value={d.contact.subtitle} onChange={(v) => patch('contact', { subtitle: v })} />
          <Field label="Status (terminal)" value={d.contact.status} onChange={(v) => patch('contact', { status: v })} />
        </Card>

        {/* TICKERS + FOOTER + NAVBAR */}
        <Card title="Divisórias (tickers)">
          <div className="grid grid-cols-1 gap-4">
            {(['t1', 't2', 't3', 't4', 't5'] as const).map((k) => (
              <Field key={k} label={k.toUpperCase()} value={d.tickers[k]} onChange={(v) => patch('tickers', { [k]: v })} />
            ))}
          </div>
        </Card>

        <Card title="Rodapé">
          <AreaField label="Descrição" value={d.footer.desc} rows={2} onChange={(v) => patch('footer', { desc: v })} />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Field label="Coluna navegação" value={d.footer.navLabel} onChange={(v) => patch('footer', { navLabel: v })} />
            <Field label="Link Home" value={d.footer.home} onChange={(v) => patch('footer', { home: v })} />
            <Field label="Link Sobre" value={d.footer.about} onChange={(v) => patch('footer', { about: v })} />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Field label="Coluna contato" value={d.footer.contactLabel} onChange={(v) => patch('footer', { contactLabel: v })} />
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

        <Card title="Abertura">
          <Field label="Frase de abertura" value={d.preloader.strap} onChange={(v) => patch('preloader', { strap: v })} />
        </Card>
      </div>
    </div>
  )
}
