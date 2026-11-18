'use server'

import { createHmac, timingSafeEqual } from 'node:crypto'
import { cookies } from 'next/headers'
import { getAdminClient } from '@/lib/supabase/admin'
import { SETTINGS_KEYS, SETTINGS_ROW_ID, dataToSettings, productToRow } from '@/lib/db'
import type { Category, Product, Settings } from '@/lib/store-types'

export type ActionResult = { ok: true } | { ok: false; error: string }

const COOKIE = 'bc_admin'
const CATEGORIES: Category[] = ['clothes', 'shoes', 'accessories', 'services']

function sessionToken(): string | null {
  const password = process.env.ADMIN_PASSWORD
  if (!password) return null
  return createHmac('sha256', password).update('bc-admin-session').digest('hex')
}

function safeEqual(a: string, b: string) {
  const ab = Buffer.from(a)
  const bb = Buffer.from(b)
  return ab.length === bb.length && timingSafeEqual(ab, bb)
}

async function isAdmin() {
  const token = sessionToken()
  const value = (await cookies()).get(COOKIE)?.value
  return Boolean(token && value && safeEqual(value, token))
}

async function guarded(fn: () => Promise<void>): Promise<ActionResult> {
  if (!(await isAdmin())) return { ok: false, error: 'Ou pa konekte kòm administratè.' }
  try {
    await fn()
    return { ok: true }
  } catch (err) {
    console.error('[admin action]', err)
    return { ok: false, error: err instanceof Error ? err.message : 'Yon erè rive.' }
  }
}

function check(error: { message: string } | null) {
  if (error) throw new Error(error.message)
}

export async function getAdminSession() {
  return isAdmin()
}

export async function adminLogin(password: string): Promise<ActionResult> {
  const expected = process.env.ADMIN_PASSWORD
  if (!expected) return { ok: false, error: 'ADMIN_PASSWORD pa konfigire sou sèvè a.' }
  await new Promise((r) => setTimeout(r, 400))
  if (typeof password !== 'string' || !safeEqual(password, expected)) {
    return { ok: false, error: 'Modpas la pa kòrèk.' }
  }
  ;(await cookies()).set(COOKIE, sessionToken()!, {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    path: '/',
    maxAge: 60 * 60 * 12,
  })
  return { ok: true }
}

export async function adminLogout() {
  ;(await cookies()).delete(COOKIE)
}

function cleanProduct(input: Omit<Product, 'id'>): Omit<Product, 'id'> {
  const name = String(input.name ?? '').trim().slice(0, 200)
  const price = Number(input.price)
  const oldPrice = Number(input.oldPrice)
  if (!name) throw new Error('Non pwodwi a obligatwa.')
  if (!(price > 0) || price > 10_000_000) throw new Error('Pri a pa valid.')
  return {
    name,
    price,
    oldPrice: oldPrice > price ? oldPrice : undefined,
    category: CATEGORIES.includes(input.category) ? input.category : 'clothes',
    special: Boolean(input.special),
    description: String(input.description ?? '').trim().slice(0, 2000),
    image: String(input.image ?? '').trim(),
  }
}

export async function saveProduct(id: string | null, input: Omit<Product, 'id'>) {
  return guarded(async () => {
    const row = productToRow(cleanProduct(input))
    const db = getAdminClient().from('products')
    const { error } = id ? await db.update(row).eq('id', id) : await db.insert(row)
    check(error)
  })
}

export async function deleteProduct(id: string) {
  return guarded(async () => {
    const { error } = await getAdminClient().from('products').delete().eq('id', id)
    check(error)
  })
}

export async function setProductSpecial(id: string, special: boolean) {
  return guarded(async () => {
    const { error } = await getAdminClient().from('products').update({ special: Boolean(special) }).eq('id', id)
    check(error)
  })
}

export async function addVipCode(code: string, percent: number) {
  return guarded(async () => {
    const c = String(code).trim().toUpperCase().replace(/\s+/g, '').slice(0, 40)
    const p = Math.round(Number(percent))
    if (!c || !(p > 0 && p <= 100)) throw new Error('Kòd oswa pousantaj la pa valid.')
    const { error } = await getAdminClient().from('vip_codes').insert({ code: c, percent: p, active: true })
    if (error?.code === '23505') throw new Error('Kòd sa a egziste deja.')
    check(error)
  })
}

export async function setVipCodeActive(id: string, active: boolean) {
  return guarded(async () => {
    const { error } = await getAdminClient().from('vip_codes').update({ active: Boolean(active) }).eq('id', id)
    check(error)
  })
}

export async function deleteVipCode(id: string) {
  return guarded(async () => {
    const { error } = await getAdminClient().from('vip_codes').delete().eq('id', id)
    check(error)
  })
}

export async function updateSettings(patch: Partial<Settings>) {
  return guarded(async () => {
    const db = getAdminClient().from('store_settings')
    const { data, error } = await db.select('data').eq('id', SETTINGS_ROW_ID).maybeSingle()
    check(error)
    const clean: Partial<Settings> = {}
    for (const key of SETTINGS_KEYS) {
      if (key in patch) (clean as Record<string, unknown>)[key] = patch[key]
    }
    const next = { ...dataToSettings(data?.data), ...clean }
    const { error: upsertError } = await db.upsert({ id: SETTINGS_ROW_ID, data: next, updated_at: new Date().toISOString() })
    check(upsertError)
  })
}
