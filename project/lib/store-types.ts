export type Lang = 'ht' | 'en' | 'es' | 'fr' | 'pt'
export type Currency = 'HTG' | 'USD' | 'DOP' | 'EUR' | 'BRL'
export type Category = 'clothes' | 'shoes' | 'accessories' | 'services'
export type Theme = 'normal' | 'christmas' | 'valentine' | 'blackfriday' | 'summer'
export type PaymentMethod = 'moncash' | 'natcash' | 'zelle' | 'paypal' | 'card'

export interface Product {
  id: string
  name: string
  price: number
  oldPrice?: number
  category: Category
  special: boolean
  description: string
  image: string
}

export interface VipCode {
  id: string
  code: string
  percent: number
  active: boolean
}

export interface Settings {
  storeName: string
  tagline: string
  logo: string
  cover: string
  defaultCurrency: Currency
  /** How many HTG equal 1 unit of each currency */
  rates: Record<Currency, number>
  moncash: string
  natcash: string
  zelle: string
  paypal: string
  whatsapp: string
  email: string
  instagram: string
  facebook: string
  freeShippingThreshold: number
  shippingFee: number
  theme: Theme
  santaHat: boolean
  seasonMessage: string
}

export interface CartItem {
  productId: string
  qty: number
}
