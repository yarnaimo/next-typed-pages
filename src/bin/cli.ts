import getopts from 'getopts'
import { generate } from './commands/generate'

const help = `
Usage:

next-typed-path generate <output-path>   Generate routes
  --dir, -d    Path to pages directory (default: src/pages)
  --name, -n   Variable name of exported routes object (default: routes)
`.trim()

export const cli = async () => {
  const {
    _: [command, ...args],
    dir,
    name,
  } = getopts(process.argv.slice(2), {
    alias: { dir: 'd', name: 'n' },
    default: { dir: 'src/pages', name: 'routes' },
  })

  switch (command) {
    case 'generate':
      if (!args[0]) {
        console.error('Output path must be specified')
        process.exit(1)
      }
      void generate({ output: args[0], dir, name })
      break

    case '--help':
      console.log(help)
      break

    default:
      console.log(help)
      process.exit(1)
  }
}
