'use client'

import { useState } from 'react'
import { Pencil, Plus, Trash2, Upload } from 'lucide-react'
import { fileToDataUrl } from '@/lib/image'
import { formatPrice } from '@/lib/store-defaults'
import type { Category, Product } from '@/lib/store-types'
import { useStore } from '@/components/store/store-provider'
import { inputClass, labelClass } from '@/components/store/modal'
import { AdminCard } from './admin-gate'

const CATEGORY_LABEL: Record<Category, string> = {
  clothes: 'Rad',
  shoes: 'Soulye',
  accessories: 'Akseswa',
  services: 'Sèvis/Lòt',
}

type Draft = Omit<Product, 'id' | 'price' | 'oldPrice'> & { price: string; oldPrice: string }

const EMPTY: Draft = { name: '', price: '', oldPrice: '', category: 'clothes', special: false, description: '', image: '' }

export function AdminProducts() {
  const { products, setProducts, settings } = useStore()
  const [draft, setDraft] = useState<Draft>(EMPTY)
  const [editingId, setEditingId] = useState<string | null>(null)

  const set = <K extends keyof Draft>(key: K, value: Draft[K]) => setDraft((d) => ({ ...d, [key]: value }))

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    set('image', await fileToDataUrl(file))
    e.target.value = ''
  }

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const price = Number(draft.price)
    const oldPrice = Number(draft.oldPrice)
    if (!draft.name.trim() || !(price > 0)) return
    const product: Product = {
      id: editingId ?? crypto.randomUUID(),
      name: draft.name.trim(),
      price,
      oldPrice: oldPrice > price ? oldPrice : undefined,
      category: draft.category,
      special: draft.special,
      description: draft.description.trim(),
      image: draft.image.trim(),
    }
    setProducts((prev) => (editingId ? prev.map((p) => (p.id === editingId ? product : p)) : [product, ...prev]))
    setDraft(EMPTY)
    setEditingId(null)
  }

  const edit = (p: Product) => {
    setEditingId(p.id)
    setDraft({ ...p, price: String(p.price), oldPrice: p.oldPrice ? String(p.oldPrice) : '' })
    window.scrollTo({ top: 0 })
  }

  const remove = (id: string) => {
    if (confirm('Èske w sèten ou vle efase pwodwi sa a?')) setProducts((prev) => prev.filter((p) => p.id !== id))
  }

  return (
    <div className="space-y-6">
      <AdminCard
        title={editingId ? 'Modifye pwodwi a' : 'Ajoute yon nouvo pwodwi'}
        description="Pri yo antre an HTG (deviz de baz). Yo konvèti otomatikman pou kliyan yo."
      >
        <form onSubmit={submit} className="grid gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <label htmlFor="p-name" className={labelClass}>Non *</label>
            <input id="p-name" required value={draft.name} onChange={(e) => set('name', e.target.value)} className={inputClass} />
          </div>
          <div>
            <label htmlFor="p-price" className={labelClass}>Pri (HTG) *</label>
            <input id="p-price" required type="number" min="1" step="any" value={draft.price} onChange={(e) => set('price', e.target.value)} className={inputClass} />
          </div>
          <div>
            <label htmlFor="p-old" className={labelClass}>Ansyen pri (HTG)</label>
            <input id="p-old" type="number" min="0" step="any" value={draft.oldPrice} onChange={(e) => set('oldPrice', e.target.value)} className={inputClass} />
          </div>
          <div>
            <label htmlFor="p-cat" className={labelClass}>Kategori</label>
            <select id="p-cat" value={draft.category} onChange={(e) => set('category', e.target.value as Category)} className={inputClass}>
              {(Object.keys(CATEGORY_LABEL) as Category[]).map((c) => (
                <option key={c} value={c}>{CATEGORY_LABEL[c]}</option>
              ))}
            </select>
          </div>
          <label className="flex items-center gap-3 self-end rounded-lg border border-border px-3 py-2.5 text-sm font-medium">
            <input type="checkbox" checked={draft.special} onChange={(e) => set('special', e.target.checked)} className="size-4 accent-brand" />
            Mete l nan Kazye Spesyal 🔥
          </label>
          <div className="md:col-span-2">
            <label htmlFor="p-desc" className={labelClass}>Deskripsyon</label>
            <textarea id="p-desc" rows={2} value={draft.description} onChange={(e) => set('description', e.target.value)} className={inputClass} />
          </div>
          <div className="md:col-span-2">
            <span className={labelClass}>Foto (telechaje oswa URL)</span>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              {draft.image && <img src={draft.image} alt="Apèsi" className="size-20 shrink-0 rounded-lg object-cover" />}
              <label className="inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-border px-4 py-2.5 text-sm font-medium hover:border-brand">
                <Upload className="size-4" />
                Telechaje foto
                <input type="file" accept="image/*" onChange={handleFile} className="sr-only" />
              </label>
              <input
                aria-label="URL foto"
                placeholder="https://..."
                value={draft.image.startsWith('data:') ? '' : draft.image}
                onChange={(e) => set('image', e.target.value)}
                className={inputClass}
              />
            </div>
          </div>
          <div className="flex gap-2 md:col-span-2">
            <button type="submit" className="inline-flex h-11 items-center gap-2 rounded-full bg-brand px-6 font-semibold text-brand-foreground">
              <Plus className="size-4" />
              {editingId ? 'Sove chanjman yo' : 'Ajoute pwodwi a'}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null)
                  setDraft(EMPTY)
                }}
                className="h-11 rounded-full border border-border px-5 font-medium"
              >
                Anile
              </button>
            )}
          </div>
        </form>
      </AdminCard>

      <AdminCard title={`Pwodwi yo (${products.length})`}>
        <ul className="divide-y divide-border">
          {products.map((p) => (
            <li key={p.id} className="flex items-center gap-3 py-3">
              <img src={p.image || '/placeholder.svg'} alt="" className="size-14 shrink-0 rounded-lg object-cover" />
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium">
                  {p.name} {p.special && <span className="ml-1 rounded bg-[#E11D48]/10 px-1.5 py-0.5 text-[10px] font-bold text-[#E11D48]">SPESYAL</span>}
                </p>
                <p className="text-xs text-muted-foreground">
                  {CATEGORY_LABEL[p.category]} · {formatPrice(p.price, 'HTG', settings.rates)}
                  {p.oldPrice ? ` (ansyen: ${formatPrice(p.oldPrice, 'HTG', settings.rates)})` : ''}
                </p>
              </div>
              <button type="button" onClick={() => edit(p)} aria-label={`Modifye ${p.name}`} className="rounded-lg p-2 hover:bg-muted">
                <Pencil className="size-4" />
              </button>
              <button type="button" onClick={() => remove(p.id)} aria-label={`Efase ${p.name}`} className="rounded-lg p-2 text-[#E11D48] hover:bg-[#E11D48]/10">
                <Trash2 className="size-4" />
              </button>
            </li>
          ))}
        </ul>
      </AdminCard>
    </div>
  )
}
