# next-typed-pages

> Type safe path utility for Next.js

## Install

```sh
yarn add next-typed-pages
# or
npm i -S next-typed-pages
```

## Example

1. Files in `pages` directory

```
- pages/
  - about.tsx
  - users/
    - index.tsx
    - [userId]/
      - index.tsx
      - posts/
        - [postId]/
          - index.tsx
      - settings
        - index.tsx
        - lang.tsx
```

2. Execute command

```sh
next-typed-pages generate src/next-pages.ts
```

3. Generated file content (src/next-pages.ts)

```ts
import { $route, nextPages } from 'next-typed-pages'

export const pages = nextPages({
  about: $route,
  users: {
    index: $route,
    '[userId]': {
      index: $route,
      posts: {
        '[postId]': {
          index: $route,
        },
      },
      settings: {
        index: $route,
        lang: $route,
      },
    },
  },
})
```

4. Generate route paths type-safely

```ts
pages.index // => '/'
pages.about // => '/about'
pages.users.index // => '/users'
pages.users(null).index // => '/users/[userId]'
pages.users('123').index // => '/users/123'
pages.users('123').posts('456').index // => '/users/123/posts/456'
pages.users('123').settings.index // => '/users/123/settings'
pages.users('123').settings.lang // => '/users/123/settings/lang'
```

## CLI Options

- `--dir`, `-d` : Path to pages directory (default: src/pages)
