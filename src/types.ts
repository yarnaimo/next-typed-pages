import { $index, $route } from './symbols'

export type JoinPath<T extends string, U extends string> = U extends 'index'
  ? T
  : `${T}/${U}`

export type DynamicRouteKey = `[${string}]`
export type ExtractDynamicRouteKey<T> = Extract<keyof T, DynamicRouteKey>

export type RouteValue = typeof $route | RouteOptions

export type RouteOptions = {
  [K in string]: RouteValue
}

export type MappedRouteValue<
  R extends typeof $route | RouteOptions,
  K extends string
> = R extends typeof $route
  ? K extends ''
    ? '/'
    : K
  : R extends RouteOptions
  ? MappedRouteOptions<R, K>
  : never

export type HasIndexSymbol = {
  [$index]: string
}

export type MappedRouteOptions<
  T extends RouteOptions,
  Prev extends string
> = HasIndexSymbol &
  {
    [K in keyof T as K extends DynamicRouteKey ? never : K]: MappedRouteValue<
      T[K],
      JoinPath<Prev, K & string>
    >
  } &
  (ExtractDynamicRouteKey<T> extends never
    ? {}
    : <K extends string | null>(
        path: K,
      ) => MappedRouteValue<
        T[ExtractDynamicRouteKey<T>],
        JoinPath<Prev, K extends string ? K : ExtractDynamicRouteKey<T>>
      >)
