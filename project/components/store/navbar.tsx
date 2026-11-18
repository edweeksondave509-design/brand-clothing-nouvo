'use client'

import { ShoppingBag } from 'lucide-react'
import { LANGUAGES } from '@/lib/i18n'
import { CURRENCIES, whatsappLink } from '@/lib/store-defaults'
import type { Currency, Lang } from '@/lib/store-types'
import { useStore } from './store-provider'
import { FacebookIcon, InstagramIcon, SantaHat, WhatsAppIcon } from './brand-icons'

const selectClass =
  'h-9 cursor-pointer rounded-full border border-border bg-background px-2.5 text-xs font-medium outline-none transition hover:border-foreground/30 focus:border-brand sm:text-sm'

export function Navbar() {
  const { settings, lang, setLang, currency, setCurrency, cartCount, setCartOpen, t } = useStore()

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-7xl items-center gap-2 px-4 sm:gap-4 sm:px-6">
        <a href="#top" className="flex min-w-0 items-center gap-2.5">
          <span className="relative shrink-0">
            <img
              src={settings.logo || '/placeholder.svg'}
              alt={`${settings.storeName} logo`}
              className="size-9 rounded-full border border-border object-cover sm:size-10"
            />
            {settings.santaHat && <SantaHat className="absolute -top-3 -left-1.5 w-7 -rotate-12" />}
          </span>
          <span className="hidden truncate font-heading text-base font-bold tracking-tight min-[420px]:block sm:text-lg">
            {settings.storeName}
          </span>
        </a>

        <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
          <label className="sr-only" htmlFor="lang-select">
            {t('language')}
          </label>
          <select
            id="lang-select"
            value={lang}
            onChange={(e) => setLang(e.target.value as Lang)}
            className={selectClass}
          >
            {LANGUAGES.map((l) => (
              <option key={l.code} value={l.code}>
                {l.flag} {l.label}
              </option>
            ))}
          </select>

          <label className="sr-only" htmlFor="currency-select">
            {t('currency')}
          </label>
          <select
            id="currency-select"
            value={currency}
            onChange={(e) => setCurrency(e.target.value as Currency)}
            className={selectClass}
          >
            {CURRENCIES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.label}
              </option>
            ))}
          </select>

          <div className="hidden items-center gap-1 md:flex">
            <a
              href={whatsappLink(settings.whatsapp)}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className="rounded-full p-2 text-[#25D366] transition hover:bg-muted"
            >
              <WhatsAppIcon className="size-5" />
            </a>
            <a
              href={settings.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="rounded-full p-2 text-[#E4405F] transition hover:bg-muted"
            >
              <InstagramIcon className="size-5" />
            </a>
            <a
              href={settings.facebook}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="rounded-full p-2 text-[#1877F2] transition hover:bg-muted"
            >
              <FacebookIcon className="size-5" />
            </a>
          </div>

          <button
            type="button"
            onClick={() => setCartOpen(true)}
            className="relative flex h-9 items-center gap-2 rounded-full bg-ink px-3 text-sm font-medium text-paper transition hover:opacity-90 sm:px-4"
            aria-label={`${t('cart')} (${cartCount})`}
          >
            <ShoppingBag className="size-4" />
            <span className="hidden sm:inline">{t('cart')}</span>
            <span className="flex size-5 items-center justify-center rounded-full bg-brand text-[11px] font-bold text-brand-foreground">
              {cartCount}
            </span>
          </button>
        </div>
      </nav>
    </header>
  )
}
