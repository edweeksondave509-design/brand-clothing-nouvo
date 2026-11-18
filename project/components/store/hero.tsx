'use client'

import { ArrowRight } from 'lucide-react'
import { whatsappLink } from '@/lib/store-defaults'
import { useStore } from './store-provider'
import { FacebookIcon, InstagramIcon, SantaHat, WhatsAppIcon } from './brand-icons'

export function Hero() {
  const { settings, t } = useStore()

  return (
    <section id="top" className="relative isolate overflow-hidden bg-ink text-paper">
      <img
        src={settings.cover || '/placeholder.svg'}
        alt=""
        className="absolute inset-0 -z-10 size-full object-cover opacity-60"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-ink via-ink/80 to-ink/20" />

      <div className="mx-auto flex max-w-7xl flex-col items-start gap-6 px-4 py-20 sm:px-6 md:py-28 lg:py-32">
        <div className="relative">
          <img
            src={settings.logo || '/placeholder.svg'}
            alt={`${settings.storeName} logo`}
            className="size-20 rounded-full border-2 border-paper/80 object-cover shadow-xl md:size-24"
          />
          {settings.santaHat && <SantaHat className="absolute -top-7 -left-4 w-16 -rotate-12 drop-shadow md:w-20" />}
        </div>

        <div className="max-w-2xl">
          <h1 className="font-heading text-4xl font-bold tracking-tight text-balance sm:text-5xl md:text-6xl lg:text-7xl">
            {settings.storeName}
          </h1>
          <p className="mt-3 text-lg text-paper/80 md:text-xl">{settings.tagline}</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <a
            href="#catalog"
            className="inline-flex h-12 items-center gap-2 rounded-full bg-brand px-6 font-semibold text-brand-foreground shadow-lg transition hover:brightness-110"
          >
            {t('discover')}
            <ArrowRight className="size-4" />
          </a>
          <a
            href={whatsappLink(settings.whatsapp)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-12 items-center gap-2 rounded-full bg-[#25D366] px-6 font-semibold text-white shadow-lg transition hover:brightness-105"
          >
            <WhatsAppIcon className="size-5" />
            {t('whatsappUs')}
          </a>
          <a
            href={settings.instagram}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="flex size-12 items-center justify-center rounded-full border border-paper/30 bg-paper/10 backdrop-blur transition hover:bg-paper/20"
          >
            <InstagramIcon className="size-5" />
          </a>
          <a
            href={settings.facebook}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
            className="flex size-12 items-center justify-center rounded-full border border-paper/30 bg-paper/10 backdrop-blur transition hover:bg-paper/20"
          >
            <FacebookIcon className="size-5" />
          </a>
        </div>
      </div>
    </section>
  )
}
