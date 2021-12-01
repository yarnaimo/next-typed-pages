import { NextRouter } from 'next/router'
import { Merge } from 'type-fest'
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

export type HasIndexSymbol<K extends string> = {
  [$index]: K
}

export type MappedRouteOptions<
  T extends RouteOptions,
  Prev extends string
> = HasIndexSymbol<Prev> &
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

type Subtract<T extends number> = [never, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9][T]

type ExtractDynamicKeysFromOptions<T, Depth extends number = 10> = [
  Depth,
] extends [never]
  ? never
  : {
      [K in keyof T]:
        | (K extends `[${infer U}]` ? U : never)
        | (T[K] extends object
            ? ExtractDynamicKeysFromOptions<T[K], Subtract<Depth>>
            : never)
    }[keyof T]

export type UsePagesRouter<T extends RouteOptions> = Merge<
  NextRouter,
  { query: { [K in ExtractDynamicKeysFromOptions<T>]?: string } }
>
