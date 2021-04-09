import { DynamicRouteKey } from './types'

export const joinPath = (prevPath: string, path: string) =>
  path === 'index' ? prevPath : `${prevPath}/${path}`

export const isDynamicRouteKey = (key: string): key is DynamicRouteKey =>
  key.startsWith('[') && key.endsWith(']')
