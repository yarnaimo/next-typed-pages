import getopts from 'getopts'
import { generate } from './commands/generate'

const help = `
Usage:

next-typed-pages generate <output-path>   Generate pages file
  --dir, -d         Path to pages directory (default: src/pages)
`.trim()

export const cli = async () => {
  const {
    _: [command, ...args],
    dir,
  } = getopts(process.argv.slice(2), {
    alias: { dir: 'd' },
    default: { dir: 'src/pages' },
  })

  switch (command) {
    case 'generate':
      if (!args[0]) {
        console.error('Output path must be specified')
        process.exit(1)
      }
      void generate({ output: args[0], dir })
      break

    case '--help':
      console.log(help)
      break

    default:
      console.log(help)
      process.exit(1)
  }
}
