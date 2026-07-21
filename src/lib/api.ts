import { useEffect, useState } from 'react'
import config from './config'

export class CheckoutError extends Error {}

type AuthMode = 'apiKey' | 'member' | 'none'

export function getMemberToken(): string {
  try {
    return localStorage.getItem(config.memberTokenKey) || ''
  } catch {
    return ''
  }
}

export function setMemberToken(token: string): void {
  try {
    if (token) localStorage.setItem(config.memberTokenKey, token)
    else localStorage.removeItem(config.memberTokenKey)
  } catch {}
}

export function isMemberLoggedIn(): boolean {
  return Boolean(getMemberToken())
}

async function request<T>(path: string, { auth = 'apiKey' as AuthMode, method = 'GET', body }: {
  auth?: AuthMode
  method?: string
  body?: unknown
} = {}): Promise<T> {
  const headers: Record<string, string> = {}

  if (auth === 'apiKey') {
    headers.Authorization = `Bearer ${config.apiKey}`
  } else if (auth === 'member') {
    const t = getMemberToken()
    if (t) headers.Authorization = `Bearer ${t}`
  }

  if (body) {
    headers['Content-Type'] = 'application/json'
  }

  const res = await fetch(`${config.apiBase}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })

  if (!res.ok) {
    let detail = ''
    try {
      const err = (await res.json()) as { detail?: string; message?: string }
      detail = err.detail || err.message || ''
    } catch {}
    throw new Error(detail || `Request failed (${res.status}).`)
  }

  return res.json() as Promise<T>
}

export interface Product {
  id: string
  name: string
  description: string
  price: number
  currency: string
  image: string
  category: string
  categorySlug: string
  storeId: string
}

interface Sell4MeProductRaw {
  id: string
  store_id: string
  name: string
  description: string
  price: string
  currency: string
  media_urls: string[]
  category: { id: string; name: string; slug: string }
  status: string
  [key: string]: unknown
}

function parseProduct(raw: Sell4MeProductRaw): Product {
  return {
    id: raw.id,
    name: raw.name,
    description: raw.description,
    price: Number.parseFloat(raw.price) || 0,
    currency: raw.currency || 'USD',
    image: raw.media_urls?.[0] ?? '',
    category: raw.category?.name ?? 'Uncategorized',
    categorySlug: raw.category?.slug ?? '',
    storeId: raw.store_id,
  }
}

export async function fetchProducts(): Promise<Product[]> {
  const json: unknown = await request('/v1/products')

  const raw: Sell4MeProductRaw[] = Array.isArray(json)
    ? json
    : ((json as { products?: Sell4MeProductRaw[] }).products ??
      (json as { data?: Sell4MeProductRaw[] }).data ??
      [])

  return raw
    .filter((p) => p.status === 'PUBLISHED')
    .map(parseProduct)
}

let productCache: Promise<Product[]> | null = null
export function getProducts(): Promise<Product[]> {
  if (!productCache) productCache = fetchProducts()
  return productCache
}

export interface Category {
  id: string
  name: string
  slug: string
}

export async function fetchCategories(): Promise<Category[]> {
  const json: unknown = await request('/v1/categories')

  const raw: Category[] = Array.isArray(json)
    ? json
    : ((json as { categories?: Category[] }).categories ??
      (json as { data?: Category[] }).data ??
      [])

  return raw.map((c) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
  }))
}

export interface CategoryGroup {
  name: string
  items: Product[]
}

export function groupByCategory(products: Product[]): CategoryGroup[] {
  const order: string[] = []
  const map = new Map<string, Product[]>()
  for (const p of products) {
    if (!map.has(p.category)) {
      map.set(p.category, [])
      order.push(p.category)
    }
    map.get(p.category)!.push(p)
  }
  return order.map((name) => ({ name, items: map.get(name)! }))
}

export function formatPrice(price: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: 2,
  }).format(price)
}

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    getProducts()
      .then((p) => {
        if (!active) return
        setProducts(p)
        setLoading(false)
      })
      .catch((e: unknown) => {
        if (!active) return
        setError(e instanceof Error ? e.message : 'Failed to load products.')
        setLoading(false)
      })
    return () => { active = false }
  }, [])

  return { products, loading, error }
}

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    fetchCategories()
      .then((c) => {
        if (!active) return
        setCategories(c)
        setLoading(false)
      })
      .catch((e: unknown) => {
        if (!active) return
        setError(e instanceof Error ? e.message : 'Failed to load categories.')
        setLoading(false)
      })
    return () => { active = false }
  }, [])

  return { categories, loading, error }
}

export function absoluteImageUrl(path: string): string {
  if (!path) return ''
  try {
    return new URL(path, window.location.origin).href
  } catch {
    return path
  }
}

export interface CheckoutItem {
  name: string
  price: number
  quantity: number
  currency: string
  image_url?: string
}

export interface CheckoutCustomer {
  name?: string
  email?: string
  phone?: string
  address?: string
}

export interface CheckoutSession {
  checkout_url: string
  session_id: string
  provider: 'paystack' | 'stripe' | string
}

export async function createCheckout(
  items: CheckoutItem[],
  customer: CheckoutCustomer,
  redirectTo: string,
): Promise<CheckoutSession> {
  if (!config.storeId) {
    throw new Error('Store ID is not configured. Set VITE_SELL4ME_STORE_ID in your .env file.')
  }
  if (!items.length) {
    throw new Error('Your cart is empty.')
  }

  const data = await request<Partial<CheckoutSession>>('/checkout/', {
    auth: 'none',
    method: 'POST',
    body: {
      store_id: config.storeId,
      items: items.map((it) => ({
        ...it,
        currency: it.currency || config.currency,
      })),
      customer,
      redirect_to: redirectTo,
    },
  })

  if (!data.checkout_url) {
    throw new Error('Checkout response was missing a checkout_url.')
  }

  return {
    checkout_url: data.checkout_url,
    session_id: data.session_id ?? '',
    provider: data.provider ?? '',
  }
}

export interface MembershipPlan {
  id: string
  name: string
  description: string
  price: number
  currency: string
  billing_interval: string
  max_products: number
  delivery_day: string
  image_url: string
  features: string[]
  [key: string]: unknown
}

export async function fetchMembershipPlans(): Promise<MembershipPlan[]> {
  if (!config.storeId) return []
  const json: unknown = await request(
    `/v1/membership/plans?store_id=${encodeURIComponent(config.storeId)}`,
    { auth: 'none' },
  )
  return Array.isArray(json) ? json as MembershipPlan[] : []
}

export async function requestOTP({ email, name }: { email: string; name?: string }): Promise<void> {
  if (!config.storeId) throw new Error('Store ID not configured.')
  await request('/v1/membership/auth/request-otp', {
    method: 'POST',
    auth: 'none',
    body: { store_id: config.storeId, email, name: name || undefined },
  })
}

export async function verifyOTP({ email, otp }: { email: string; otp: string }): Promise<{ access_token: string; member?: MemberInfo }> {
  if (!config.storeId) throw new Error('Store ID not configured.')
  return request('/v1/membership/auth/verify-otp', {
    method: 'POST',
    auth: 'none',
    body: { store_id: config.storeId, email, otp },
  })
}

export interface MemberInfo {
  id: string
  name: string
  email: string
  [key: string]: unknown
}

export async function getMemberInfo(): Promise<MemberInfo> {
  return request('/v1/membership/auth/me', { auth: 'member' })
}

export interface SubscriptionItem {
  product_id: string
  name: string
  price: number
  quantity: number
  [key: string]: unknown
}

export interface Subscription {
  id: string
  plan: { id: string; name: string }
  status: string
  price: number
  currency: string
  billing_interval: string
  next_delivery_date: string
  items: SubscriptionItem[]
  upcoming_deliveries?: Delivery[]
  delivery_history?: Delivery[]
  [key: string]: unknown
}

export interface Delivery {
  id: string
  delivery_date: string
  status: string
  total: number
  currency: string
  payment_status: string
  [key: string]: unknown
}

export async function subscribe({ planId, items }: { planId: string; items: { product_id: string; quantity: number }[] }): Promise<{ checkout?: { checkout_url?: string } }> {
  return request('/v1/membership/subscribe', {
    method: 'POST',
    auth: 'member',
    body: { plan_id: planId, items },
  })
}

export async function listMySubscriptions(): Promise<Subscription[]> {
  const json: unknown = await request('/v1/membership/subscriptions', { auth: 'member' })
  return Array.isArray(json) ? json as Subscription[] : []
}

export async function pauseSubscription(id: string): Promise<void> {
  await request(`/v1/membership/subscriptions/${id}/pause`, { method: 'POST', auth: 'member' })
}

export async function resumeSubscription(id: string): Promise<void> {
  await request(`/v1/membership/subscriptions/${id}/resume`, { method: 'POST', auth: 'member' })
}

export async function cancelSubscription(id: string): Promise<void> {
  await request(`/v1/membership/subscriptions/${id}/cancel`, { method: 'POST', auth: 'member' })
}

export async function listMyDeliveries(subscriptionId: string): Promise<Delivery[]> {
  const json: unknown = await request(`/v1/membership/subscriptions/${subscriptionId}/deliveries`, { auth: 'member' })
  return Array.isArray(json) ? json as Delivery[] : []
}

function formatDate(v: string): string {
  if (!v) return '---'
  try {
    return new Date(v).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
  } catch {
    return String(v)
  }
}

export function statusColor(status: string): string {
  const s = (status || '').toLowerCase()
  if (['active', 'delivered', 'paid'].includes(s)) return 'success'
  if (['paused', 'pending', 'preparing', 'shipped', 'unpaid'].includes(s)) return 'warning'
  if (['cancelled', 'failed', 'skipped', 'disabled'].includes(s)) return 'danger'
  return 'muted'
}

export { formatDate }
