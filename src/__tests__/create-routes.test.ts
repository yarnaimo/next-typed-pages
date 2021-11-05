import { $route, createRoutes } from '..'
import { isSubpathOf } from '..'
import { $index } from '../symbols'

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
  users2: {
    test: $route,
  },
})

describe('createRoutes', () => {
  test.each([
    [routes[$index], ''],
    [routes.index, '/'],
    [routes.about, '/about'],
    [routes.users[$index], '/users'],
    [routes.users.index, '/users'],
    [routes.users(null)[$index], '/users/[userId]'],
    [routes.users(null).index, '/users/[userId]'],
    [routes.users('123')[$index], '/users/123'],
    [routes.users('123').index, '/users/123'],
    [routes.users('123').posts('456').index, '/users/123/posts/456'],
    [routes.users(null).posts(null)[$index], '/users/[userId]/posts/[postId]'],
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

describe('isSubpathOf', () => {
  test.each([
    ['/users', routes.users, true],
    ['/users/[userId]', routes.users, true],
    ['/users/[userId]/posts', routes.users, true],
    ['/users2/test', routes.users, false],
    ['/users', routes.users2, false],
    ['/about', routes.users, false],
  ])('%p', (pathname, routeOptions, expected) =>
    expect(isSubpathOf(pathname, routeOptions)).toBe(expected),
  )
})
