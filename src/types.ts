import { $dynamic, $route } from './symbols'

export type RouteValue = typeof $route | RouteOptions

export type RouteOptions = {
  [K in string]: RouteValue
} & {
  [$dynamic]?: RouteValue
}

export type MappedRouteValue<
  R extends typeof $route | RouteOptions
> = R extends typeof $route
  ? string
  : R extends RouteOptions
  ? MappedRouteOptions<R>
  : never

export type MappedRouteOptions<T extends RouteOptions> = {
  [K in Extract<keyof T, string>]: MappedRouteValue<T[K]>
} &
  (T[typeof $dynamic] extends RouteValue
    ? (path: string) => MappedRouteValue<T[typeof $dynamic]>
    : {})
