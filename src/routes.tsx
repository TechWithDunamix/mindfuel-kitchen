import { createRootRoute, createRoute, Outlet, ScrollRestoration } from '@tanstack/react-router'
import Nav from './components/Nav'
import Footer from './components/Footer'
import Landing from './pages/Landing'
import Menu from './pages/Menu'
import Contact from './pages/Contact'

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

export const contactRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/contact',
  component: Contact,
})
