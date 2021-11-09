import { readdirSync, writeFileSync } from 'fs'
import { join } from 'path'

const buildRoutesObj = (dir: string): object => {
  return Object.fromEntries(
    readdirSync(dir, { withFileTypes: true })
      .map((dirent): [string, string | object] | undefined => {
        if (dirent.isFile()) {
          const m = dirent.name.match(/^((?!_).+)\.tsx?$/)
          return m?.[1] ? [m[1], '$route'] : undefined
        }
        if (dirent.isDirectory()) {
          return [dirent.name, buildRoutesObj(join(dir, dirent.name))]
        }
        return undefined
      })
      .flatMap((entry) => (entry ? [entry] : [])),
  )
}

type Options = {
  dir: string
  name: string
  output: string
  defaultExport: boolean
}

export const buildGeneratedRoutesContent = async ({
  dir,
  name,
  output,
  defaultExport,
}: Options) => {
  const routesObj = JSON.stringify(buildRoutesObj(dir), undefined, 2).replace(
    /"\$route"/g,
    '$route',
  )

  const content = [
    `import { $route, createRoutes } from 'next-typed-path'`,
    `export const ${name} = createRoutes(${routesObj})`,
    defaultExport ? `export default ${name}` : undefined,
  ]
    .filter((line) => line)
    .join('\n\n')

  const prettier = await import('prettier').catch(() => undefined)
  if (!prettier) {
    return content
  }

  const config = await prettier.default.resolveConfig(output)
  const formattedContent = prettier.default.format(content, {
    filepath: output,
    ...config,
  })
  return formattedContent
}

export const generate = async ({
  dir,
  name,
  output,
  defaultExport,
}: Options) => {
  const content = await buildGeneratedRoutesContent({
    dir,
    name,
    output,
    defaultExport,
  })

  writeFileSync(output, content)
  console.log(`🎉 Generated ${output}`)
}
