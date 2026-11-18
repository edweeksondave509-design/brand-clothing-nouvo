'use client'

import { Crown, Ticket, Truck } from 'lucide-react'
import { useStore } from './store-provider'

export function VipBanner() {
  const { settings, vipCodes, price, t, setPendingCode, setCartOpen } = useStore()
  const activeCodes = vipCodes.filter((c) => c.active)

  const applyCode = (code: string) => {
    navigator.clipboard?.writeText(code).catch(() => {})
    setPendingCode(code)
    setCartOpen(true)
  }

  return (
    <section aria-labelledby="benefits-title" className="border-b border-border bg-background">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-5 sm:px-6 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-ink text-paper">
            <Crown className="size-5" />
          </span>
          <div>
            <h2 id="benefits-title" className="font-heading text-sm font-bold uppercase tracking-wider">
              {t('benefitsTitle')}
            </h2>
            <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Truck className="size-4 text-brand" />
              {t('freeShippingFrom', { amount: price(settings.freeShippingThreshold) })}
            </p>
          </div>
        </div>

        {activeCodes.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-muted-foreground">{t('clickToApply')}:</span>
            {activeCodes.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => applyCode(c.code)}
                className="inline-flex items-center gap-2 rounded-full border-2 border-dashed border-brand bg-brand/5 px-4 py-1.5 text-sm font-bold text-brand transition hover:bg-brand hover:text-brand-foreground"
                aria-label={`${t('vipCodeLabel')}: ${c.code} -${c.percent}%`}
              >
                <Ticket className="size-4" />
                {c.code}
                <span className="font-medium">-{c.percent}%</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
