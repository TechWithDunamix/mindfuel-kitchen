import { Link, useLocation } from '@tanstack/react-router'
import { AnimatePresence, motion } from 'framer-motion'
import { Menu, ShoppingCart, X } from 'lucide-react'
import { useState } from 'react'
import { useCart } from '../context/CartContext'

const links = [
  { href: '/', label: 'Home' },
  { href: '/menu', label: 'Menu' },
  { href: '/plans', label: 'Plans' },
  { href: '/subscribe', label: 'Subscribe' },
  { href: '/member', label: 'Member' },
  { href: '/contact', label: 'Contact' },
]

export default function Nav() {
  const { pathname } = useLocation()
  const { totalItems, openCart } = useCart()
  const [open, setOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-bg/80 backdrop-blur-xl border-b border-border/40">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 md:px-10">
        <Link to="/" className="flex items-center gap-2 md:gap-3">
          <img src="/logo.png" alt="MindFuel Kitchen" className="h-8 w-auto md:h-10" />
          <span className="hidden font-display text-xl tracking-wide text-text md:text-2xl">
            MindFuel <span className="text-primary">Kitchen</span>
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              to={l.href}
              className={`shrink-0 px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                pathname === l.href
                  ? 'text-primary'
                  : 'text-muted hover:text-text'
              }`}
            >
              {l.label}
            </Link>
          ))}
          <button
            type="button"
            onClick={openCart}
            aria-label="Open cart"
            className="relative ml-1 rounded-full p-2 text-muted transition-colors hover:bg-surface hover:text-text"
          >
            <ShoppingCart size={18} />
            {totalItems > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-white">
                {totalItems}
              </span>
            )}
          </button>
        </div>

        {/* Mobile hamburger + cart */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            type="button"
            onClick={openCart}
            aria-label="Open cart"
            className="relative rounded-full p-2 text-muted transition-colors hover:bg-surface hover:text-text"
          >
            <ShoppingCart size={18} />
            {totalItems > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-white">
                {totalItems}
              </span>
            )}
          </button>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            className="rounded-full p-2 text-text transition-colors hover:bg-surface"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden border-t border-border/40 md:hidden"
          >
            <div className="flex flex-col gap-1 px-4 pb-5 pt-2">
              {links.map((l) => {
                const active = pathname === l.href
                return (
                  <Link
                    key={l.href}
                    to={l.href}
                    onClick={() => setOpen(false)}
                    className={`rounded-xl px-4 py-3 text-sm font-medium transition-colors duration-150 ${
                      active
                        ? 'bg-primary/10 text-primary'
                        : 'text-muted hover:bg-surface hover:text-text'
                    }`}
                  >
                    {l.label}
                  </Link>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
