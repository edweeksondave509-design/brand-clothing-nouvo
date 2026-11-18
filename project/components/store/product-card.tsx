'use client'

import { useState } from 'react'
import { Check, ShoppingBag } from 'lucide-react'
import type { Product } from '@/lib/store-types'
import { useStore } from './store-provider'

export function ProductCard({ product }: { product: Product }) {
  const { price, t, addToCart } = useStore()
  const [justAdded, setJustAdded] = useState(false)
  const hasDiscount = !!product.oldPrice && product.oldPrice > product.price
  const percent = hasDiscount ? Math.round(((product.oldPrice! - product.price) / product.oldPrice!) * 100) : 0

  const handleAdd = () => {
    addToCart(product.id)
    setJustAdded(true)
    setTimeout(() => setJustAdded(false), 1200)
  }

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition hover:-translate-y-0.5 hover:shadow-xl">
      <div className="relative aspect-square overflow-hidden bg-muted">
        <img
          src={product.image || '/placeholder.svg'}
          alt={product.name}
          loading="lazy"
          className="size-full object-cover transition duration-500 group-hover:scale-105"
        />
        {hasDiscount && (
          <span className="absolute top-3 left-3 rounded-full bg-[#E11D48] px-2.5 py-1 text-xs font-bold text-white shadow">
            -{percent}% {t('discountBadge')}
          </span>
        )}
        <span className="absolute top-3 right-3 rounded-full bg-background/90 px-2.5 py-1 text-[11px] font-medium backdrop-blur">
          {t(product.category)}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="font-heading font-semibold leading-snug">{product.name}</h3>
        <p className="line-clamp-2 text-sm text-muted-foreground">{product.description}</p>
        <div className="mt-auto flex items-baseline gap-2 pt-2">
          <span className="text-lg font-bold">{price(product.price)}</span>
          {hasDiscount && (
            <span className="text-sm text-muted-foreground line-through">{price(product.oldPrice!)}</span>
          )}
        </div>
        <button
          type="button"
          onClick={handleAdd}
          className="mt-1 inline-flex h-10 items-center justify-center gap-2 rounded-full bg-ink text-sm font-semibold text-paper transition hover:bg-brand hover:text-brand-foreground"
        >
          {justAdded ? <Check className="size-4" /> : <ShoppingBag className="size-4" />}
          {justAdded ? t('added') : t('addToCart')}
        </button>
      </div>
    </article>
  )
}
