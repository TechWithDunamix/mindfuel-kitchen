import { motion } from 'framer-motion'
import { MapPin, Clock, Phone, Mail, Send, ArrowRight } from 'lucide-react'
import { Link } from '@tanstack/react-router'

export default function Contact() {
  return (
    <section className="pt-24 pb-24">
      <div className="mx-auto max-w-6xl px-6 md:px-10">
        <div className="mb-16 pt-8 md:pt-12">
          <span className="text-xs font-semibold uppercase tracking-widest text-primary">Get In Touch</span>
          <h1 className="font-display mt-3 text-5xl leading-[0.9] tracking-[-1px] md:text-7xl lg:text-8xl">
            Find <span className="text-primary">Us</span>
          </h1>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-muted">
            Come visit, give us a call, or drop us a message. We'd love to hear from you.
          </p>
        </div>

        <div className="flex flex-col gap-10 md:flex-row">
          <div className="grid flex-1 gap-5 md:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="rounded-2xl border border-border/30 bg-surface p-6 transition-all duration-300 hover:bg-surface-hover"
            >
              <MapPin size={20} className="text-primary" />
              <h3 className="font-display mt-3 text-lg tracking-wide">Location</h3>
              <p className="mt-1.5 text-sm text-muted">123 Wellness Avenue<br />Victoria Island, Lagos</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.08 }}
              className="rounded-2xl border border-border/30 bg-surface p-6 transition-all duration-300 hover:bg-surface-hover"
            >
              <Clock size={20} className="text-primary" />
              <h3 className="font-display mt-3 text-lg tracking-wide">Hours</h3>
              <div className="mt-1.5 space-y-0.5 text-sm text-muted">
                <p>Mon-Fri: 7AM - 8PM</p>
                <p>Sat: 8AM - 6PM</p>
                <p>Sun: 9AM - 4PM</p>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.16 }}
              className="rounded-2xl border border-border/30 bg-surface p-6 transition-all duration-300 hover:bg-surface-hover"
            >
              <Phone size={20} className="text-primary" />
              <h3 className="font-display mt-3 text-lg tracking-wide">Phone</h3>
              <p className="mt-1.5 text-sm text-muted">+234 800 MIND-FUEL<br />+234 800 6463 3835</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.24 }}
              className="rounded-2xl border border-border/30 bg-surface p-6 transition-all duration-300 hover:bg-surface-hover"
            >
              <Mail size={20} className="text-primary" />
              <h3 className="font-display mt-3 text-lg tracking-wide">Email</h3>
              <p className="mt-1.5 text-sm text-muted">hello@mindfuelkitchen.com<br />order@mindfuelkitchen.com</p>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="md:w-[380px]"
          >
            <div className="rounded-2xl border border-border/30 bg-surface p-7">
              <h3 className="font-display text-xl tracking-wide">Send a Message</h3>
              <p className="mt-1 text-xs text-muted/60">We'll get back within 24 hours.</p>
              <form className="mt-6 space-y-4" onSubmit={(e) => e.preventDefault()}>
                <input type="text" placeholder="Your Name" className="w-full rounded-xl border border-border/40 bg-surface px-4 py-3 text-sm text-text placeholder:text-muted/50 outline-none transition-all duration-200 focus:border-primary" />
                <input type="email" placeholder="Your Email" className="w-full rounded-xl border border-border/40 bg-surface px-4 py-3 text-sm text-text placeholder:text-muted/50 outline-none transition-all duration-200 focus:border-primary" />
                <textarea rows={4} placeholder="Your Message" className="w-full rounded-xl border border-border/40 bg-surface px-4 py-3 text-sm text-text placeholder:text-muted/50 outline-none transition-all duration-200 focus:border-primary resize-none" />
                <button type="submit" className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-bold uppercase tracking-wider text-white transition-all duration-300 hover:bg-primary-hover">
                  Send
                  <Send size={14} className="transition-transform group-hover:translate-x-0.5" />
                </button>
              </form>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto mt-16 text-center"
        >
          <Link to="/menu" className="group inline-flex items-center gap-2 rounded-full bg-primary px-8 py-3.5 text-sm font-bold uppercase tracking-wider text-white transition-all duration-300 hover:bg-primary-hover">
            Browse Our Menu
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
