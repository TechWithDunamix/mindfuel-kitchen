import { Link } from '@tanstack/react-router'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, Star } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useProducts, formatPrice } from '../lib/api'

export default function Landing() {
  const { products, loading, error } = useProducts()
  const featured = products.slice(0, 8)

  const splitA = products[1]
  const splitB = products[2]
  const craftProduct = products[3]

  /* ────── Hero slideshow ────── */
  const slides = products.slice(0, 6)
  const [current, setCurrent] = useState(0)
  const [dir, setDir] = useState(1)

  useEffect(() => {
    if (slides.length < 2) return
    const id = setInterval(() => {
      setDir(1)
      setCurrent((c) => (c + 1) % slides.length)
    }, 5000)
    return () => clearInterval(id)
  }, [slides.length])

  const slide = slides[current]

  function goTo(i: number) {
    setDir(i > current ? 1 : -1)
    setCurrent(i)
  }

  return (
    <>
      {/* ─────────────── HERO ─────────────── */}
      <section className="relative flex items-end overflow-hidden" style={{ height: '70vh', minHeight: 420 }}>
        <div className="absolute inset-0">
          <AnimatePresence mode="wait" custom={dir}>
            {slide?.image ? (
              <motion.img
                key={slide.id}
                src={slide.image}
                alt=""
                custom={dir}
                initial={{ opacity: 0, scale: 1.08 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.8, ease: 'easeInOut' }}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full bg-elevated" />
            )}
          </AnimatePresence>
          <div className="absolute inset-0 bg-gradient-to-r from-bg/85 via-bg/60 to-transparent" />

          {/* ── slide caption ── */}
          {slide && (
            <div className="absolute bottom-14 left-6 z-20 md:bottom-20 md:left-12">
              <motion.p
                key={`label-${slide.id}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xs font-semibold uppercase tracking-widest text-primary"
              >
                {slide.category}
              </motion.p>
              <motion.h2
                key={`name-${slide.id}`}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="font-display mt-1 text-3xl leading-[0.9] tracking-[-1px] text-text md:text-5xl"
              >
                {slide.name}
              </motion.h2>
              <motion.p
                key={`price-${slide.id}`}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mt-2 text-lg font-semibold text-primary"
              >
                {formatPrice(slide.price, slide.currency)}
              </motion.p>
            </div>
          )}
        </div>

        {/* ── dots ── */}
        {slides.length > 1 && (
          <div className="absolute bottom-5 left-6 z-20 flex gap-2 md:left-12">
            {slides.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Slide ${i + 1}`}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === current ? 'w-8 bg-primary' : 'w-3 bg-white/30 hover:bg-white/50'
                }`}
              />
            ))}
          </div>
        )}

        <div className="relative z-10 w-full px-6 pb-14 md:px-12 md:pb-20">
          <div className="mx-auto max-w-6xl">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-display text-7xl leading-[0.85] tracking-[-2px] text-text md:text-8xl lg:text-9xl"
            >
              MindFuel
              <br />
              <span className="text-primary">Kitchen</span>
            </motion.h1>
          </div>
        </div>
      </section>

      {/* ─────────────── FEATURED DRINKS ─────────────── */}
      <section className="px-6 py-14 md:px-12 md:py-20">
        <div className="mx-auto max-w-6xl">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl text-base leading-relaxed text-muted"
          >
            Handcrafted functional drinks formulated with natural nootropics, adaptogens, and probiotics.
            Every blend is designed to support your brain, body, and mood — no artificial anything.
          </motion.p>

          <div className="mt-10 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {loading && (
              <p className="text-sm text-muted">Loading our featured drinks...</p>
            )}
            {error && !loading && (
              <p className="text-sm text-danger">{error}</p>
            )}
            {!loading && !error && featured.length > 0 && (
              <div className="flex gap-6" style={{ width: 'max-content' }}>
                {featured.map((d, i) => (
                  <motion.div
                    key={d.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.06 }}
                    className="group relative w-[380px] shrink-0 overflow-hidden rounded-3xl border border-border/30 bg-surface"
                  >
                    <div className="relative h-80 overflow-hidden">
                      <img src={d.image} alt={d.name} className="h-full w-full object-cover" />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-all duration-300 md:opacity-0 md:group-hover:bg-black/40 md:group-hover:opacity-100">
                        <span className="rounded-full bg-surface px-8 py-3 font-display text-2xl tracking-wide text-text shadow-md">
                          {formatPrice(d.price, d.currency)}
                        </span>
                      </div>
                      <span className="absolute bottom-5 right-5 rounded-full bg-surface/90 px-5 py-2 font-display text-xl tracking-wide text-text shadow-sm md:hidden">
                        {formatPrice(d.price, d.currency)}
                      </span>
                    </div>
                    <div className="pt-5">
                      <h3 className="font-display text-2xl tracking-wide">{d.name}</h3>
                      <p className="mt-1 text-base text-muted">{d.description}</p>
                      <div className="mt-3 inline-flex items-center gap-1 rounded-full bg-surface-hover px-4 py-1 text-sm font-semibold uppercase tracking-wider text-muted">
                        {d.category}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
            {!loading && !error && featured.length === 0 && (
              <p className="text-sm text-muted">Our featured drinks are coming soon.</p>
            )}
          </div>

          <div className="mt-10">
            <Link to="/menu" className="group inline-flex items-center gap-2 rounded-full bg-primary px-8 py-3.5 text-sm font-bold uppercase tracking-wider text-white transition-all duration-300 hover:bg-primary-hover">
              View Full Menu
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* ─────────────── SPLIT — PRODUCT A ─────────────── */}
      {splitA && (
        <section className="flex flex-col md:flex-row">
          <div className="h-72 overflow-hidden md:h-auto md:w-1/2">
            <img src={splitA.image} alt={splitA.name} className="h-full w-full object-cover" />
          </div>
          <div className="flex items-center px-6 py-16 md:w-1/2 md:px-14 md:py-24">
            <div className="max-w-md">
              <span className="text-xs font-semibold uppercase tracking-widest text-primary">
                {splitA.category}
              </span>
              <h2 className="font-display mt-3 text-4xl leading-[0.9] tracking-[-1px] md:text-5xl">
                {splitA.name}
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-muted">
                {splitA.description}
              </p>
              <div className="mt-5 flex items-center gap-3 text-sm font-semibold">
                <span className="text-primary">{formatPrice(splitA.price, splitA.currency)}</span>
                <span className="text-muted">|</span>
                <span className="flex items-center gap-1 text-primary">
                  <Star size={14} className="fill-primary" />
                  Real product, real ingredients
                </span>
              </div>
              <Link to="/menu" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-primary-hover">
                Order Now <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ─────────────── SPLIT — PRODUCT B ─────────────── */}
      {splitB && (
        <section className="flex flex-col md:flex-row-reverse">
          <div className="h-72 overflow-hidden md:h-auto md:w-1/2">
            <img src={splitB.image} alt={splitB.name} className="h-full w-full object-cover" />
          </div>
          <div className="flex items-center px-6 py-16 md:w-1/2 md:px-14 md:py-24">
            <div className="max-w-md">
              <span className="text-xs font-semibold uppercase tracking-widest text-primary">
                {splitB.category}
              </span>
              <h2 className="font-display mt-3 text-4xl leading-[0.9] tracking-[-1px] md:text-5xl">
                {splitB.name}
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-muted">
                {splitB.description}
              </p>
              <div className="mt-5 flex items-center gap-3 text-sm font-semibold">
                <span className="text-primary">{formatPrice(splitB.price, splitB.currency)}</span>
                <span className="text-muted">|</span>
                <span className="flex items-center gap-1 text-primary">
                  <Star size={14} className="fill-primary" />
                  Real product, real ingredients
                </span>
              </div>
              <Link to="/menu" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-primary-hover">
                Order Now <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ─────────────── CRAFTED WITH PURPOSE ─────────────── */}
      <section className="relative overflow-hidden bg-primary/10 px-6 py-20 md:py-32 md:px-12">
        <div className="mx-auto flex max-w-6xl flex-col items-center md:flex-row">
          <div className="relative z-10 -mb-16 rounded-3xl bg-elevated p-8 text-text md:-mr-20 md:mb-0 md:p-12" style={{ maxWidth: 400 }}>
            <span className="text-xs font-semibold uppercase tracking-widest text-primary">The Kitchen</span>
            <h2 className="font-display mt-3 text-3xl leading-[0.9] tracking-[-1px] md:text-4xl">
              Crafted With
              <br />
              <span className="text-primary">Purpose</span>
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-muted">
              Every drink that leaves our kitchen is made with intention. We source the finest natural
              ingredients, blend them in small batches, and serve them fresh — because you deserve
              more than just a drink. You deserve a ritual that works for you.
            </p>
          </div>
          <div className="relative shrink-0 md:w-[600px] lg:w-[700px]">
            <div className="overflow-hidden rounded-3xl shadow-2xl" style={{ height: 'min(70vw, 520px)' }}>
              {craftProduct?.image ? (
                <img src={craftProduct.image} alt="Featured product" className="h-full w-full object-cover" />
              ) : (
                <div className="h-full w-full bg-surface" />
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────── CTA ─────────────── */}
      <section className="px-6 py-24 md:py-28 md:px-12">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-4xl leading-[0.9] tracking-[-1px] md:text-6xl">
            Ready to <span className="text-primary">Fuel Up?</span>
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-muted">
            Browse our full menu of functional drinks — every product is real, every ingredient matters.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link to="/menu" className="group inline-flex items-center gap-2 rounded-full bg-primary px-8 py-3.5 text-sm font-bold uppercase tracking-wider text-white transition-all duration-300 hover:bg-primary-hover">
              Browse Menu
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </Link>
            <Link to="/contact" className="group inline-flex items-center gap-2 rounded-full border border-border bg-surface px-8 py-3.5 text-sm font-bold uppercase tracking-wider text-text transition-all duration-300 hover:border-border/60">
              Find Us
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
