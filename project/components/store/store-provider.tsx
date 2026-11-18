'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { translate, type TKey } from '@/lib/i18n'
import { DEFAULT_PRODUCTS, DEFAULT_SETTINGS, DEFAULT_VIP_CODES, formatPrice } from '@/lib/store-defaults'
import type { CartItem, Currency, Lang, Product, Settings, VipCode } from '@/lib/store-types'

const KEYS = {
  products: 'bc_products',
  vip: 'bc_vip_codes',
  settings: 'bc_settings',
  cart: 'bc_cart',
  lang: 'bc_lang',
  currency: 'bc_currency',
} as const

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

function save(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    alert('Espas estokaj navigatè a plen. Eseye itilize foto ki pi piti oswa yon URL.')
  }
}

interface StoreContextValue {
  hydrated: boolean
  products: Product[]
  setProducts: (updater: (prev: Product[]) => Product[]) => void
  vipCodes: VipCode[]
  setVipCodes: (updater: (prev: VipCode[]) => VipCode[]) => void
  settings: Settings
  updateSettings: (patch: Partial<Settings>) => void
  lang: Lang
  setLang: (lang: Lang) => void
  currency: Currency
  setCurrency: (currency: Currency) => void
  t: (key: TKey, vars?: Record<string, string>) => string
  price: (htg: number) => string
  cart: CartItem[]
  addToCart: (productId: string) => void
  setQty: (productId: string, qty: number) => void
  removeFromCart: (productId: string) => void
  clearCart: () => void
  cartCount: number
  cartOpen: boolean
  setCartOpen: (open: boolean) => void
  pendingCode: string
  setPendingCode: (code: string) => void
  adminOpen: boolean
  setAdminOpen: (open: boolean) => void
}

const StoreContext = createContext<StoreContextValue | null>(null)

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [hydrated, setHydrated] = useState(false)
  const [products, setProductsState] = useState<Product[]>(DEFAULT_PRODUCTS)
  const [vipCodes, setVipState] = useState<VipCode[]>(DEFAULT_VIP_CODES)
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS)
  const [lang, setLangState] = useState<Lang>('ht')
  const [customerCurrency, setCustomerCurrency] = useState<Currency | null>(null)
  const [cart, setCart] = useState<CartItem[]>([])
  const [cartOpen, setCartOpen] = useState(false)
  const [pendingCode, setPendingCode] = useState('')
  const [adminOpen, setAdminOpen] = useState(false)

  useEffect(() => {
    setProductsState(load(KEYS.products, DEFAULT_PRODUCTS))
    setVipState(load(KEYS.vip, DEFAULT_VIP_CODES))
    const stored = load<Partial<Settings>>(KEYS.settings, {})
    setSettings({ ...DEFAULT_SETTINGS, ...stored, rates: { ...DEFAULT_SETTINGS.rates, ...stored.rates } })
    setLangState(load<Lang>(KEYS.lang, 'ht'))
    setCustomerCurrency(load<Currency | null>(KEYS.currency, null))
    setCart(load<CartItem[]>(KEYS.cart, []))
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (hydrated) save(KEYS.cart, cart)
  }, [cart, hydrated])

  useEffect(() => {
    document.documentElement.dataset.theme = settings.theme
  }, [settings.theme])

  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  const setProducts = useCallback((updater: (prev: Product[]) => Product[]) => {
    setProductsState((prev) => {
      const next = updater(prev)
      save(KEYS.products, next)
      return next
    })
  }, [])

  const setVipCodes = useCallback((updater: (prev: VipCode[]) => VipCode[]) => {
    setVipState((prev) => {
      const next = updater(prev)
      save(KEYS.vip, next)
      return next
    })
  }, [])

  const updateSettings = useCallback((patch: Partial<Settings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...patch }
      save(KEYS.settings, next)
      return next
    })
  }, [])

  const setLang = useCallback((l: Lang) => {
    setLangState(l)
    save(KEYS.lang, l)
  }, [])

  const setCurrency = useCallback((c: Currency) => {
    setCustomerCurrency(c)
    save(KEYS.currency, c)
  }, [])

  const currency = customerCurrency ?? settings.defaultCurrency

  const t = useCallback((key: TKey, vars?: Record<string, string>) => translate(lang, key, vars), [lang])
  const price = useCallback((htg: number) => formatPrice(htg, currency, settings.rates), [currency, settings.rates])

  const addToCart = useCallback((productId: string) => {
    setCart((prev) => {
      const found = prev.find((i) => i.productId === productId)
      if (found) return prev.map((i) => (i.productId === productId ? { ...i, qty: Math.min(i.qty + 1, 99) } : i))
      return [...prev, { productId, qty: 1 }]
    })
  }, [])

  const setQty = useCallback((productId: string, qty: number) => {
    setCart((prev) =>
      qty <= 0
        ? prev.filter((i) => i.productId !== productId)
        : prev.map((i) => (i.productId === productId ? { ...i, qty: Math.min(qty, 99) } : i)),
    )
  }, [])

  const removeFromCart = useCallback((productId: string) => {
    setCart((prev) => prev.filter((i) => i.productId !== productId))
  }, [])

  const clearCart = useCallback(() => setCart([]), [])

  const validCart = useMemo(() => cart.filter((i) => products.some((p) => p.id === i.productId)), [cart, products])
  const cartCount = validCart.reduce((sum, i) => sum + i.qty, 0)

  const value: StoreContextValue = {
    hydrated,
    products,
    setProducts,
    vipCodes,
    setVipCodes,
    settings,
    updateSettings,
    lang,
    setLang,
    currency,
    setCurrency,
    t,
    price,
    cart: validCart,
    addToCart,
    setQty,
    removeFromCart,
    clearCart,
    cartCount,
    cartOpen,
    setCartOpen,
    pendingCode,
    setPendingCode,
    adminOpen,
    setAdminOpen,
  }

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be used inside StoreProvider')
  return ctx
}
