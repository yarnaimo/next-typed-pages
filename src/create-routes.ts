import { $dynamic, $route } from './symbols'
import {
  MappedRouteOptions,
  MappedRouteValue,
  RouteOptions,
  RouteValue,
} from './types'
import { joinPath } from './utils'

const mapRouteValue = <R extends typeof $route | RouteOptions>(
  path: string,
  route: R,
): MappedRouteValue<R> => {
  return (route === $route
    ? path
    : mapRouteOptions(path, route as RouteOptions)) as MappedRouteValue<R>
}

const mapRouteOptions = <T extends RouteOptions>(
  prevPath: string,
  options: T,
): MappedRouteOptions<T> => {
  const dynamicRoute = options[$dynamic as any] as RouteValue | undefined

  const dynamicRouteFunction = dynamicRoute
    ? (path: string) => mapRouteValue(joinPath(prevPath, path), dynamicRoute)
    : {}

  const mappedOptions = Object.fromEntries(
    Object.entries(options).map(
      ([path, route]) =>
        [path, mapRouteValue(joinPath(prevPath, path), route)] as const,
    ),
  )

  return Object.assign(
    dynamicRouteFunction,
    mappedOptions,
  ) as MappedRouteOptions<T>
}

export const createRoutes = <T extends RouteOptions>(
  options: T,
): MappedRouteOptions<T> => mapRouteOptions('', options)
