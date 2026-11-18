'use client'

import { Flame } from 'lucide-react'
import { useStore } from './store-provider'
import { ProductCard } from './product-card'

export function SpecialSection() {
  const { products, t } = useStore()
  const specials = products.filter((p) => p.special)
  if (specials.length === 0) return null

  return (
    <section aria-labelledby="special-title" className="mx-auto max-w-7xl px-4 pt-14 sm:px-6">
      <div className="rounded-3xl bg-ink p-5 text-paper sm:p-8">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <h2 id="special-title" className="flex items-center gap-2 font-heading text-2xl font-bold sm:text-3xl">
              {t('specialTitle')}
              <Flame className="size-7 text-[#FF6B35]" />
            </h2>
            <p className="mt-1 text-sm text-paper/70">{t('specialSubtitle')}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 text-foreground sm:gap-5 lg:grid-cols-4">
          {specials.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </section>
  )
}
