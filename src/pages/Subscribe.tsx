import { useEffect, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { Check, Loader2, ArrowRight } from 'lucide-react'
import {
  fetchMembershipPlans,
  getProducts,
  isMemberLoggedIn,
  subscribe,
  formatPrice,
  type MembershipPlan,
  type Product,
} from '../lib/api'

export default function Subscribe() {
  const navigate = useNavigate()
  const [plans, setPlans] = useState<MembershipPlan[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [selectedPlanId, setSelectedPlanId] = useState<string>('')
  const [selectedProductIds, setSelectedProductIds] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const urlPlanId = new URLSearchParams(window.location.search).get('planId') || ''
    if (urlPlanId) setSelectedPlanId(urlPlanId)

    let active = true
    Promise.all([fetchMembershipPlans(), getProducts()])
      .then(([p, pr]) => {
        if (!active) return
        setPlans(p)
        setProducts(pr)
        if (urlPlanId && !p.find((pl) => pl.id === urlPlanId)) {
          setSelectedPlanId(p[0]?.id || '')
        } else if (!urlPlanId && p.length) {
          setSelectedPlanId(p[0].id)
        }
        setLoading(false)
      })
      .catch((e: unknown) => {
        if (!active) return
        setError(e instanceof Error ? e.message : 'Failed to load data.')
        setLoading(false)
      })
    return () => { active = false }
  }, [])

  const selectedPlan = plans.find((p) => p.id === selectedPlanId)

  const toggleProduct = (id: string) => {
    if (!selectedPlan) return
    setSelectedProductIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else if (next.size < selectedPlan.max_products) {
        next.add(id)
      }
      return next
    })
  }

  const handleSubscribe = async () => {
    if (!selectedPlan) return
    if (!isMemberLoggedIn()) {
      navigate({ to: '/member' })
      return
    }
    if (selectedProductIds.size === 0) {
      setError('Select at least one product.')
      return
    }

    setSubmitting(true)
    setError(null)
    try {
      const result = await subscribe({
        planId: selectedPlan.id,
        items: [...selectedProductIds].map((product_id) => ({ product_id, quantity: 1 })),
      })
      const url = result?.checkout?.checkout_url
      if (url) {
        window.location.href = url
        return
      }
      navigate({ to: '/member' })
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Subscription failed.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="pt-24 pb-24">
      <div className="mx-auto max-w-4xl px-6 md:px-10">
        <div className="mb-16 pt-8 md:pt-12">
          <span className="text-xs font-semibold uppercase tracking-widest text-primary">Subscribe</span>
          <h1 className="font-display mt-3 text-5xl leading-[0.9] tracking-[-1px] md:text-7xl">
            Join a <span className="text-primary">Plan</span>
          </h1>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-muted">
            Pick a membership plan and choose the products you want delivered regularly.
          </p>
        </div>

        {loading && (
          <div className="flex items-center gap-3 text-muted">
            <Loader2 size={18} className="animate-spin" />
            <span className="text-sm">Loading plans and products...</span>
          </div>
        )}

        {error && !loading && (
          <p className="text-sm text-danger">{error}</p>
        )}

        {!loading && !error && (
          <>
            <div className="mb-8">
              <h2 className="font-display mb-4 text-xl tracking-wide">1. Choose a plan</h2>
              <div className="grid gap-4 md:grid-cols-2">
                {plans.map((plan) => (
                  <button
                    key={plan.id}
                    type="button"
                    onClick={() => {
                      setSelectedPlanId(plan.id)
                      setSelectedProductIds(new Set())
                      setError(null)
                    }}
                    className={`rounded-2xl border p-5 text-left transition-all duration-200 ${
                      selectedPlanId === plan.id
                        ? 'border-primary bg-primary/10'
                        : 'border-border/30 bg-surface hover:bg-surface-hover'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-display text-lg tracking-wide">{plan.name}</h3>
                        <p className="mt-1 text-sm text-muted">{plan.description || 'Recurring delivery'}</p>
                      </div>
                      {selectedPlanId === plan.id && (
                        <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary">
                          <Check size={12} className="text-white" />
                        </div>
                      )}
                    </div>
                    <div className="mt-3 flex items-baseline gap-1.5">
                      <span className="font-display text-2xl tracking-tight text-primary">{formatPrice(plan.price, plan.currency)}</span>
                      <span className="text-xs font-semibold text-muted">/ {plan.billing_interval}</span>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      <span className="rounded-full bg-surface-hover px-2 py-0.5 text-xs text-muted">Up to {plan.max_products} products</span>
                      {plan.delivery_day && (
                        <span className="rounded-full bg-surface-hover px-2 py-0.5 text-xs text-muted">Delivers {plan.delivery_day}</span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {selectedPlan && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <h2 className="font-display mb-2 text-xl tracking-wide">2. Pick your products</h2>
                <p className="mb-4 text-sm text-muted">
                  Selected: <span className="font-semibold text-text">{selectedProductIds.size}</span> / {selectedPlan.max_products}
                </p>

                <div className="grid gap-3 md:grid-cols-2">
                  {products.map((p) => {
                    const checked = selectedProductIds.has(p.id)
                    const disabled = !checked && selectedProductIds.size >= selectedPlan.max_products
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => toggleProduct(p.id)}
                        disabled={disabled}
                        className={`flex items-center gap-3 rounded-xl border p-3 text-left transition-all duration-200 ${
                          checked
                            ? 'border-primary bg-primary/10'
                            : disabled
                              ? 'border-border/20 bg-surface/50 opacity-40'
                              : 'border-border/30 bg-surface hover:bg-surface-hover'
                        }`}
                      >
                        {p.image ? (
                          <img src={p.image} alt={p.name} className="h-12 w-12 shrink-0 rounded-lg object-cover" />
                        ) : (
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-surface-hover text-xs text-muted">N/A</div>
                        )}
                        <div className="flex-1 min-w-0">
                          <h4 className="truncate text-sm font-semibold">{p.name}</h4>
                          <p className="text-xs text-muted">{formatPrice(p.price, p.currency)}</p>
                        </div>
                        <div className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border ${
                          checked ? 'border-primary bg-primary' : 'border-border/40'
                        }`}>
                          {checked && <Check size={12} className="text-white" />}
                        </div>
                      </button>
                    )
                  })}
                </div>

                <div className="mt-8">
                  <button
                    type="button"
                    onClick={handleSubscribe}
                    disabled={submitting || selectedProductIds.size === 0}
                    className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-8 py-3.5 text-sm font-bold uppercase tracking-wider text-white transition-all duration-300 hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {submitting ? (
                      <>
                        <Loader2 size={16} className="animate-spin" /> Creating subscription...
                      </>
                    ) : (
                      <>
                        Confirm subscription
                        <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            )}
          </>
        )}
      </div>
    </section>
  )
}
