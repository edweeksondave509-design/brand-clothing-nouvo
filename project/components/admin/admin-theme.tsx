'use client'

import { useState } from 'react'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Theme } from '@/lib/store-types'
import { useStore } from '@/components/store/store-provider'
import { SantaHat } from '@/components/store/brand-icons'
import { inputClass, labelClass } from '@/components/store/modal'
import { AdminCard } from './admin-gate'
import { Toggle } from './admin-vip'

const THEMES: { id: Theme; label: string; colors: string[]; message: string }[] = [
  { id: 'normal', label: 'Nòmal', colors: ['#0066FF', '#1A1A1A'], message: '' },
  { id: 'christmas', label: 'Nwèl & Fen Ane', colors: ['#C8102E', '#0F7B3E'], message: 'Jwaye Nwèl & Bòn Ane! Pwofite pwomosyon fen ane yo.' },
  { id: 'valentine', label: 'Sen Valanten', colors: ['#E0245E', '#FBCFE8'], message: 'Sen Valanten: fè moun ou renmen an yon kado ki gen stil!' },
  { id: 'blackfriday', label: 'Black Friday', colors: ['#FACC15', '#1A1A1A'], message: 'BLACK FRIDAY: Gwo rabè sou tout boutik la!' },
  { id: 'summer', label: 'Ete & Kanaval', colors: ['#F97316', '#06B6D4'], message: 'Ete & Kanaval: Nouvo koleksyon pou pran plezi!' },
]

export function AdminTheme() {
  const { settings, updateSettings } = useStore()
  const [message, setMessage] = useState(settings.seasonMessage)

  return (
    <div className="space-y-6">
      <AdminCard title="Tèm sit la" description="Chwazi yon tèm sezon. Koulè sit la ap chanje touswit.">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {THEMES.map((th) => (
            <button
              key={th.id}
              type="button"
              onClick={() => {
                const patch: Parameters<typeof updateSettings>[0] = { theme: th.id }
                if (!message.trim() || THEMES.some((x) => x.message === message)) {
                  patch.seasonMessage = th.message
                  setMessage(th.message)
                }
                if (th.id === 'christmas') patch.santaHat = true
                updateSettings(patch)
              }}
              aria-pressed={settings.theme === th.id}
              className={cn(
                'flex items-center gap-3 rounded-xl border-2 p-4 text-left transition',
                settings.theme === th.id ? 'border-brand bg-brand/5' : 'border-border hover:border-foreground/30',
              )}
            >
              <span className="flex -space-x-2">
                {th.colors.map((c) => (
                  <span key={c} className="size-7 rounded-full border-2 border-background" style={{ backgroundColor: c }} />
                ))}
              </span>
              <span className="flex-1 text-sm font-semibold">{th.label}</span>
              {settings.theme === th.id && <Check className="size-4 text-brand" />}
            </button>
          ))}
        </div>
      </AdminCard>

      <AdminCard title="Chapo Nwèl sou logo a">
        <div className="flex items-center gap-4">
          <span className="relative">
            <img src={settings.logo || '/placeholder.svg'} alt="" className="size-16 rounded-full object-cover" />
            {settings.santaHat && <SantaHat className="absolute -top-5 -left-3 w-12 -rotate-12" />}
          </span>
          <p className="flex-1 text-sm text-muted-foreground">Aktive oswa retire Chapo Nwèl la anlè logo a sou tout sit la.</p>
          <Toggle checked={settings.santaHat} label="Chapo Nwèl" onChange={() => updateSettings({ santaHat: !settings.santaHat })} />
        </div>
      </AdminCard>

      <AdminCard title="Mesaj espesyal sezon" description="Mesaj sa a parèt nan yon ba anlè paj la. Kite l vid pou kache l.">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            updateSettings({ seasonMessage: message })
          }}
          className="flex flex-col gap-3 sm:flex-row sm:items-end"
        >
          <div className="flex-1">
            <label htmlFor="season-msg" className={labelClass}>Mesaj</label>
            <input id="season-msg" value={message} onChange={(e) => setMessage(e.target.value)} className={inputClass} />
          </div>
          <button type="submit" className="h-[42px] rounded-lg bg-brand px-5 font-semibold text-brand-foreground">Sove</button>
          <button
            type="button"
            onClick={() => {
              setMessage('')
              updateSettings({ seasonMessage: '' })
            }}
            className="h-[42px] rounded-lg border border-border px-5 font-medium"
          >
            Retire
          </button>
        </form>
      </AdminCard>
    </div>
  )
}
