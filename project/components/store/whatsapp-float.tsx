'use client'

import { whatsappLink } from '@/lib/store-defaults'
import { useStore } from './store-provider'
import { WhatsAppIcon } from './brand-icons'

export function WhatsAppFloat() {
  const { settings, t } = useStore()
  return (
    <a
      href={whatsappLink(settings.whatsapp)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t('whatsappUs')}
      className="fixed right-4 bottom-4 z-50 flex h-14 items-center gap-2 rounded-full bg-[#25D366] px-4 font-semibold text-white shadow-xl transition hover:scale-105 sm:right-6 sm:bottom-6"
    >
      <WhatsAppIcon className="size-6" />
      <span className="hidden sm:inline">{t('whatsappUs')}</span>
    </a>
  )
}
