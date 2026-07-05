import { Link } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { ArrowRight, Star } from 'lucide-react'

const drinks = [
  { name: 'Focus Elixir', tag: 'Matcha + Lion\'s Mane', price: '₦4,500', img: '/images/matcha.jpg', benefit: 'Focus + Clarity' },
  { name: 'Bloom', tag: 'Turmeric + Ginger + Probiotics', price: '₦4,000', img: '/images/turmeric.jpg', benefit: 'Gut Health' },
  { name: 'Solar Flare', tag: 'Mango + Habanero + Electrolytes', price: '₦4,500', img: '/images/citrus.jpg', benefit: 'Energy' },
  { name: 'Moon Milk', tag: 'Reishi + Magnesium + Honey', price: '₦5,000', img: '/images/berry.jpg', benefit: 'Sleep' },
  { name: 'Zen', tag: 'Ashwagandha + Chamomile', price: '₦4,500', img: '/images/matcha.jpg', benefit: 'Calm' },
  { name: 'Brainwave', tag: 'Spirulina + Bacopa + Coconut', price: '₦4,000', img: '/images/coffee.jpg', benefit: 'Memory' },
]

export default function Landing() {
  return (
    <>
      {/* Compact hero — just title and bg */}
      <section className="relative flex items-end overflow-hidden" style={{ height: '70vh', minHeight: 420 }}>
        <div className="absolute inset-0">
          <img src="/images/hero-bg.jpg" alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
        </div>
        <div className="relative z-10 w-full px-6 pb-14 md:px-12 md:pb-20">
          <div className="mx-auto max-w-6xl">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-display text-7xl leading-[0.85] tracking-[-2px] text-white md:text-8xl lg:text-9xl"
            >
              Mindfuel
              <br />
              <span className="text-brand-400">Kitchen</span>
            </motion.h1>
          </div>
        </div>
      </section>

      {/* Intro text + drink list */}
      <section className="px-6 py-14 md:px-12 md:py-20">
        <div className="mx-auto max-w-6xl">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl text-base leading-relaxed text-warm-800/60"
          >
            Handcrafted functional drinks formulated with natural nootropics, adaptogens, and probiotics.
            Every blend is designed to support your brain, body, and mood — no artificial anything.
          </motion.p>

          {/* Drink list — one line desktop, scroll mobile */}
          <div className="mt-10 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            <div className="flex gap-6" style={{ width: 'max-content' }}>
              {drinks.map((d, i) => (
                <motion.div
                  key={d.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06 }}
                  className="group relative w-[380px] shrink-0 overflow-hidden rounded-3xl"
                >
                  <div className="relative h-80 overflow-hidden">
                    <img src={d.img} alt={d.name} className="h-full w-full object-cover" />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-all duration-300 md:opacity-0 md:group-hover:bg-black/40 md:group-hover:opacity-100">
                      <span className="rounded-full bg-white px-8 py-3 font-display text-2xl tracking-wide text-warm-900 shadow-md">
                        {d.price}
                      </span>
                    </div>
                    <span className="absolute bottom-5 right-5 rounded-full bg-white/90 px-5 py-2 font-display text-xl tracking-wide text-warm-900 shadow-sm md:hidden">
                      {d.price}
                    </span>
                  </div>
                  <div className="pt-5">
                    <h3 className="font-display text-2xl tracking-wide">{d.name}</h3>
                    <p className="mt-1 text-base text-warm-800/40">{d.tag}</p>
                    <div className="mt-3 inline-flex items-center gap-1 rounded-full bg-brand-100 px-4 py-1 text-sm font-semibold uppercase tracking-wider text-brand-700">
                      {d.benefit}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="mt-10">
            <Link to="/menu" className="group inline-flex items-center gap-2 rounded-full bg-fire-600 px-8 py-3.5 text-sm font-bold uppercase tracking-wider text-white transition-all duration-300 hover:bg-fire-500">
              View Full Menu
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* 100% Natural Ingredients — text top, two images below */}
      <section className="px-6 py-20 md:px-12 md:py-28">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <span className="text-xs font-semibold uppercase tracking-widest text-fire-600">Pure Ingredients</span>
            <h2 className="font-display mt-4 text-5xl leading-[0.9] tracking-[-1px] md:text-7xl lg:text-8xl">
              100% Natural
              <br />
              <span className="text-brand-500">Ingredients</span>
            </h2>
            <p className="mx-auto mt-6 max-w-lg text-sm leading-relaxed text-warm-800/50">
              No artificial flavors. No preservatives. No shortcuts. Every drink is made with
              real, recognizable ingredients — sourced with care, blended with purpose.
            </p>
          </div>
          <div className="mt-12 flex flex-col gap-6 md:flex-row">
            <div className="flex-1 overflow-hidden rounded-3xl">
              <img src="/images/smoothie.jpg" alt="Natural ingredients" className="h-full w-full object-cover" style={{ maxHeight: 480, minHeight: 320 }} />
            </div>
            <div className="flex-1 overflow-hidden rounded-3xl">
              <img src="/images/citrus.jpg" alt="Fresh citrus" className="h-full w-full object-cover" style={{ maxHeight: 480, minHeight: 320 }} />
            </div>
          </div>
        </div>
      </section>

      {/* Split: image + text */}
      <section className="flex flex-col md:flex-row">
        <div className="h-72 overflow-hidden md:h-auto md:w-1/2">
          <img src="/images/matcha.jpg" alt="Matcha drink" className="h-full w-full object-cover" />
        </div>
        <div className="flex items-center px-6 py-16 md:w-1/2 md:px-14 md:py-24">
          <div className="max-w-md">
            <span className="text-xs font-semibold uppercase tracking-widest text-fire-600">Signature Blend</span>
            <h2 className="font-display mt-3 text-4xl leading-[0.9] tracking-[-1px] md:text-5xl">Focus Elixir</h2>
            <p className="mt-4 text-sm leading-relaxed text-warm-800/50">
              Our bestseller. Matcha, Lion's Mane mushroom, and L-Theanine work together to deliver
              sharp, calm focus without the jitters or crash. Perfect for deep work, study sessions,
              or mornings when you need to be at your best.
            </p>
            <div className="mt-5 flex items-center gap-1.5 text-sm font-semibold text-brand-600">
              <Star size={14} className="fill-brand-500 text-brand-500" />
              Boosts concentration by 40%
            </div>
            <Link to="/menu" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-fire-600 transition-colors hover:text-fire-500">
              Order Now <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* Split: text + image (reversed) */}
      <section className="flex flex-col md:flex-row-reverse">
        <div className="h-72 overflow-hidden md:h-auto md:w-1/2">
          <img src="/images/turmeric.jpg" alt="Turmeric drink" className="h-full w-full object-cover" />
        </div>
        <div className="flex items-center px-6 py-16 md:w-1/2 md:px-14 md:py-24">
          <div className="max-w-md">
            <span className="text-xs font-semibold uppercase tracking-widest text-fire-600">Wellness Blend</span>
            <h2 className="font-display mt-3 text-4xl leading-[0.9] tracking-[-1px] md:text-5xl">Bloom</h2>
            <p className="mt-4 text-sm leading-relaxed text-warm-800/50">
              Turmeric, ginger, probiotics, and a touch of black pepper for absorption. Bloom is
              our anti-inflammatory powerhouse — supporting gut health, immunity, and glowing skin
              with every sip. Warm or iced, it's a daily ritual worth keeping.
            </p>
            <div className="mt-5 flex items-center gap-1.5 text-sm font-semibold text-brand-600">
              <Star size={14} className="fill-brand-500 text-brand-500" />
              Reduces inflammation markers
            </div>
            <Link to="/menu" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-fire-600 transition-colors hover:text-fire-500">
              Order Now <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* The Kitchen — full yellow, image right, box overlapping */}
      <section className="relative overflow-hidden bg-brand-400 px-6 py-20 md:py-32 md:px-12">
        <div className="mx-auto flex max-w-6xl flex-col items-center md:flex-row">
          {/* Text box — on the left, overlapping the image */}
          <div className="relative z-10 -mb-16 rounded-3xl bg-warm-900 p-8 text-white md:-mr-20 md:mb-0 md:p-12" style={{ maxWidth: 400 }}>
            <span className="text-xs font-semibold uppercase tracking-widest text-brand-400">The Kitchen</span>
            <h2 className="font-display mt-3 text-3xl leading-[0.9] tracking-[-1px] md:text-4xl">
              Crafted With
              <br />
              <span className="text-brand-400">Purpose</span>
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-white/50">
              Every drink that leaves our kitchen is made with intention. We source the finest natural
              ingredients, blend them in small batches, and serve them fresh — because you deserve
              more than just a drink. You deserve a ritual that works for you.
            </p>
          </div>
          {/* Large bold image on the right */}
          <div className="relative shrink-0 md:w-[600px] lg:w-[700px]">
            <div className="overflow-hidden rounded-3xl shadow-2xl" style={{ height: 'min(70vw, 520px)' }}>
              <img src="/images/coffee.jpg" alt="Mindfuel Kitchen" className="h-full w-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-24 md:py-28 md:px-12">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-4xl leading-[0.9] tracking-[-1px] md:text-6xl">
            Ready to <span className="text-brand-500">Fuel Up?</span>
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-warm-800/50">
            Come visit our cafe or browse the full menu. Your mind will thank you.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link to="/menu" className="group inline-flex items-center gap-2 rounded-full bg-fire-600 px-8 py-3.5 text-sm font-bold uppercase tracking-wider text-white transition-all duration-300 hover:bg-fire-500">
              Browse Menu
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </Link>
            <Link to="/contact" className="group inline-flex items-center gap-2 rounded-full border border-warm-200 bg-white px-8 py-3.5 text-sm font-bold uppercase tracking-wider text-warm-800 transition-all duration-300 hover:border-warm-300">
              Find Us
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
