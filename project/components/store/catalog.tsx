'use client'

import { useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Category } from '@/lib/store-types'
import { useStore } from './store-provider'
import { ProductCard } from './product-card'

const FILTERS: ('all' | Category)[] = ['all', 'clothes', 'shoes', 'accessories', 'services']

export function Catalog() {
  const { products, t } = useStore()
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<'all' | Category>('all')

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase()
    return products.filter(
      (p) =>
        (filter === 'all' || p.category === filter) &&
        (!q || p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)),
    )
  }, [products, query, filter])

  return (
    <section id="catalog" aria-labelledby="catalog-title" className="mx-auto max-w-7xl scroll-mt-20 px-4 py-14 sm:px-6">
      <div className="mb-6 flex flex-col gap-1">
        <h2 id="catalog-title" className="font-heading text-2xl font-bold sm:text-3xl">
          {t('catalogTitle')}
        </h2>
        <p className="text-sm text-muted-foreground">{t('catalogSubtitle')}</p>
      </div>

      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full lg:max-w-sm">
          <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <label htmlFor="search" className="sr-only">
            {t('searchPlaceholder')}
          </label>
          <input
            id="search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('searchPlaceholder')}
            className="h-11 w-full rounded-full border border-border bg-background pr-4 pl-10 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
          />
        </div>
        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 lg:mx-0 lg:px-0" role="group" aria-label="Filters">
          {FILTERS.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              aria-pressed={filter === f}
              className={cn(
                'h-10 shrink-0 rounded-full border px-4 text-sm font-medium transition',
                filter === f
                  ? 'border-brand bg-brand text-brand-foreground'
                  : 'border-border bg-background hover:border-foreground/30',
              )}
            >
              {t(f)}
            </button>
          ))}
        </div>
      </div>

      {visible.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-border py-16 text-center text-muted-foreground">
          {t('noResults')}
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
          {visible.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </section>
  )
}
