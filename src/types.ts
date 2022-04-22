import { NextRouter } from 'next/router'
import { Merge } from 'type-fest'
import { $index, $route } from './symbols'

export type JoinPath<T extends string, U extends string[]> = U extends ['index']
  ? T
  : U extends [infer U1, ...infer U2]
  ? `${T}/${JoinPath<Extract<U1, string>, Extract<U2, string[]>>}`
  : U extends []
  ? T
  : never

export type DynamicRouteKey<T extends string = string> = `[${T}]`
export type CatchAllRoutesKey<T extends string = string> = `[...${T}]`
export type OptionalCatchAllRoutesKey<T extends string = string> = `[[...${T}]]`

export type ExtractKey<
  T,
  U extends 'dynamic' | 'catchAll' | 'optionalCatchAll'
> = {
  dynamic: Exclude<
    Extract<keyof T, DynamicRouteKey>,
    CatchAllRoutesKey | OptionalCatchAllRoutesKey
  >
  catchAll: Extract<keyof T, CatchAllRoutesKey>
  optionalCatchAll: Extract<keyof T, OptionalCatchAllRoutesKey>
}[U]

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
      JoinPath<Prev, [K & string]>
    >
  } &
  (ExtractKey<T, 'dynamic'> extends never
    ? {}
    : <K extends [string] | [null]>(
        ...path: K
      ) => MappedRouteValue<
        T[ExtractKey<T, 'dynamic'>],
        JoinPath<Prev, K extends string[] ? K : [ExtractKey<T, 'dynamic'>]>
      >) &
  (ExtractKey<T, 'catchAll'> extends never
    ? {}
    : <K extends [string, ...string[]] | [null]>(
        ...path: K
      ) => MappedRouteValue<
        T[ExtractKey<T, 'catchAll'>],
        JoinPath<Prev, K extends string[] ? K : [ExtractKey<T, 'catchAll'>]>
      >) &
  (ExtractKey<T, 'optionalCatchAll'> extends never
    ? {}
    : <K extends string[] | [null]>(
        ...path: K
      ) => MappedRouteValue<
        T[ExtractKey<T, 'optionalCatchAll'>],
        JoinPath<
          Prev,
          K extends string[] ? K : [ExtractKey<T, 'optionalCatchAll'>]
        >
      >)

type Subtract<T extends number> = [never, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9][T]

type ExtractDynamicKeysFromOptions<T, Depth extends number = 10> = [
  Depth,
] extends [never]
  ? never
  : {
      [K in keyof T]:
        | (K extends Exclude<
            DynamicRouteKey<infer U>,
            CatchAllRoutesKey | OptionalCatchAllRoutesKey
          >
            ? U
            : never)
        | (T[K] extends object
            ? ExtractDynamicKeysFromOptions<T[K], Subtract<Depth>>
            : never)
    }[keyof T]

type ExtractCatchAllRoutesKeysFromOptions<T, Depth extends number = 10> = [
  Depth,
] extends [never]
  ? never
  : {
      [K in keyof T]:
        | (K extends CatchAllRoutesKey<infer U>
            ? U
            : K extends OptionalCatchAllRoutesKey<infer U>
            ? U
            : never)
        | (T[K] extends object
            ? ExtractCatchAllRoutesKeysFromOptions<T[K], Subtract<Depth>>
            : never)
    }[keyof T]

export type UsePagesRouter<T extends RouteOptions> = Merge<
  NextRouter,
  {
    query: {
      [K in ExtractDynamicKeysFromOptions<T>]?: string
    } &
      {
        [K in ExtractCatchAllRoutesKeysFromOptions<T>]?: string[]
      } & {
        [key: string]: string
      }
  }
>
