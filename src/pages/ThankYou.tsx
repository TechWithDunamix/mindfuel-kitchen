import { Link } from '@tanstack/react-router'
import { CheckCircle2, ArrowRight } from 'lucide-react'

export default function ThankYou() {
  return (
    <section className="pt-32 pb-24">
      <div className="mx-auto max-w-xl px-6 text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          <CheckCircle2 className="text-primary" size={32} />
        </div>
        <span className="text-xs font-semibold uppercase tracking-widest text-primary">
          Order Placed
        </span>
        <h1 className="font-display mt-3 text-5xl leading-[0.9] tracking-[-1px] md:text-6xl">
          Thank <span className="text-primary">You!</span>
        </h1>
        <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-muted">
          Your payment was confirmed and your order is on its way to the kitchen.
          We'll email you a receipt shortly.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link
            to="/menu"
            className="group inline-flex items-center gap-2 rounded-full bg-primary px-8 py-3.5 text-sm font-bold uppercase tracking-wider text-white transition-all duration-300 hover:bg-primary-hover"
          >
            Back to Menu
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  )
}
