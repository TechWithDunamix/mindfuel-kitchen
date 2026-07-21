import { useEffect, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import {
  Loader2,
  LogOut,
  RefreshCw,
  Pause,
  Play,
  XCircle,
  ArrowRight,
  User,
} from 'lucide-react'
import {
  requestOTP,
  verifyOTP,
  getMemberInfo,
  listMySubscriptions,
  pauseSubscription,
  resumeSubscription,
  cancelSubscription,
  setMemberToken,
  isMemberLoggedIn,
  formatPrice,
  formatDate,
  statusColor,
  type MemberInfo,
  type Subscription,
} from '../lib/api'

export default function Member() {
  const [loggedIn, setLoggedIn] = useState(isMemberLoggedIn())
  const [otpEmail, setOtpEmail] = useState('')
  const [otpName, setOtpName] = useState('')
  const [otpCode, setOtpCode] = useState('')
  const [otpStep, setOtpStep] = useState<'email' | 'otp'>('email')
  const [otpLoading, setOtpLoading] = useState(false)
  const [otpError, setOtpError] = useState<string | null>(null)
  const [otpSuccess, setOtpSuccess] = useState('')

  const [member, setMember] = useState<MemberInfo | null>(null)
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [portalLoading, setPortalLoading] = useState(false)
  const [portalError, setPortalError] = useState<string | null>(null)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  useEffect(() => {
    if (loggedIn) loadPortal()
  }, [loggedIn])

  const loadPortal = async () => {
    setPortalLoading(true)
    setPortalError(null)
    try {
      const [me, subs] = await Promise.all([getMemberInfo(), listMySubscriptions()])
      setMember(me)
      setSubscriptions(subs)
    } catch (e: unknown) {
      if (e instanceof Error && e.message.includes('401')) {
        setMemberToken('')
        setLoggedIn(false)
        setPortalError('Session expired. Please log in again.')
        return
      }
      setPortalError(e instanceof Error ? e.message : 'Failed to load portal.')
    } finally {
      setPortalLoading(false)
    }
  }

  const handleRequestOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    setOtpLoading(true)
    setOtpError(null)
    setOtpSuccess('')
    try {
      await requestOTP({ email: otpEmail, name: otpName || undefined })
      setOtpStep('otp')
      setOtpSuccess('Code sent to your email.')
    } catch (err) {
      setOtpError(err instanceof Error ? err.message : 'Failed to send code.')
    } finally {
      setOtpLoading(false)
    }
  }

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    setOtpLoading(true)
    setOtpError(null)
    try {
      const res = await verifyOTP({ email: otpEmail, otp: otpCode })
      if (!res?.access_token) throw new Error('No token returned.')
      setMemberToken(res.access_token)
      setLoggedIn(true)
      setOtpStep('email')
      setOtpEmail('')
      setOtpCode('')
      setOtpName('')
    } catch (err) {
      setOtpError(err instanceof Error ? err.message : 'Verification failed.')
    } finally {
      setOtpLoading(false)
    }
  }

  const handleLogout = () => {
    setMemberToken('')
    setMember(null)
    setSubscriptions([])
    setLoggedIn(false)
  }

  const handlePause = async (id: string) => {
    setActionLoading(id)
    try {
      await pauseSubscription(id)
      await loadPortal()
    } catch (err) {
      setPortalError(err instanceof Error ? err.message : 'Pause failed.')
    } finally {
      setActionLoading(null)
    }
  }

  const handleResume = async (id: string) => {
    setActionLoading(id)
    try {
      await resumeSubscription(id)
      await loadPortal()
    } catch (err) {
      setPortalError(err instanceof Error ? err.message : 'Resume failed.')
    } finally {
      setActionLoading(null)
    }
  }

  const handleCancel = async (id: string) => {
    if (!confirm('Cancel this subscription?')) return
    setActionLoading(id)
    try {
      await cancelSubscription(id)
      await loadPortal()
    } catch (err) {
      setPortalError(err instanceof Error ? err.message : 'Cancel failed.')
    } finally {
      setActionLoading(null)
    }
  }

  if (!loggedIn) {
    return (
      <section className="pt-24 pb-24">
        <div className="mx-auto max-w-lg px-6 md:px-10">
          <div className="mb-12 pt-8 md:pt-12">
            <span className="text-xs font-semibold uppercase tracking-widest text-primary">Account</span>
            <h1 className="font-display mt-3 text-5xl leading-[0.9] tracking-[-1px] md:text-6xl">
              Member <span className="text-primary">Login</span>
            </h1>
            <p className="mt-4 text-sm leading-relaxed text-muted">
              Sign in with a one-time code sent to your email.
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-border/30 bg-surface p-7"
          >
            {otpSuccess && (
              <div className="mb-4 rounded-xl bg-success/10 px-3 py-2 text-xs text-success">{otpSuccess}</div>
            )}
            {otpError && (
              <div className="mb-4 rounded-xl bg-danger/10 px-3 py-2 text-xs text-danger">{otpError}</div>
            )}

            {otpStep === 'email' ? (
              <form onSubmit={handleRequestOTP} className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-muted/60">Name (optional)</label>
                  <input
                    type="text"
                    value={otpName}
                    onChange={(e) => setOtpName(e.target.value)}
                    placeholder="Your name"
                    className="w-full rounded-xl border border-border/40 bg-surface px-4 py-3 text-sm text-text placeholder:text-muted/50 outline-none transition-colors focus:border-primary"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-muted/60">Email</label>
                  <input
                    type="email"
                    value={otpEmail}
                    onChange={(e) => setOtpEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    className="w-full rounded-xl border border-border/40 bg-surface px-4 py-3 text-sm text-text placeholder:text-muted/50 outline-none transition-colors focus:border-primary"
                  />
                </div>
                <button
                  type="submit"
                  disabled={otpLoading || !otpEmail}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-bold uppercase tracking-wider text-white transition-all duration-300 hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {otpLoading ? <Loader2 size={16} className="animate-spin" /> : null}
                  {otpLoading ? 'Sending...' : 'Send login code'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOTP} className="space-y-4">
                <p className="text-sm text-muted">
                  Code sent to <span className="font-semibold text-text">{otpEmail}</span>
                </p>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-muted/60">Verification code</label>
                  <input
                    type="text"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    placeholder="Enter code"
                    required
                    className="w-full rounded-xl border border-border/40 bg-surface px-4 py-3 text-sm text-text placeholder:text-muted/50 outline-none transition-colors focus:border-primary"
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={otpLoading || !otpCode}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-bold uppercase tracking-wider text-white transition-all duration-300 hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {otpLoading ? <Loader2 size={16} className="animate-spin" /> : null}
                    {otpLoading ? 'Verifying...' : 'Verify & login'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setOtpStep('email')
                      setOtpCode('')
                      setOtpError(null)
                    }}
                    className="rounded-full border border-border/40 px-5 py-3.5 text-sm font-semibold text-muted transition-colors hover:text-text"
                  >
                    Back
                  </button>
                </div>
                <button
                  type="button"
                  onClick={handleRequestOTP}
                  disabled={otpLoading}
                  className="w-full text-center text-xs text-primary transition-colors hover:text-primary-hover"
                >
                  Resend code
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </section>
    )
  }

  return (
    <section className="pt-24 pb-24">
      <div className="mx-auto max-w-4xl px-6 md:px-10">
        <div className="mb-8 flex items-center justify-between pt-8 md:pt-12">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-primary">Account</span>
            <h1 className="font-display mt-3 text-4xl leading-[0.9] tracking-[-1px] md:text-5xl">
              Your <span className="text-primary">Portal</span>
            </h1>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={loadPortal}
              disabled={portalLoading}
              className="rounded-full border border-border/40 p-2.5 text-muted transition-colors hover:text-text"
              aria-label="Refresh"
            >
              <RefreshCw size={16} className={portalLoading ? 'animate-spin' : ''} />
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-full border border-border/40 p-2.5 text-muted transition-colors hover:text-danger"
              aria-label="Logout"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>

        {portalLoading && (
          <div className="flex items-center gap-3 text-muted">
            <Loader2 size={18} className="animate-spin" />
            <span className="text-sm">Loading your membership...</span>
          </div>
        )}

        {portalError && (
          <div className="mb-4 rounded-xl bg-danger/10 px-3 py-2 text-xs text-danger">{portalError}</div>
        )}

        {!portalLoading && member && (
          <div className="space-y-6">
            <div className="rounded-2xl border border-border/30 bg-surface p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <User size={18} className="text-primary" />
                </div>
                <div>
                  <h3 className="font-display text-lg tracking-wide">{member.name || 'Member'}</h3>
                  <p className="text-sm text-muted">{member.email}</p>
                </div>
              </div>
              <p className="mt-3 text-sm text-muted">{subscriptions.length} subscription{subscriptions.length === 1 ? '' : 's'}</p>
            </div>

            {!portalLoading && subscriptions.length === 0 && !portalError && (
              <div className="rounded-2xl border border-border/30 bg-surface p-8 text-center">
                <p className="text-muted">No subscriptions yet. Browse plans and subscribe.</p>
                <Link to="/plans" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-primary-hover">
                  View plans <ArrowRight size={14} />
                </Link>
              </div>
            )}

            {subscriptions.map((sub) => {
              const sc = statusColor(sub.status)
              return (
                <motion.div
                  key={sub.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-2xl border border-border/30 bg-surface p-6"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-display text-lg tracking-wide">{sub.plan?.name || 'Subscription'}</h3>
                      <p className="mt-1 text-sm text-muted">
                        {formatPrice(sub.price, sub.currency)} / {sub.billing_interval} &middot; Next {formatDate(sub.next_delivery_date)}
                      </p>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold bg-${sc}/10 text-${sc}`}>
                      {sub.status}
                    </span>
                  </div>

                  {sub.items && sub.items.length > 0 && (
                    <div className="mt-4">
                      <h4 className="mb-2 text-xs font-bold uppercase tracking-widest text-muted/40">Items</h4>
                      <div className="space-y-2">
                        {sub.items.map((it, idx) => (
                          <div key={idx} className="flex items-center justify-between rounded-lg bg-surface-hover px-3 py-2">
                            <span className="text-sm">{it.name}</span>
                            <div className="flex items-center gap-3">
                              <span className="text-xs text-muted">Qty {it.quantity}</span>
                              <span className="text-sm font-semibold">{formatPrice(it.price, sub.currency)}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="mt-4 flex flex-wrap gap-2">
                    {sub.status === 'active' && (
                      <button
                        type="button"
                        onClick={() => handlePause(sub.id)}
                        disabled={actionLoading === sub.id}
                        className="inline-flex items-center gap-1.5 rounded-full border border-border/40 px-4 py-2 text-xs font-semibold text-muted transition-colors hover:text-text"
                      >
                        {actionLoading === sub.id ? <Loader2 size={12} className="animate-spin" /> : <Pause size={12} />}
                        Pause
                      </button>
                    )}
                    {sub.status === 'paused' && (
                      <button
                        type="button"
                        onClick={() => handleResume(sub.id)}
                        disabled={actionLoading === sub.id}
                        className="inline-flex items-center gap-1.5 rounded-full border border-border/40 px-4 py-2 text-xs font-semibold text-muted transition-colors hover:text-text"
                      >
                        {actionLoading === sub.id ? <Loader2 size={12} className="animate-spin" /> : <Play size={12} />}
                        Resume
                      </button>
                    )}
                    {sub.status !== 'cancelled' && (
                      <button
                        type="button"
                        onClick={() => handleCancel(sub.id)}
                        disabled={actionLoading === sub.id}
                        className="inline-flex items-center gap-1.5 rounded-full border border-danger/30 px-4 py-2 text-xs font-semibold text-danger transition-colors hover:bg-danger/10"
                      >
                        {actionLoading === sub.id ? <Loader2 size={12} className="animate-spin" /> : <XCircle size={12} />}
                        Cancel
                      </button>
                    )}
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
