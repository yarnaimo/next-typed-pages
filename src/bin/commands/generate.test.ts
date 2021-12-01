import { buildGeneratedRoutesContent } from './generate'

test('generate', async () => {
  expect(
    await buildGeneratedRoutesContent({
      dir: 'src/pages',
      output: 'src/__pages.ts',
    }),
  ).toMatchSnapshot()
})
