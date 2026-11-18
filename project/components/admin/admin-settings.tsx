'use client'

import { useState } from 'react'
import { Check, Save, Upload } from 'lucide-react'
import { fileToDataUrl } from '@/lib/image'
import { CURRENCIES, DEFAULT_RATES, formatPrice } from '@/lib/store-defaults'
import type { Currency, Settings } from '@/lib/store-types'
import { useStore } from '@/components/store/store-provider'
import { inputClass, labelClass } from '@/components/store/modal'
import { AdminCard } from './admin-gate'

type TextKey = {
  [K in keyof Settings]: Settings[K] extends string ? K : never
}[keyof Settings]

function Field({ id, label, value, onChange, type = 'text' }: { id: string; label: string; value: string | number; onChange: (v: string) => void; type?: string }) {
  return (
    <div>
      <label htmlFor={id} className={labelClass}>{label}</label>
      <input id={id} type={type} value={value} onChange={(e) => onChange(e.target.value)} className={inputClass} />
    </div>
  )
}

export function AdminSettings() {
  const { settings, updateSettings } = useStore()
  const [draft, setDraft] = useState<Settings>(settings)
  const [saved, setSaved] = useState(false)

  const set = <K extends keyof Settings>(key: K, value: Settings[K]) => {
    setDraft((d) => ({ ...d, [key]: value }))
    setSaved(false)
  }
  const text = (key: TextKey) => ({ value: draft[key] as string, onChange: (v: string) => set(key, v) })

  const upload = (key: 'logo' | 'cover', max: number) => async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    set(key, await fileToDataUrl(file, max))
    e.target.value = ''
  }

  const save = (e: React.FormEvent) => {
    e.preventDefault()
    if (!draft.adminPassword.trim()) {
      alert('Modpas Admin pa ka vid.')
      return
    }
    updateSettings({
      ...draft,
      freeShippingThreshold: Math.max(0, Number(draft.freeShippingThreshold) || 0),
      shippingFee: Math.max(0, Number(draft.shippingFee) || 0),
    })
    setSaved(true)
  }

  return (
    <form onSubmit={save} className="space-y-6 pb-24">
      <AdminCard title="Deviz monnen" description="Chwazi deviz prensipal boutik la epi ajiste to konvèsyon yo (konbyen HTG pou 1 inite).">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label htmlFor="s-cur" className={labelClass}>Deviz prensipal</label>
            <select id="s-cur" value={draft.defaultCurrency} onChange={(e) => set('defaultCurrency', e.target.value as Currency)} className={inputClass}>
              {CURRENCIES.map((c) => (
                <option key={c.code} value={c.code}>{c.label}</option>
              ))}
            </select>
          </div>
          <p className="self-end rounded-lg bg-muted px-3 py-2.5 text-xs text-muted-foreground">
            Egzanp: 1,500 HTG = {formatPrice(1500, draft.defaultCurrency, draft.rates)}
          </p>
          {CURRENCIES.filter((c) => c.code !== 'HTG').map((c) => (
            <div key={c.code}>
              <label htmlFor={`rate-${c.code}`} className={labelClass}>1 {c.label} = ? HTG</label>
              <input
                id={`rate-${c.code}`}
                type="number"
                min="0.0001"
                step="any"
                value={draft.rates[c.code]}
                onChange={(e) => set('rates', { ...draft.rates, [c.code]: Number(e.target.value) || DEFAULT_RATES[c.code] })}
                className={inputClass}
              />
            </div>
          ))}
        </div>
      </AdminCard>

      <AdminCard title="Idantite boutik la">
        <div className="grid gap-4 md:grid-cols-2">
          <Field id="s-name" label="Non magazen an" {...text('storeName')} />
          <Field id="s-tag" label="Sou-tit" {...text('tagline')} />
          <div>
            <span className={labelClass}>Logo</span>
            <div className="flex items-center gap-3">
              <img src={draft.logo || '/placeholder.svg'} alt="Logo" className="size-14 rounded-full object-cover" />
              <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-dashed border-border px-3 py-2 text-sm hover:border-brand">
                <Upload className="size-4" /> Telechaje
                <input type="file" accept="image/*" onChange={upload('logo', 400)} className="sr-only" />
              </label>
            </div>
            <input aria-label="URL logo" placeholder="https://..." value={draft.logo.startsWith('data:') ? '' : draft.logo} onChange={(e) => set('logo', e.target.value)} className={`${inputClass} mt-2`} />
          </div>
          <div>
            <span className={labelClass}>Foto kouvèti</span>
            <div className="flex items-center gap-3">
              <img src={draft.cover || '/placeholder.svg'} alt="Kouvèti" className="h-14 w-24 rounded-lg object-cover" />
              <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-dashed border-border px-3 py-2 text-sm hover:border-brand">
                <Upload className="size-4" /> Telechaje
                <input type="file" accept="image/*" onChange={upload('cover', 1600)} className="sr-only" />
              </label>
            </div>
            <input aria-label="URL kouvèti" placeholder="https://..." value={draft.cover.startsWith('data:') ? '' : draft.cover} onChange={(e) => set('cover', e.target.value)} className={`${inputClass} mt-2`} />
          </div>
        </div>
      </AdminCard>

      <AdminCard title="Peman">
        <div className="grid gap-4 md:grid-cols-2">
          <Field id="s-moncash" label="Nimewo MonCash" {...text('moncash')} />
          <Field id="s-natcash" label="Nimewo Natcash" {...text('natcash')} />
          <Field id="s-zelle" label="Enfòmasyon Zelle" {...text('zelle')} />
          <Field id="s-paypal" label="Enfòmasyon PayPal" {...text('paypal')} />
        </div>
      </AdminCard>

      <AdminCard title="Kontak & Rezo sosyal">
        <div className="grid gap-4 md:grid-cols-2">
          <Field id="s-wa" label="Nimewo WhatsApp (ak kòd peyi, ex: 50937000000)" {...text('whatsapp')} />
          <Field id="s-email" label="Imèl kontak" type="email" {...text('email')} />
          <Field id="s-ig" label="Lyen Instagram" {...text('instagram')} />
          <Field id="s-fb" label="Lyen Facebook" {...text('facebook')} />
        </div>
      </AdminCard>

      <AdminCard title="Livrezon & Sekirite" description="Montan yo an HTG (deviz de baz).">
        <div className="grid gap-4 md:grid-cols-3">
          <Field id="s-free" label="Livrezon gratis apati (HTG)" type="number" value={draft.freeShippingThreshold} onChange={(v) => set('freeShippingThreshold', Number(v))} />
          <Field id="s-fee" label="Frè livrezon (HTG)" type="number" value={draft.shippingFee} onChange={(v) => set('shippingFee', Number(v))} />
          <Field id="s-pass" label="Modpas Admin" type="password" {...text('adminPassword')} />
        </div>
      </AdminCard>

      <div className="fixed right-0 bottom-0 left-0 z-10 border-t border-border bg-background/95 px-4 py-3 backdrop-blur md:left-64">
        <div className="mx-auto flex max-w-5xl items-center justify-end gap-3">
          {saved && (
            <span className="flex items-center gap-1 text-sm font-medium text-[#16A34A]">
              <Check className="size-4" /> Sove!
            </span>
          )}
          <button type="submit" className="inline-flex h-11 items-center gap-2 rounded-full bg-brand px-6 font-semibold text-brand-foreground">
            <Save className="size-4" /> Sove paramèt yo
          </button>
        </div>
      </div>
    </form>
  )
}
