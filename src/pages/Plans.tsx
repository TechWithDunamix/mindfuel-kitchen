import { useEffect, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { Check, ArrowRight, Loader2 } from 'lucide-react'
import { fetchMembershipPlans, formatPrice, type MembershipPlan } from '../lib/api'

export default function Plans() {
  const [plans, setPlans] = useState<MembershipPlan[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    fetchMembershipPlans()
      .then((p) => {
        if (!active) return
        setPlans(p)
        setLoading(false)
      })
      .catch((e: unknown) => {
        if (!active) return
        setError(e instanceof Error ? e.message : 'Failed to load plans.')
        setLoading(false)
      })
    return () => { active = false }
  }, [])

  return (
    <section className="pt-24 pb-24">
      <div className="mx-auto max-w-6xl px-6 md:px-10">
        <div className="mb-16 pt-8 md:pt-12">
          <span className="text-xs font-semibold uppercase tracking-widest text-primary">Membership</span>
          <h1 className="font-display mt-3 text-5xl leading-[0.9] tracking-[-1px] md:text-7xl lg:text-8xl">
            Our <span className="text-primary">Plans</span>
          </h1>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-muted">
            Subscribe to a recurring delivery of your favorite blends. Pick your plan, choose your products, and we handle the rest.
          </p>
        </div>

        {loading && (
          <div className="flex items-center gap-3 text-muted">
            <Loader2 size={18} className="animate-spin" />
            <span className="text-sm">Loading plans...</span>
          </div>
        )}

        {error && !loading && (
          <p className="text-sm text-danger">{error}</p>
        )}

        {!loading && !error && plans.length === 0 && (
          <div className="rounded-2xl border border-border/30 bg-surface p-8 text-center">
            <p className="text-muted">No active membership plans yet. Check back soon.</p>
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="flex flex-col overflow-hidden rounded-2xl border border-border/30 bg-surface transition-all duration-300 hover:bg-surface-hover"
            >
              {plan.image_url ? (
                <div className="relative h-48 overflow-hidden">
                  <img src={plan.image_url} alt={plan.name} className="h-full w-full object-cover" />
                </div>
              ) : (
                <div className="flex h-40 items-center justify-center bg-surface-hover">
                  <span className="font-display text-lg font-bold text-muted/40">PLAN</span>
                </div>
              )}

              <div className="flex flex-1 flex-col p-6">
                <h3 className="font-display text-xl tracking-wide">{plan.name}</h3>
                <p className="mt-2 text-sm text-muted">{plan.description || 'Recurring product delivery plan'}</p>

                <div className="mt-4 flex items-baseline gap-1.5">
                  <span className="font-display text-3xl tracking-tight text-primary">{formatPrice(plan.price, plan.currency)}</span>
                  <span className="text-sm font-semibold text-muted">/ {plan.billing_interval}</span>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="rounded-full bg-surface-hover px-3 py-1 text-xs font-semibold text-muted">Up to {plan.max_products} products</span>
                  {plan.delivery_day && (
                    <span className="rounded-full bg-surface-hover px-3 py-1 text-xs font-semibold text-muted">Delivers {plan.delivery_day}</span>
                  )}
                  <span className="rounded-full bg-success/10 px-3 py-1 text-xs font-semibold text-success">Active</span>
                </div>

                {plan.features && plan.features.length > 0 && (
                  <ul className="mt-4 space-y-2">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm text-muted">
                        <Check size={14} className="mt-0.5 shrink-0 text-success" />
                        {f}
                      </li>
                    ))}
                  </ul>
                )}

                <div className="mt-auto pt-6">
                  <Link
                    to="/subscribe"
                    search={{ planId: plan.id }}
                    className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-bold uppercase tracking-wider text-white transition-all duration-300 hover:bg-primary-hover"
                  >
                    Subscribe
                    <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
