# next-typed-path

> Type safe path utility for Next.js

## Install

```sh
yarn add next-typed-path
# or
npm i -S next-typed-path
```

## Usage

```ts
import { $dynamic, $route, createRoutes } from 'next-typed-path'

const routes = createRoutes({
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

routes.index // => '/'
routes.about // => '/about'
routes.users.index // => '/users'
routes.users(null).index // => '/users/[userId]'
routes.users('123').index // => '/users/123'
routes.users('123').posts('456').index // => '/users/123/posts/456'
routes.users('123').settings.index // => '/users/123/settings'
routes.users('123').settings.lang // => '/users/123/settings/lang'
```

### Example

```tsx
export default () => {
  return <Link href={routes.about}>About</Link>
}

export default () => {
  const router = useRouter()
  return <div onClick={() => router.push(routes.about)}>About</div>
}
```
