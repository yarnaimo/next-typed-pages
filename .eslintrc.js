/**
 * @type {import('eslint').Linter.Config}
 */
const config = {
  extends: ['@yarnaimo'],
  parserOptions: {
    project: './tsconfig.json',
  },
  rules: {
    'no-restricted-imports': [
      'error',
      {
        paths: [
          'signale',
          'got',
          'ky',
          'ky-universal',
          'dayjs',
          'firebase',
          'remeda',
          'runtypes',
          '@sindresorhus/is',
          'type-fest',
        ],
        patterns: ['**/__mocks__/**'],
      },
    ],
  },
}

module.exports = config
