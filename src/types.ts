import { $route } from './symbols'

export type DynamicRouteKey = `[${string}]`
export type ExtractDynamicRouteKey<T> = Extract<keyof T, DynamicRouteKey>

export type RouteValue = typeof $route | RouteOptions

export type RouteOptions = {
  [K in string]: RouteValue
}

export type MappedRouteValue<
  R extends typeof $route | RouteOptions
> = R extends typeof $route
  ? string
  : R extends RouteOptions
  ? MappedRouteOptions<R>
  : never

export type MappedRouteOptions<T extends RouteOptions> = {
  [K in keyof T as K extends DynamicRouteKey ? never : K]: MappedRouteValue<
    T[K]
  >
} &
  (ExtractDynamicRouteKey<T> extends never
    ? {}
    : (path: string | null) => MappedRouteValue<T[ExtractDynamicRouteKey<T>]>)
