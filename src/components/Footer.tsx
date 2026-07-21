import { Link } from '@tanstack/react-router'
import { MapPin, Phone, Mail } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="border-t border-border/30 bg-elevated px-6 py-16 md:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap justify-between gap-12">
          <div className="max-w-xs">
            <Link to="/" className="flex items-center gap-3">
              <img src="/logo.png" alt="MindFuel Kitchen" className="h-9 w-auto" />
              <span className="font-display text-xl tracking-wide text-text">MindFuel <span className="text-primary">Kitchen</span></span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-muted">
              Handcrafted functional drinks formulated to fuel your mind, body, and spirit.
            </p>
          </div>
          <div>
            <h4 className="mb-4 text-xs font-semibold uppercase tracking-widest text-muted/60">Links</h4>
            <div className="flex flex-col gap-3 text-sm text-muted">
              <Link to="/" className="transition-colors hover:text-primary">Home</Link>
              <Link to="/menu" className="transition-colors hover:text-primary">Menu</Link>
              <Link to="/contact" className="transition-colors hover:text-primary">Contact</Link>
            </div>
          </div>
          <div>
            <h4 className="mb-4 text-xs font-semibold uppercase tracking-widest text-muted/60">Hours</h4>
            <div className="space-y-1.5 text-sm text-muted">
              <p>Mon-Fri: 7AM - 8PM</p>
              <p>Sat: 8AM - 6PM</p>
              <p>Sun: 9AM - 4PM</p>
            </div>
          </div>
          <div>
            <h4 className="mb-4 text-xs font-semibold uppercase tracking-widest text-muted/60">Contact</h4>
            <div className="space-y-2 text-sm text-muted">
              <p className="flex items-center gap-2"><MapPin size={14} /> 123 Wellness Ave, Lagos</p>
              <p className="flex items-center gap-2"><Phone size={14} /> +234 800 MIND-FUEL</p>
              <p className="flex items-center gap-2"><Mail size={14} /> hello@mindfuelkitchen.com</p>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t border-border/30 pt-6 text-center text-xs text-muted/30">
          &copy; {new Date().getFullYear()} MindFuel Kitchen
        </div>
      </div>
    </footer>
  )
}
