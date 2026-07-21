import { Link, useLocation } from '@tanstack/react-router'
import { ShoppingCart } from 'lucide-react'
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

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-bg/80 backdrop-blur-xl border-b border-border/40">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3 md:px-10">
        <Link to="/" className="flex items-center gap-3">
          <img src="/logo.png" alt="MindFuel Kitchen" className="h-10 w-auto" />
          <span className="font-display text-2xl tracking-wide text-text">
            MindFuel <span className="text-primary">Kitchen</span>
          </span>
        </Link>
        <div className="flex items-center gap-1">
          {links.map((l) => (
            <Link
              key={l.href}
              to={l.href}
              className={`px-3 py-2 text-sm font-medium transition-colors duration-200 ${
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
      </div>
    </nav>
  )
}
