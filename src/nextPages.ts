import { useRouter } from 'next/router'
import { $index, $route } from './symbols'
import {
  HasIndexSymbol,
  MappedRouteOptions,
  MappedRouteValue,
  RouteOptions,
  UsePagesRouter,
} from './types'
import { isDynamicRouteKey, joinPath } from './utils'

const mapRouteValue = <R extends typeof $route | RouteOptions>(
  path: string,
  route: R,
): MappedRouteValue<R, any> => {
  return (route === $route
    ? path || '/'
    : mapRouteOptions(path, route as RouteOptions)) as MappedRouteValue<R, any>
}

const mapRouteOptions = <T extends RouteOptions>(
  prevPath: string,
  options: T,
): MappedRouteOptions<T, any> => {
  const optionEntries = Object.entries(options)

  const [dynamicRoutePath, dynamicRoute] =
    optionEntries.find(([key]) => isDynamicRouteKey(key)) ?? []

  const dynamicRouteFunction = dynamicRoute
    ? (...key: string[] | [null]) =>
        mapRouteValue(
          joinPath(
            prevPath,
            key[0] === null ? [dynamicRoutePath!] : (key as string[]),
          ),
          dynamicRoute,
        )
    : {}

  const mappedOptions = Object.fromEntries(
    optionEntries.map(
      ([key, route]) =>
        [key, mapRouteValue(joinPath(prevPath, [key]), route)] as const,
    ),
  )

  return Object.assign(dynamicRouteFunction, mappedOptions, {
    [$index]: prevPath,
  }) as MappedRouteOptions<T, any>
}

export const nextPages = <T extends RouteOptions>(options: T) => {
  const pages: MappedRouteOptions<T, ''> = mapRouteOptions('', options) as any
  const usePagesRouter = () => useRouter() as UsePagesRouter<T>

  return { pages, usePagesRouter }
}

export const isSubpathOf = (
  pathname: string,
  routeOptions: HasIndexSymbol<string>,
) => {
  const directoryPath = routeOptions[$index]
  return pathname === directoryPath || pathname.startsWith(directoryPath + '/')
}
