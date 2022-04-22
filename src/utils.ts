import { DynamicRouteKey } from './types'

export const joinPath = (prevPath: string, path: string[]) => {
  return path.length === 1 && path[0] === 'index'
    ? prevPath
    : [prevPath, ...path].join('/')
}

export const isDynamicRouteKey = (key: string): key is DynamicRouteKey =>
  key.startsWith('[') && key.endsWith(']')
