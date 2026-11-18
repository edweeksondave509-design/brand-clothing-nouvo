'use client'

import { useRef, useState } from 'react'
import { Clock, Mail } from 'lucide-react'
import { whatsappLink } from '@/lib/store-defaults'
import { useStore } from './store-provider'
import { FacebookIcon, InstagramIcon, SantaHat, WhatsAppIcon } from './brand-icons'
import { inputClass, labelClass, Modal } from './modal'

export function Footer() {
  const { settings, t, setAdminOpen } = useStore()
  const [lateOpen, setLateOpen] = useState(false)
  const taps = useRef<number[]>([])

  const handleSecretTap = () => {
    const now = Date.now()
    taps.current = [...taps.current.filter((ts) => now - ts < 2500), now]
    if (taps.current.length >= 5) {
      taps.current = []
      setAdminOpen(true)
    }
  }

  return (
    <footer className="bg-ink text-paper">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-3">
            <span className="relative">
              <img src={settings.logo || '/placeholder.svg'} alt={`${settings.storeName} logo`} className="size-12 rounded-full object-cover" />
              {settings.santaHat && <SantaHat className="absolute -top-4 -left-2 w-9 -rotate-12" />}
            </span>
            <div>
              <p className="font-heading text-lg font-bold">{settings.storeName}</p>
              <p className="text-sm text-paper/60">{settings.tagline}</p>
            </div>
          </div>
          <p className="mt-4 max-w-xs text-sm text-paper/60">{t('footerAbout')}</p>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-paper/80">{t('contact')}</h3>
          <a href={`mailto:${settings.email}`} className="flex items-center gap-2 text-sm text-paper/70 transition hover:text-paper">
            <Mail className="size-4" />
            {settings.email}
          </a>
          <button
            type="button"
            onClick={() => setLateOpen(true)}
            className="mt-4 inline-flex items-center gap-2 rounded-full border border-paper/20 px-4 py-2.5 text-sm font-medium transition hover:border-brand hover:bg-brand hover:text-brand-foreground"
          >
            <Clock className="size-4" />
            {t('lateOrder')}
          </button>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-paper/80">{t('followUs')}</h3>
          <div className="flex gap-2">
            <a href={whatsappLink(settings.whatsapp)} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="flex size-11 items-center justify-center rounded-full bg-paper/10 transition hover:bg-[#25D366]">
              <WhatsAppIcon className="size-5" />
            </a>
            <a href={settings.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="flex size-11 items-center justify-center rounded-full bg-paper/10 transition hover:bg-[#E4405F]">
              <InstagramIcon className="size-5" />
            </a>
            <a href={settings.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="flex size-11 items-center justify-center rounded-full bg-paper/10 transition hover:bg-[#1877F2]">
              <FacebookIcon className="size-5" />
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-paper/10">
        <p
          onClick={handleSecretTap}
          className="mx-auto max-w-7xl cursor-default px-4 py-5 pb-24 text-center text-xs text-paper/50 select-none sm:px-6 md:pb-5"
        >
          © 2026 {settings.storeName}. {t('rights')}
        </p>
      </div>

      <LateOrderModal open={lateOpen} onClose={() => setLateOpen(false)} />
    </footer>
  )
}

function LateOrderModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { t, settings } = useStore()
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [details, setDetails] = useState('')

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const msg = [
      '*SWIVI KÒMAND AN RETA - BRAND CLOTHING*',
      '',
      `*Non:* ${name.trim()}`,
      `*WhatsApp:* ${phone.trim()}`,
      `*Dat / Detay kòmand:* ${details.trim()}`,
    ].join('\n')
    window.open(whatsappLink(settings.whatsapp, msg), '_blank', 'noopener,noreferrer')
    setName('')
    setPhone('')
    setDetails('')
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose} title={t('lateModalTitle')}>
      <form onSubmit={submit} className="space-y-4 p-5 text-foreground">
        <div>
          <label htmlFor="late-name" className={labelClass}>{t('fullName')} *</label>
          <input id="late-name" required value={name} onChange={(e) => setName(e.target.value)} className={inputClass} />
        </div>
        <div>
          <label htmlFor="late-phone" className={labelClass}>{t('whatsappNumber')} *</label>
          <input id="late-phone" required type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className={inputClass} />
        </div>
        <div>
          <label htmlFor="late-details" className={labelClass}>{t('orderDetails')} *</label>
          <textarea id="late-details" required rows={3} value={details} onChange={(e) => setDetails(e.target.value)} className={inputClass} />
        </div>
        <button type="submit" className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-[#25D366] font-semibold text-white">
          <WhatsAppIcon className="size-5" />
          {t('send')}
        </button>
      </form>
    </Modal>
  )
}
