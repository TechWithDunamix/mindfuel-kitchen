import { Link } from '@tanstack/react-router'
import { CupSoda, MapPin, Phone, Mail, Clock } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="border-t border-warm-200/50 bg-white px-6 py-16 md:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap justify-between gap-12">
          <div className="max-w-xs">
            <Link to="/" className="flex items-center gap-2">
              <CupSoda size={20} className="text-fire-600" />
              <span className="font-display text-xl tracking-wide">Mindfuel <span className="text-fire-600">Kitchen</span></span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-warm-800/50">
              Handcrafted functional drinks formulated to fuel your mind, body, and spirit.
            </p>
          </div>
          <div>
            <h4 className="mb-4 text-xs font-semibold uppercase tracking-widest text-warm-800/40">Links</h4>
            <div className="flex flex-col gap-3 text-sm text-warm-800/60">
              <Link to="/" className="transition-colors hover:text-fire-600">Home</Link>
              <Link to="/menu" className="transition-colors hover:text-fire-600">Menu</Link>
              <Link to="/contact" className="transition-colors hover:text-fire-600">Contact</Link>
            </div>
          </div>
          <div>
            <h4 className="mb-4 text-xs font-semibold uppercase tracking-widest text-warm-800/40">Hours</h4>
            <div className="space-y-1.5 text-sm text-warm-800/60">
              <p>Mon–Fri: 7AM – 8PM</p>
              <p>Sat: 8AM – 6PM</p>
              <p>Sun: 9AM – 4PM</p>
            </div>
          </div>
          <div>
            <h4 className="mb-4 text-xs font-semibold uppercase tracking-widest text-warm-800/40">Contact</h4>
            <div className="space-y-2 text-sm text-warm-800/60">
              <p className="flex items-center gap-2"><MapPin size={14} /> 123 Wellness Ave, Lagos</p>
              <p className="flex items-center gap-2"><Phone size={14} /> +234 800 MIND-FUEL</p>
              <p className="flex items-center gap-2"><Mail size={14} /> hello@mindfuelkitchen.com</p>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t border-warm-200/30 pt-6 text-center text-xs text-warm-800/30">
          &copy; {new Date().getFullYear()} Mindfuel Kitchen
        </div>
      </div>
    </footer>
  )
}
