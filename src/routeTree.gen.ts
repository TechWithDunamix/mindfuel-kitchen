import { rootRoute, indexRoute, menuRoute, contactRoute } from './routes'

export const routeTree = rootRoute.addChildren([
  indexRoute,
  menuRoute,
  contactRoute,
])
