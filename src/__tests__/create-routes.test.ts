import { $route, createRoutes } from '..'

describe('createRoutes', () => {
  const routes = createRoutes({
    index: $route,
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

  test.each([
    [routes.index, '/'],
    [routes.about, '/about'],
    [routes.users.index, '/users'],
    [routes.users(null).index, '/users/[userId]'],
    [routes.users('123').index, '/users/123'],
    [routes.users('123').posts('456').index, '/users/123/posts/456'],
    [routes.users(null).posts(null).index, '/users/[userId]/posts/[postId]'],
    [routes.users('123').posts(null).index, '/users/123/posts/[postId]'],
    [routes.users('123').settings.index, '/users/123/settings'],
    [routes.users('123').settings.lang, '/users/123/settings/lang'],
  ])('%p', (actual, expected) => expect<string>(actual).toBe(expected))

  // @ts-expect-error: non dynamic route
  void (() => routes.about())
  // @ts-expect-error: non dynamic route
  void (() => routes.users('123').settings())
})
