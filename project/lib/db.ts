import { DEFAULT_SETTINGS } from './store-defaults'
import type { Category, Product, Settings, VipCode } from './store-types'

export const SETTINGS_ROW_ID = 1

const CATEGORIES: Category[] = ['clothes', 'shoes', 'accessories', 'services']

type Row = Record<string, unknown>

export function rowToProduct(r: Row): Product {
  const oldPrice = Number(r.old_price)
  const category = String(r.category) as Category
  return {
    id: String(r.id),
    name: String(r.name ?? ''),
    price: Number(r.price) || 0,
    oldPrice: oldPrice > 0 ? oldPrice : undefined,
    category: CATEGORIES.includes(category) ? category : 'clothes',
    special: Boolean(r.special),
    description: String(r.description ?? ''),
    image: String(r.image ?? ''),
  }
}

export function productToRow(p: Omit<Product, 'id'>) {
  return {
    name: p.name,
    price: p.price,
    old_price: p.oldPrice ?? null,
    category: p.category,
    special: p.special,
    description: p.description,
    image: p.image,
  }
}

export function rowToVipCode(r: Row): VipCode {
  return {
    id: String(r.id),
    code: String(r.code ?? ''),
    percent: Number(r.percent) || 0,
    active: Boolean(r.active),
  }
}

export function dataToSettings(data: unknown): Settings {
  const stored = (data && typeof data === 'object' ? data : {}) as Partial<Settings>
  return { ...DEFAULT_SETTINGS, ...stored, rates: { ...DEFAULT_SETTINGS.rates, ...stored.rates } }
}

export const SETTINGS_KEYS = Object.keys(DEFAULT_SETTINGS) as (keyof Settings)[]
