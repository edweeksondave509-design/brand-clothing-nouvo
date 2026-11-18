'use client'

import { Gift, Globe2, Truck } from 'lucide-react'
import { useStore } from './store-provider'

export function VipClub() {
  const { t, price, settings } = useStore()
  const cards = [
    { icon: Truck, title: t('vipFreeTitle'), desc: t('vipFreeDesc', { amount: price(settings.freeShippingThreshold) }) },
    { icon: Gift, title: t('vipCodesTitle'), desc: t('vipCodesDesc') },
    { icon: Globe2, title: t('vipPayTitle'), desc: t('vipPayDesc') },
  ]

  return (
    <section aria-labelledby="vip-club-title" className="mx-auto max-w-7xl px-4 pb-16 sm:px-6">
      <div className="mb-6 text-center">
        <h2 id="vip-club-title" className="font-heading text-2xl font-bold sm:text-3xl">
          {t('vipClubTitle')}
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">{t('vipClubSubtitle')}</p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {cards.map(({ icon: Icon, title, desc }) => (
          <div key={title} className="rounded-2xl border border-border bg-card p-6 transition hover:border-brand">
            <span className="mb-4 flex size-12 items-center justify-center rounded-xl bg-brand/10 text-brand">
              <Icon className="size-6" />
            </span>
            <h3 className="font-heading font-semibold">{title}</h3>
            <p className="mt-1.5 text-sm text-muted-foreground">{desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
