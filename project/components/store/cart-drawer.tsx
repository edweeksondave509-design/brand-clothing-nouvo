'use client'

import { useEffect, useState } from 'react'
import { CreditCard, Minus, Plus, ShoppingBag, Ticket, Trash2, Truck, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { whatsappLink } from '@/lib/store-defaults'
import type { PaymentMethod } from '@/lib/store-types'
import { useStore } from './store-provider'
import { WhatsAppIcon } from './brand-icons'
import { inputClass, labelClass } from './modal'

const METHOD_LABEL: Record<PaymentMethod, string> = {
  moncash: 'MonCash',
  natcash: 'Natcash',
  zelle: 'Zelle',
  paypal: 'PayPal',
  card: 'Card',
}

const METHOD_COLOR: Record<PaymentMethod, string> = {
  moncash: '#E30613',
  natcash: '#F58220',
  zelle: '#6D1ED4',
  paypal: '#003087',
  card: '#1A1A1A',
}

export function CartDrawer() {
  const {
    cartOpen,
    setCartOpen,
    cart,
    products,
    price,
    t,
    setQty,
    removeFromCart,
    clearCart,
    vipCodes,
    settings,
    pendingCode,
    setPendingCode,
  } = useStore()

  const [codeInput, setCodeInput] = useState('')
  const [appliedCode, setAppliedCode] = useState<{ code: string; percent: number } | null>(null)
  const [codeError, setCodeError] = useState(false)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [method, setMethod] = useState<PaymentMethod | null>(null)
  const [reference, setReference] = useState('')
  const [cardNumber, setCardNumber] = useState('')
  const [expiry, setExpiry] = useState('')
  const [cvv, setCvv] = useState('')
  const [formError, setFormError] = useState(false)

  const tryApply = (raw: string) => {
    const code = raw.trim().toUpperCase()
    const found = vipCodes.find((c) => c.active && c.code.toUpperCase() === code)
    if (found) {
      setAppliedCode({ code: found.code, percent: found.percent })
      setCodeError(false)
    } else {
      setAppliedCode(null)
      setCodeError(true)
    }
  }

  useEffect(() => {
    if (!pendingCode) return
    setCodeInput(pendingCode)
    tryApply(pendingCode)
    setPendingCode('')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pendingCode])

  useEffect(() => {
    if (!cartOpen) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setCartOpen(false)
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [cartOpen, setCartOpen])

  const lines = cart
    .map((item) => ({ item, product: products.find((p) => p.id === item.productId)! }))
    .filter((l) => l.product)
  const subtotal = lines.reduce((sum, l) => sum + l.product.price * l.item.qty, 0)
  const discount = appliedCode ? Math.round((subtotal * appliedCode.percent) / 100) : 0
  const freeShipping = subtotal >= settings.freeShippingThreshold
  const shipping = lines.length === 0 || freeShipping ? 0 : settings.shippingFee
  const total = Math.max(subtotal - discount + shipping, 0)
  const progress = Math.min((subtotal / Math.max(settings.freeShippingThreshold, 1)) * 100, 100)

  const methodInfo: Record<Exclude<PaymentMethod, 'card'>, { info: string; label: string }> = {
    moncash: { info: settings.moncash, label: t('confirmationCode') },
    natcash: { info: settings.natcash, label: t('confirmationCode') },
    zelle: { info: settings.zelle, label: t('zelleRef') },
    paypal: { info: settings.paypal, label: t('paypalRef') },
  }

  const cardDigits = cardNumber.replace(/\D/g, '')
  const isValid =
    lines.length > 0 &&
    name.trim() &&
    phone.trim() &&
    address.trim() &&
    method &&
    (method === 'card'
      ? cardDigits.length >= 13 && /^\d{2}\/\d{2}$/.test(expiry) && /^\d{3,4}$/.test(cvv)
      : reference.trim())

  const handleConfirm = (e: React.FormEvent) => {
    e.preventDefault()
    if (!isValid || !method) {
      setFormError(true)
      return
    }
    const itemsText = lines
      .map((l) => `• ${l.product.name} x${l.item.qty} — ${price(l.product.price * l.item.qty)}`)
      .join('\n')
    const paymentRef =
      method === 'card' ? `Kat ki fini pa **** ${cardDigits.slice(-4)} (Eks: ${expiry})` : reference.trim()

    const message = [
      '*NOUVO KÒMAND - BRAND CLOTHING*',
      '',
      `*Non:* ${name.trim()}`,
      `*Telefòn:* ${phone.trim()}`,
      `*Adrès:* ${address.trim()}`,
      '',
      '*Atik yo:*',
      itemsText,
      '',
      `*Sou-total:* ${price(subtotal)}`,
      appliedCode ? `*Rabè VIP (${appliedCode.code} -${appliedCode.percent}%):* -${price(discount)}` : null,
      `*Livrezon:* ${shipping === 0 ? 'Gratis' : price(shipping)}`,
      `*TOTAL POU PEYE:* ${price(total)}`,
      '',
      `*Metòd peman:* ${method === 'card' ? 'Kat Debi / Kredi' : METHOD_LABEL[method]}`,
      `*Kòd referans:* ${paymentRef}`,
    ]
      .filter((l) => l !== null)
      .join('\n')

    window.open(whatsappLink(settings.whatsapp, message), '_blank', 'noopener,noreferrer')

    clearCart()
    setAppliedCode(null)
    setCodeInput('')
    setReference('')
    setCardNumber('')
    setExpiry('')
    setCvv('')
    setMethod(null)
    setFormError(false)
    setCartOpen(false)
  }

  return (
    <div className={cn('fixed inset-0 z-[60]', cartOpen ? 'pointer-events-auto' : 'pointer-events-none')} inert={!cartOpen}>
      <button
        type="button"
        tabIndex={cartOpen ? 0 : -1}
        aria-label={t('close')}
        onClick={() => setCartOpen(false)}
        className={cn('absolute inset-0 bg-ink/50 backdrop-blur-sm transition-opacity', cartOpen ? 'opacity-100' : 'opacity-0')}
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label={t('cartTitle')}
        className={cn(
          'absolute top-0 right-0 flex h-full w-full max-w-md flex-col bg-background shadow-2xl transition-transform duration-300',
          cartOpen ? 'translate-x-0' : 'translate-x-full',
        )}
      >
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 className="flex items-center gap-2 font-heading text-lg font-bold">
            <ShoppingBag className="size-5" />
            {t('cartTitle')}
          </h2>
          <button
            type="button"
            tabIndex={cartOpen ? 0 : -1}
            onClick={() => setCartOpen(false)}
            className="rounded-full p-1.5 text-muted-foreground transition hover:bg-muted hover:text-foreground"
            aria-label={t('close')}
          >
            <X className="size-5" />
          </button>
        </div>

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
            <span className="flex size-16 items-center justify-center rounded-full bg-muted">
              <ShoppingBag className="size-7 text-muted-foreground" />
            </span>
            <p className="text-muted-foreground">{t('emptyCart')}</p>
            <button
              type="button"
              tabIndex={cartOpen ? 0 : -1}
              onClick={() => setCartOpen(false)}
              className="rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-paper"
            >
              {t('continueShopping')}
            </button>
          </div>
        ) : (
          <form onSubmit={handleConfirm} className="flex flex-1 flex-col overflow-hidden">
            <div className="flex-1 space-y-6 overflow-y-auto px-5 py-5">
              <div className="rounded-xl bg-muted p-4">
                <p className="mb-2 flex items-center gap-2 text-sm font-medium">
                  <Truck className="size-4 text-brand" />
                  {freeShipping ? t('unlocked') : t('remaining', { amount: price(settings.freeShippingThreshold - subtotal) })}
                </p>
                <div
                  className="h-2 overflow-hidden rounded-full bg-background"
                  role="progressbar"
                  aria-valuenow={Math.round(progress)}
                  aria-valuemin={0}
                  aria-valuemax={100}
                >
                  <div className={cn('h-full rounded-full transition-all', freeShipping ? 'bg-[#16A34A]' : 'bg-brand')} style={{ width: `${progress}%` }} />
                </div>
              </div>

              <ul className="space-y-3">
                {lines.map(({ item, product }) => (
                  <li key={product.id} className="flex gap-3">
                    <img src={product.image || '/placeholder.svg'} alt={product.name} className="size-20 shrink-0 rounded-lg object-cover" />
                    <div className="flex min-w-0 flex-1 flex-col">
                      <div className="flex items-start justify-between gap-2">
                        <p className="truncate text-sm font-semibold">{product.name}</p>
                        <button
                          type="button"
                          onClick={() => removeFromCart(product.id)}
                          className="text-muted-foreground transition hover:text-[#E11D48]"
                          aria-label={`${t('remove')} ${product.name}`}
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                      <p className="text-xs text-muted-foreground">{price(product.price)}</p>
                      <div className="mt-auto flex items-center justify-between">
                        <div className="flex items-center rounded-full border border-border" aria-label={t('qty')}>
                          <button
                            type="button"
                            onClick={() => setQty(product.id, item.qty - 1)}
                            className="p-1.5 transition hover:text-brand"
                            aria-label="-1"
                          >
                            <Minus className="size-3.5" />
                          </button>
                          <span className="w-7 text-center text-sm font-medium">{item.qty}</span>
                          <button
                            type="button"
                            onClick={() => setQty(product.id, item.qty + 1)}
                            className="p-1.5 transition hover:text-brand"
                            aria-label="+1"
                          >
                            <Plus className="size-3.5" />
                          </button>
                        </div>
                        <span className="text-sm font-bold">{price(product.price * item.qty)}</span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>

              <div>
                <label htmlFor="vip-code" className={labelClass}>
                  {t('vipCodePlaceholder')}
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Ticket className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                      id="vip-code"
                      value={codeInput}
                      onChange={(e) => {
                        setCodeInput(e.target.value)
                        setCodeError(false)
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.nativeEvent.isComposing && e.keyCode !== 229) {
                          e.preventDefault()
                          tryApply(codeInput)
                        }
                      }}
                      placeholder="VIP10"
                      className={cn(inputClass, 'pl-9 uppercase')}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => tryApply(codeInput)}
                    className="rounded-lg bg-ink px-4 text-sm font-semibold text-paper"
                  >
                    {t('apply')}
                  </button>
                </div>
                {codeError && <p className="mt-1.5 text-xs text-[#E11D48]">{t('invalidCode')}</p>}
                {appliedCode && (
                  <p className="mt-1.5 flex items-center justify-between text-xs font-medium text-[#16A34A]">
                    {t('codeApplied')}: {appliedCode.code} (-{appliedCode.percent}%)
                    <button type="button" onClick={() => setAppliedCode(null)} className="underline">
                      {t('remove')}
                    </button>
                  </p>
                )}
              </div>

              <fieldset className="space-y-3">
                <legend className="mb-3 font-heading text-sm font-bold">{t('deliveryInfo')}</legend>
                <div>
                  <label htmlFor="c-name" className={labelClass}>{t('fullName')} *</label>
                  <input id="c-name" required value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" className={inputClass} />
                </div>
                <div>
                  <label htmlFor="c-phone" className={labelClass}>{t('phone')} *</label>
                  <input id="c-phone" required type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} autoComplete="tel" className={inputClass} />
                </div>
                <div>
                  <label htmlFor="c-address" className={labelClass}>{t('address')} *</label>
                  <textarea id="c-address" required rows={2} value={address} onChange={(e) => setAddress(e.target.value)} autoComplete="street-address" className={inputClass} />
                </div>
              </fieldset>

              <fieldset>
                <legend className="mb-3 font-heading text-sm font-bold">{t('paymentMethod')} *</legend>
                <div className="grid grid-cols-2 gap-2">
                  {(Object.keys(METHOD_LABEL) as PaymentMethod[]).map((m) => (
                    <label
                      key={m}
                      className={cn(
                        'flex cursor-pointer items-center gap-2 rounded-lg border-2 px-3 py-2.5 text-sm font-semibold transition',
                        m === 'card' && 'col-span-2',
                        method === m ? 'border-brand bg-brand/5' : 'border-border hover:border-foreground/30',
                      )}
                    >
                      <input
                        type="radio"
                        name="payment"
                        value={m}
                        checked={method === m}
                        onChange={() => {
                          setMethod(m)
                          setReference('')
                        }}
                        className="sr-only"
                      />
                      {m === 'card' ? (
                        <CreditCard className="size-4" />
                      ) : (
                        <span className="size-2.5 rounded-full" style={{ backgroundColor: METHOD_COLOR[m] }} />
                      )}
                      {m === 'card' ? t('card') : METHOD_LABEL[m]}
                    </label>
                  ))}
                </div>

                {method && method !== 'card' && (
                  <div className="mt-3 space-y-3 rounded-xl border border-border bg-muted/50 p-4">
                    <p className="text-sm">
                      {t('sendTo')} <strong>{METHOD_LABEL[method]}</strong>:
                      <span className="mt-1 block font-mono text-base font-bold text-brand">{methodInfo[method].info}</span>
                    </p>
                    <div>
                      <label htmlFor="c-ref" className={labelClass}>{methodInfo[method].label} *</label>
                      <input id="c-ref" required value={reference} onChange={(e) => setReference(e.target.value)} className={inputClass} />
                    </div>
                  </div>
                )}

                {method === 'card' && (
                  <div className="mt-3 grid grid-cols-2 gap-3 rounded-xl border border-border bg-muted/50 p-4">
                    <div className="col-span-2">
                      <label htmlFor="c-card" className={labelClass}>{t('cardNumber')} *</label>
                      <input
                        id="c-card"
                        required
                        inputMode="numeric"
                        autoComplete="cc-number"
                        placeholder="1234 5678 9012 3456"
                        value={cardNumber}
                        onChange={(e) =>
                          setCardNumber(
                            e.target.value.replace(/\D/g, '').slice(0, 19).replace(/(\d{4})(?=\d)/g, '$1 '),
                          )
                        }
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label htmlFor="c-exp" className={labelClass}>{t('expiry')} *</label>
                      <input
                        id="c-exp"
                        required
                        inputMode="numeric"
                        autoComplete="cc-exp"
                        placeholder="MM/AA"
                        value={expiry}
                        onChange={(e) => {
                          const d = e.target.value.replace(/\D/g, '').slice(0, 4)
                          setExpiry(d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d)
                        }}
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label htmlFor="c-cvv" className={labelClass}>{t('cvv')} *</label>
                      <input
                        id="c-cvv"
                        required
                        inputMode="numeric"
                        autoComplete="cc-csc"
                        placeholder="123"
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                        className={inputClass}
                      />
                    </div>
                  </div>
                )}
              </fieldset>
            </div>

            <div className="space-y-2 border-t border-border bg-background px-5 py-4">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>{t('subtotal')}</span>
                <span>{price(subtotal)}</span>
              </div>
              {appliedCode && (
                <div className="flex justify-between text-sm text-[#16A34A]">
                  <span>{t('discount')} ({appliedCode.code})</span>
                  <span>-{price(discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>{t('shipping')}</span>
                <span>{shipping === 0 ? t('free') : price(shipping)}</span>
              </div>
              <div className="flex justify-between pt-1 font-heading text-lg font-bold">
                <span>{t('total')}</span>
                <span>{price(total)}</span>
              </div>
              {formError && !isValid && <p className="text-xs text-[#E11D48]">{t('fillRequired')}</p>}
              <button
                type="submit"
                className="mt-1 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#25D366] font-semibold text-white transition hover:brightness-105"
              >
                <WhatsAppIcon className="size-5" />
                {t('confirmOrder')}
              </button>
            </div>
          </form>
        )}
      </aside>
    </div>
  )
}
