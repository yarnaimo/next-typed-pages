import { $route } from './symbols'
import { MappedRouteOptions, MappedRouteValue, RouteOptions } from './types'
import { isDynamicRouteKey, joinPath } from './utils'

const mapRouteValue = <R extends typeof $route | RouteOptions>(
  path: string,
  route: R,
): MappedRouteValue<R> => {
  return (route === $route
    ? path || '/'
    : mapRouteOptions(path, route as RouteOptions)) as MappedRouteValue<R>
}

const mapRouteOptions = <T extends RouteOptions>(
  prevPath: string,
  options: T,
): MappedRouteOptions<T> => {
  const optionEntries = Object.entries(options)

  const [dynamicRoutePath, dynamicRoute] =
    optionEntries.find(([key]) => isDynamicRouteKey(key)) ?? []

  const dynamicRouteFunction = dynamicRoute
    ? (key: string | null) =>
        mapRouteValue(
          joinPath(prevPath, key ?? dynamicRoutePath!),
          dynamicRoute,
        )
    : {}

  const mappedOptions = Object.fromEntries(
    optionEntries.map(
      ([key, route]) =>
        [key, mapRouteValue(joinPath(prevPath, key), route)] as const,
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
