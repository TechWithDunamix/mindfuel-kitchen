import { motion } from 'framer-motion'
import { Star } from 'lucide-react'

const categories = [
  {
    name: 'Focus & Clarity',
    items: [
      { name: 'Focus Elixir', price: '₦4,500', img: '/images/matcha.jpg', desc: 'Matcha, Lion\'s Mane, L-Theanine — sharp focus without the jitters.', benefit: 'Boosts concentration by 40%' },
      { name: 'Brainwave', price: '₦4,000', img: '/images/berry.jpg', desc: 'Blue spirulina, bacopa monnieri, coconut water — cognitive repair.', benefit: 'Enhances memory recall' },
      { name: 'The Professor', price: '₦5,000', img: '/images/coffee.jpg', desc: 'Double espresso, MCT oil, alpha-GPC, cinnamon — PhD-level fuel.', benefit: 'Sustained energy for 6h+' },
    ],
  },
  {
    name: 'Energy & Vitality',
    items: [
      { name: 'Bloom', price: '₦4,000', img: '/images/turmeric.jpg', desc: 'Turmeric, ginger, probiotics, black pepper — anti-inflammatory.', benefit: 'Reduces inflammation markers' },
      { name: 'Solar Flare', price: '₦4,500', img: '/images/citrus.jpg', desc: 'Mango, habanero, lime, electrolytes — spicy sunrise.', benefit: 'Natural energy + hydration' },
      { name: 'Iron Brew', price: '₦3,500', img: '/images/berry.jpg', desc: 'Beetroot, apple, ginger, iron-rich greens — oxygen boost.', benefit: 'Improves blood oxygenation' },
    ],
  },
  {
    name: 'Calm & Balance',
    items: [
      { name: 'Zen', price: '₦4,500', img: '/images/matcha.jpg', desc: 'Ashwagandha, chamomile, warm oat milk — liquid calm.', benefit: 'Reduces cortisol by 30%' },
      { name: 'Moon Milk', price: '₦5,000', img: '/images/berry.jpg', desc: 'Reishi, magnesium, honey, warm almond milk — sleep deep.', benefit: 'Improves sleep quality' },
      { name: 'Adapto', price: '₦4,000', img: '/images/turmeric.jpg', desc: 'Rhodiola, tulsi, green tea, lemon — balanced adaptation.', benefit: 'Increases stress resilience' },
    ],
  },
  {
    name: 'Gut & Glow',
    items: [
      { name: 'Garden Party', price: '₦3,500', img: '/images/citrus.jpg', desc: 'Kale, celery, cucumber, mint, prebiotics — green goodness.', benefit: 'Supports gut microbiome' },
      { name: 'Glow', price: '₦4,500', img: '/images/smoothie.jpg', desc: 'Collagen, vitamin C, passionfruit, aloe — beauty from within.', benefit: 'Boosts collagen production' },
      { name: 'Fire Cider Shot', price: '₦2,000', img: '/images/citrus.jpg', desc: 'ACV, garlic, turmeric, cayenne — immune blast.', benefit: 'Strengthens immune defense' },
    ],
  },
]

export default function Menu() {
  return (
    <section className="pt-24 pb-24">
      <div className="mx-auto max-w-6xl px-6 md:px-10">
        <div className="mb-16 pt-8 md:pt-12">
          <span className="text-xs font-semibold uppercase tracking-widest text-fire-600">Crafted For You</span>
          <h1 className="font-display mt-3 text-5xl leading-[0.9] tracking-[-1px] md:text-7xl lg:text-8xl">
            Our <span className="text-brand-500">Menu</span>
          </h1>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-warm-800/50">
            Every drink is formulated with purpose. Pick your need — we have a blend for it.
          </p>
        </div>

        {categories.map((cat, ci) => (
          <div key={cat.name} className="mb-16 last:mb-0">
            <h2 className="font-display mb-8 text-2xl tracking-wide md:text-3xl">{cat.name}</h2>
            <div className="grid gap-6 md:grid-cols-3">
              {cat.items.map((item, ii) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: ii * 0.08 }}
                  className="group overflow-hidden rounded-2xl border border-warm-200/40 bg-white transition-all duration-300 hover:shadow-lg hover:shadow-brand-200/10"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={item.img}
                      alt={item.name}
                      className="h-full w-full object-cover transition-all duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-5">
                    <div className="flex items-start justify-between">
                      <h3 className="font-display text-lg tracking-wide transition-colors duration-200 group-hover:text-fire-600">{item.name}</h3>
                      <span className="font-display text-base tracking-wide text-fire-600">{item.price}</span>
                    </div>
                    <p className="mt-1.5 text-xs leading-relaxed text-warm-800/50">{item.desc}</p>
                    <div className="mt-3 inline-flex items-center gap-1 rounded-full bg-brand-100 px-3 py-1 text-xs font-semibold text-brand-700">
                      <Star size={10} className="fill-brand-500 text-brand-500" />
                      {item.benefit}
                    </div>
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
