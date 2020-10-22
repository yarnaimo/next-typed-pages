export const joinPath = (prevPath: string, path: string) =>
  path === 'index' ? prevPath : `${prevPath}/${path}`
