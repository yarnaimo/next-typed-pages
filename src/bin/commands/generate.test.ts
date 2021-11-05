import { buildGeneratedRoutesContent } from './generate'

test('generate', async () => {
  expect(
    await buildGeneratedRoutesContent({
      dir: 'src/pages',
      name: 'routes',
      output: 'src/__routes.ts',
    }),
  ).toMatchSnapshot()
})
