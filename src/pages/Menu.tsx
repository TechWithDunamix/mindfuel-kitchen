import { motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import { useProducts, groupByCategory, formatPrice } from '../lib/api'
import { useCart } from '../context/CartContext'

export default function Menu() {
  const { addItem } = useCart()
  const { products, loading, error } = useProducts()
  const groups = groupByCategory(products)

  return (
    <section className="pt-24 pb-24">
      <div className="mx-auto max-w-6xl px-6 md:px-10">
        <div className="mb-16 pt-8 md:pt-12">
          <span className="text-xs font-semibold uppercase tracking-widest text-primary">Crafted For You</span>
          <h1 className="font-display mt-3 text-5xl leading-[0.9] tracking-[-1px] md:text-7xl lg:text-8xl">
            Our <span className="text-primary">Menu</span>
          </h1>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-muted">
            Every drink is formulated with purpose. Pick your need — we have a blend for it.
          </p>
        </div>

        {loading && (
          <p className="text-sm text-muted">Loading our menu...</p>
        )}

        {error && !loading && (
          <p className="text-sm text-danger">{error}</p>
        )}

        {!loading && !error && groups.length === 0 && (
          <p className="text-sm text-muted">No products available right now.</p>
        )}

        {!loading &&
          !error &&
          groups.map((cat) => (
            <div key={cat.name} className="mb-16 last:mb-0">
              <h2 className="font-display mb-8 text-2xl tracking-wide md:text-3xl">{cat.name}</h2>
              <div className="grid gap-6 md:grid-cols-3">
                {cat.items.map((item, ii) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: ii * 0.08 }}
                    className="group overflow-hidden rounded-2xl border border-border/30 bg-surface transition-all duration-300 hover:bg-surface-hover"
                  >
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-cover transition-all duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div className="p-5">
                      <div className="flex items-start justify-between">
                        <h3 className="font-display text-lg tracking-wide transition-colors duration-200 group-hover:text-primary">{item.name}</h3>
                        <span className="font-display text-base tracking-wide text-primary">{formatPrice(item.price, item.currency)}</span>
                      </div>
                      <p className="mt-1.5 text-xs leading-relaxed text-muted">{item.description}</p>
                      <div className="mt-3 inline-flex items-center gap-1 rounded-full bg-surface-hover px-3 py-1 text-xs font-semibold text-muted">
                        {item.category}
                      </div>
                      <button
                        type="button"
                        onClick={() => addItem(item)}
                        className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-bold uppercase tracking-wider text-white transition-all duration-300 hover:bg-primary-hover"
                      >
                        <Plus size={16} /> Add to Cart
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
      </div>
    </section>
  )
}
