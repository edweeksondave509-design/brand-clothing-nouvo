'use client'

import { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useStore } from '@/components/store/store-provider'
import { inputClass, labelClass } from '@/components/store/modal'
import { AdminCard } from './admin-gate'

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: () => void; label: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={onChange}
      className={cn('relative h-6 w-11 shrink-0 rounded-full transition', checked ? 'bg-brand' : 'bg-border')}
    >
      <span className={cn('absolute top-0.5 left-0.5 size-5 rounded-full bg-white shadow transition', checked && 'translate-x-5')} />
    </button>
  )
}

export function AdminVip() {
  const { vipCodes, setVipCodes, products, setProducts } = useStore()
  const [code, setCode] = useState('')
  const [percent, setPercent] = useState('')

  const add = (e: React.FormEvent) => {
    e.preventDefault()
    const c = code.trim().toUpperCase().replace(/\s+/g, '')
    const p = Math.round(Number(percent))
    if (!c || !(p > 0 && p <= 100)) return
    if (vipCodes.some((v) => v.code.toUpperCase() === c)) {
      alert('Kòd sa a egziste deja.')
      return
    }
    setVipCodes((prev) => [...prev, { id: crypto.randomUUID(), code: c, percent: p, active: true }])
    setCode('')
    setPercent('')
  }

  return (
    <div className="space-y-6">
      <AdminCard title="Kòd Rabè VIP" description="Kreye, aktive/dezaktive oswa efase kòd rabè yo.">
        <form onSubmit={add} className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="flex-1">
            <label htmlFor="v-code" className={labelClass}>Kòd</label>
            <input id="v-code" value={code} onChange={(e) => setCode(e.target.value)} placeholder="NOEL25" className={cn(inputClass, 'uppercase')} />
          </div>
          <div className="sm:w-32">
            <label htmlFor="v-pct" className={labelClass}>Pousantaj %</label>
            <input id="v-pct" type="number" min="1" max="100" value={percent} onChange={(e) => setPercent(e.target.value)} className={inputClass} />
          </div>
          <button type="submit" className="inline-flex h-[42px] items-center justify-center gap-2 rounded-lg bg-brand px-5 font-semibold text-brand-foreground">
            <Plus className="size-4" />
            Kreye
          </button>
        </form>
        {vipCodes.length === 0 ? (
          <p className="text-sm text-muted-foreground">Pa gen kòd pou kounye a.</p>
        ) : (
          <ul className="divide-y divide-border">
            {vipCodes.map((v) => (
              <li key={v.id} className="flex items-center gap-3 py-3">
                <span className="rounded-md border-2 border-dashed border-brand px-2.5 py-1 font-mono text-sm font-bold text-brand">{v.code}</span>
                <span className="text-sm font-medium">-{v.percent}%</span>
                <span className={cn('ml-auto text-xs font-medium', v.active ? 'text-[#16A34A]' : 'text-muted-foreground')}>
                  {v.active ? 'Aktif' : 'Inaktif'}
                </span>
                <Toggle
                  checked={v.active}
                  label={`Aktive ${v.code}`}
                  onChange={() => setVipCodes((prev) => prev.map((x) => (x.id === v.id ? { ...x, active: !x.active } : x)))}
                />
                <button
                  type="button"
                  aria-label={`Efase ${v.code}`}
                  onClick={() => setVipCodes((prev) => prev.filter((x) => x.id !== v.id))}
                  className="rounded-lg p-2 text-[#E11D48] hover:bg-[#E11D48]/10"
                >
                  <Trash2 className="size-4" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </AdminCard>

      <AdminCard title="Kazye Espas Spesyal 🔥" description="Aktive oswa dezaktive pwodwi ki parèt nan seksyon espesyal la nan yon sèl klik.">
        <ul className="divide-y divide-border">
          {products.map((p) => (
            <li key={p.id} className="flex items-center gap-3 py-3">
              <img src={p.image || '/placeholder.svg'} alt="" className="size-12 shrink-0 rounded-lg object-cover" />
              <p className="min-w-0 flex-1 truncate text-sm font-medium">{p.name}</p>
              <Toggle
                checked={p.special}
                label={`Kazye Spesyal: ${p.name}`}
                onChange={() => setProducts((prev) => prev.map((x) => (x.id === p.id ? { ...x, special: !x.special } : x)))}
              />
            </li>
          ))}
        </ul>
      </AdminCard>
    </div>
  )
}

export { Toggle }
