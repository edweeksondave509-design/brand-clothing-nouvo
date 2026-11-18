'use client'

import { useEffect, useState } from 'react'
import { Lock, Package, Palette, Settings2, Ticket, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useStore } from '@/components/store/store-provider'
import { inputClass, labelClass, Modal } from '@/components/store/modal'
import { AdminProducts } from './admin-products'
import { AdminVip } from './admin-vip'
import { AdminTheme } from './admin-theme'
import { AdminSettings } from './admin-settings'

const TABS = [
  { id: 'products', label: 'Jere Pwodwi yo', icon: Package },
  { id: 'vip', label: 'Kazye Spesyal & Kòd VIP', icon: Ticket },
  { id: 'theme', label: 'Dekorasyon & Sezon', icon: Palette },
  { id: 'settings', label: 'Paramèt Boutik & Peman', icon: Settings2 },
] as const

type TabId = (typeof TABS)[number]['id']

export function AdminGate() {
  const { adminOpen, setAdminOpen, settings } = useStore()
  const [authed, setAuthed] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)
  const [tab, setTab] = useState<TabId>('products')

  useEffect(() => {
    const checkHash = () => {
      if (window.location.hash.toLowerCase() === '#admin') setAdminOpen(true)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'a') {
        e.preventDefault()
        setAdminOpen(true)
      }
    }
    checkHash()
    window.addEventListener('hashchange', checkHash)
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('hashchange', checkHash)
      window.removeEventListener('keydown', onKey)
    }
  }, [setAdminOpen])

  const close = () => {
    setAdminOpen(false)
    setPassword('')
    setError(false)
    if (window.location.hash.toLowerCase() === '#admin') {
      history.replaceState(null, '', window.location.pathname + window.location.search)
    }
  }

  const login = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === settings.adminPassword) {
      setAuthed(true)
      setError(false)
      setPassword('')
    } else {
      setError(true)
    }
  }

  if (!adminOpen) return null

  if (!authed) {
    return (
      <Modal open onClose={close} title="Aksè Administratè">
        <form onSubmit={login} className="space-y-4 p-5">
          <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-ink text-paper">
            <Lock className="size-6" />
          </span>
          <div>
            <label htmlFor="admin-pass" className={labelClass}>Modpas</label>
            <input
              id="admin-pass"
              type="password"
              autoFocus
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                setError(false)
              }}
              className={inputClass}
            />
            {error && <p className="mt-1.5 text-xs text-[#E11D48]">Modpas la pa kòrèk.</p>}
          </div>
          <button type="submit" className="h-11 w-full rounded-full bg-brand font-semibold text-brand-foreground">
            Antre
          </button>
        </form>
      </Modal>
    )
  }

  return (
    <div className="fixed inset-0 z-[80] flex flex-col bg-paper" role="dialog" aria-modal="true" aria-label="Panno Administratè">
      <header className="flex items-center justify-between border-b border-border bg-ink px-4 py-3 text-paper sm:px-6">
        <div className="flex items-center gap-3">
          <img src={settings.logo || '/placeholder.svg'} alt="" className="size-9 rounded-full object-cover" />
          <div>
            <p className="font-heading font-bold">Panno Administratè</p>
            <p className="text-xs text-paper/60">{settings.storeName}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setAuthed(false)
              close()
            }}
            className="rounded-full border border-paper/20 px-3 py-1.5 text-xs font-medium hover:bg-paper/10"
          >
            Dekonekte
          </button>
          <button type="button" onClick={close} aria-label="Fèmen" className="rounded-full p-2 hover:bg-paper/10">
            <X className="size-5" />
          </button>
        </div>
      </header>

      <div className="flex flex-1 flex-col overflow-hidden md:flex-row">
        <nav className="flex shrink-0 gap-1 overflow-x-auto border-b border-border bg-background p-2 md:w-64 md:flex-col md:border-r md:border-b-0 md:p-3" aria-label="Onglet Admin">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              aria-current={tab === id ? 'page' : undefined}
              className={cn(
                'flex shrink-0 items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition',
                tab === id ? 'bg-brand text-brand-foreground' : 'hover:bg-muted',
              )}
            >
              <Icon className="size-4 shrink-0" />
              {label}
            </button>
          ))}
        </nav>
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-5xl">
            {tab === 'products' && <AdminProducts />}
            {tab === 'vip' && <AdminVip />}
            {tab === 'theme' && <AdminTheme />}
            {tab === 'settings' && <AdminSettings />}
          </div>
        </main>
      </div>
    </div>
  )
}

export function AdminCard({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-border bg-background p-5 sm:p-6">
      <h2 className="font-heading text-lg font-bold">{title}</h2>
      {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
      <div className="mt-5">{children}</div>
    </section>
  )
}
