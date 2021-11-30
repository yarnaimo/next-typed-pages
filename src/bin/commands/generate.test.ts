import { buildGeneratedRoutesContent } from './generate'

test('generate', async () => {
  expect(
    await buildGeneratedRoutesContent({
      dir: 'src/pages',
      name: 'pages',
      output: 'src/__pages.ts',
      defaultExport: false,
    }),
  ).toMatchSnapshot()

  expect(
    await buildGeneratedRoutesContent({
      dir: 'src/pages',
      name: 'pages',
      output: 'src/__pages.ts',
      defaultExport: true,
    }),
  ).toMatchSnapshot()
})
