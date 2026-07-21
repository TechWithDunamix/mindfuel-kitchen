import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X, Plus, Minus, Trash2, Loader2, ShoppingBag, AlertCircle } from 'lucide-react'
import { useCart } from '../context/CartContext'
import {
  createCheckout,
  absoluteImageUrl,
  CheckoutError,
  formatPrice,
} from '../lib/api'

export default function CartDrawer() {
  const {
    items,
    isOpen,
    closeCart,
    updateQuantity,
    removeItem,
    totalPrice,
    totalItems,
    clearCart,
  } = useCart()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleCheckout = async () => {
    setError(null)
    setLoading(true)
    try {
      const session = await createCheckout(
        items.map((i) => ({
          name: i.name,
          price: i.price,
          quantity: i.quantity,
          currency: i.currency,
          image_url: absoluteImageUrl(i.image),
        })),
        { name, email },
        `${window.location.origin}/thank-you`,
      )
      window.location.href = session.checkout_url
    } catch (e) {
      setLoading(false)
      if (e instanceof CheckoutError) {
        setError(e.message)
      } else {
        setError('Something went wrong. Please try again.')
      }
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-[60] bg-bg/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
          />
          <motion.aside
            className="fixed right-0 top-0 z-[70] flex h-full w-full max-w-md flex-col bg-elevated"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3, ease: 'easeInOut' }}
          >
            <div className="flex items-center justify-between border-b border-border/30 px-6 py-4">
              <h2 className="font-display text-2xl tracking-wide text-text">
                Your Cart{totalItems > 0 ? ` (${totalItems})` : ''}
              </h2>
              <button
                type="button"
                onClick={closeCart}
                aria-label="Close cart"
                className="rounded-full p-2 text-muted transition-colors hover:bg-surface hover:text-text"
              >
                <X size={20} />
              </button>
            </div>

            {items.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
                <ShoppingBag size={40} className="text-border" />
                <p className="mt-4 font-display text-xl tracking-wide text-text">
                  Your cart is empty
                </p>
                <p className="mt-2 text-sm text-muted">
                  Add a blend from the menu to get started.
                </p>
                <button
                  type="button"
                  onClick={closeCart}
                  className="mt-6 rounded-full bg-primary px-6 py-3 text-sm font-bold uppercase tracking-wider text-white transition-all hover:bg-primary-hover"
                >
                  Browse Menu
                </button>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto px-6 py-4">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="flex gap-4 border-b border-border/20 py-4 last:border-0"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-20 w-20 shrink-0 rounded-xl object-cover"
                      />
                      <div className="flex flex-1 flex-col">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-display text-base tracking-wide text-text">
                            {item.name}
                          </h3>
                          <button
                            type="button"
                            onClick={() => removeItem(item.id)}
                            aria-label={`Remove ${item.name}`}
                            className="text-muted/40 transition-colors hover:text-danger"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                        <p className="text-sm text-muted">
                          {formatPrice(item.price, item.currency)}
                        </p>
                        <div className="mt-auto flex items-center justify-between pt-2">
                          <div className="flex items-center gap-3 rounded-full border border-border/40 px-2 py-1">
                            <button
                              type="button"
                              onClick={() =>
                                updateQuantity(item.id, item.quantity - 1)
                              }
                              aria-label="Decrease quantity"
                              className="text-muted transition-colors hover:text-primary"
                            >
                              <Minus size={14} />
                            </button>
                            <span className="min-w-4 text-center text-sm font-semibold text-text">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                updateQuantity(item.id, item.quantity + 1)
                              }
                              aria-label="Increase quantity"
                              className="text-muted transition-colors hover:text-primary"
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                          <span className="font-display text-sm tracking-wide text-primary">
                            {formatPrice(item.price * item.quantity, item.currency)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-border/30 px-6 py-5">
                  {error && (
                    <div className="mb-4 flex items-start gap-2 rounded-xl bg-danger/10 px-3 py-2 text-xs text-danger">
                      <AlertCircle size={14} className="mt-0.5 shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}

                  <div className="space-y-3">
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your name"
                      className="w-full rounded-xl border border-border/40 bg-surface px-4 py-2.5 text-sm text-text outline-none transition-colors placeholder:text-muted/50 focus:border-primary"
                    />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Email address"
                      className="w-full rounded-xl border border-border/40 bg-surface px-4 py-2.5 text-sm text-text outline-none transition-colors placeholder:text-muted/50 focus:border-primary"
                    />
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-sm text-muted">Subtotal</span>
                    <span className="font-display text-xl tracking-wide text-text">
                      {formatPrice(totalPrice, items[0]?.currency ?? 'USD')}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={handleCheckout}
                    disabled={loading}
                    className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-bold uppercase tracking-wider text-white transition-all duration-300 hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loading ? (
                      <>
                        <Loader2 size={16} className="animate-spin" /> Redirecting...
                      </>
                    ) : (
                      'Checkout'
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={clearCart}
                    className="mt-2 w-full text-center text-xs text-muted/40 transition-colors hover:text-primary"
                  >
                    Clear cart
                  </button>
                </div>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
