import { createRootRoute, createRoute, Outlet, ScrollRestoration } from '@tanstack/react-router'
import Nav from './components/Nav'
import Footer from './components/Footer'
import Landing from './pages/Landing'
import Menu from './pages/Menu'
import Plans from './pages/Plans'
import Subscribe from './pages/Subscribe'
import Member from './pages/Member'
import Contact from './pages/Contact'
import ThankYou from './pages/ThankYou'

export const rootRoute = createRootRoute({
  component: () => (
    <>
      <ScrollRestoration />
      <Nav />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </>
  ),
})

export const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: Landing,
})

export const menuRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/menu',
  component: Menu,
})

export const plansRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/plans',
  component: Plans,
})

export const subscribeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/subscribe',
  validateSearch: (search: Record<string, unknown>) => ({
    planId: (search.planId as string) || '',
  }),
  component: Subscribe,
})

export const memberRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/member',
  component: Member,
})

export const contactRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/contact',
  component: Contact,
})

export const thankYouRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/thank-you',
  component: ThankYou,
})
