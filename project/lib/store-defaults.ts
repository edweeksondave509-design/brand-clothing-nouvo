import type { Currency, Product, Settings, VipCode } from './store-types'

export const DEFAULT_PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'Mayo Koton Nwa',
    price: 1500,
    oldPrice: 2000,
    category: 'clothes',
    special: true,
    description: 'Mayo 100% koton, dous, konfòtab, pou chak jou.',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400',
  },
  {
    id: 'p2',
    name: 'Tenis Espò Blan',
    price: 4500,
    oldPrice: 5500,
    category: 'shoes',
    special: true,
    description: 'Tenis lejè ak sèmèl ki absòbe chòk, pou espò ak vil.',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
  },
  {
    id: 'p3',
    name: 'Mont Klasik Kwi',
    price: 3200,
    category: 'accessories',
    special: false,
    description: 'Mont elegan ak braslè an kwi otantik.',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
  },
  {
    id: 'p4',
    name: 'Linèt Solèy Modèn',
    price: 1200,
    oldPrice: 1600,
    category: 'accessories',
    special: true,
    description: 'Pwoteksyon UV400 ak yon stil ki modèn.',
    image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400',
  },
  {
    id: 'p5',
    name: 'Jakèt Jeans Ble',
    price: 3800,
    category: 'clothes',
    special: false,
    description: 'Jakèt jeans klasik, solid, ki mache ak tout bagay.',
    image: 'https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?w=400',
  },
  {
    id: 'p6',
    name: 'Sakado Vwayaj',
    price: 2900,
    category: 'accessories',
    special: false,
    description: 'Sakado laj, enpèmeyab, ak plas pou laptop.',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400',
  },
]

export const DEFAULT_VIP_CODES: VipCode[] = [
  { id: 'v1', code: 'VIP10', percent: 10, active: true },
  { id: 'v2', code: 'BRAND20', percent: 20, active: true },
]

export const DEFAULT_RATES: Record<Currency, number> = {
  HTG: 1,
  USD: 125,
  DOP: 2.143,
  EUR: 136,
  BRL: 23,
}

export const DEFAULT_SETTINGS: Settings = {
  storeName: 'Brand Clothing',
  tagline: 'Stil ou, idantite ou',
  logo: '/images/logo.png',
  cover: '/images/cover.png',
  defaultCurrency: 'HTG',
  rates: DEFAULT_RATES,
  moncash: '50937000000',
  natcash: '50942000000',
  zelle: 'brandclothing@zelle.com',
  paypal: 'paypal.me/brandclothing',
  whatsapp: '50937000000',
  email: 'kontak@brandclothing.com',
  instagram: 'https://instagram.com/brandclothing',
  facebook: 'https://facebook.com/brandclothing',
  freeShippingThreshold: 5000,
  shippingFee: 250,
  theme: 'normal',
  santaHat: false,
  seasonMessage: '',
}

export const CURRENCIES: { code: Currency; label: string }[] = [
  { code: 'HTG', label: 'HTG' },
  { code: 'USD', label: 'USD $' },
  { code: 'DOP', label: 'RD$' },
  { code: 'EUR', label: 'EUR €' },
  { code: 'BRL', label: 'BRL R$' },
]

export function formatPrice(htg: number, currency: Currency, rates: Record<Currency, number>) {
  const rate = currency === 'HTG' ? 1 : rates[currency] || 1
  const value = htg / rate
  const whole = (n: number) => Math.round(n).toLocaleString('en-US')
  const dec = (n: number) =>
    n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  switch (currency) {
    case 'HTG':
      return `${whole(value)} HTG`
    case 'USD':
      return `$${dec(value)}`
    case 'DOP':
      return `RD$${whole(value)}`
    case 'EUR':
      return `€${dec(value)}`
    case 'BRL':
      return `R$${dec(value)}`
  }
}

export function whatsappLink(number: string, text?: string) {
  const clean = number.replace(/\D/g, '')
  return `https://wa.me/${clean}${text ? `?text=${encodeURIComponent(text)}` : ''}`
}
