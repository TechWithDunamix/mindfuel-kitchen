import { rootRoute, indexRoute, menuRoute, plansRoute, subscribeRoute, memberRoute, contactRoute, thankYouRoute } from './routes'

export const routeTree = rootRoute.addChildren([
  indexRoute,
  menuRoute,
  plansRoute,
  subscribeRoute,
  memberRoute,
  contactRoute,
  thankYouRoute,
])
