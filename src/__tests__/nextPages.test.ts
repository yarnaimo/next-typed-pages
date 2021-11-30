import { $route, nextPages } from '..'
import { isSubpathOf } from '..'
import { $index } from '../symbols'

const pages = nextPages({
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

describe(nextPages.name, () => {
  test.each([
    [pages[$index], ''],
    [pages.index, '/'],
    [pages.about, '/about'],
    [pages.users[$index], '/users'],
    [pages.users.index, '/users'],
    [pages.users(null)[$index], '/users/[userId]'],
    [pages.users(null).index, '/users/[userId]'],
    [pages.users('123')[$index], '/users/123'],
    [pages.users('123').index, '/users/123'],
    [pages.users('123').posts('456').index, '/users/123/posts/456'],
    [pages.users(null).posts(null)[$index], '/users/[userId]/posts/[postId]'],
    [pages.users(null).posts(null).index, '/users/[userId]/posts/[postId]'],
    [pages.users('123').posts(null).index, '/users/123/posts/[postId]'],
    [pages.users('123').settings.index, '/users/123/settings'],
    [pages.users('123').settings.lang, '/users/123/settings/lang'],
  ])('%p', (actual, expected) => expect<string>(actual).toBe(expected))

  // @ts-expect-error: non dynamic route
  void (() => pages.about())
  // @ts-expect-error: non dynamic route
  void (() => pages.users('123').settings())
})

describe('isSubpathOf', () => {
  test.each([
    ['/users', pages.users, true],
    ['/users/[userId]', pages.users, true],
    ['/users/[userId]/posts', pages.users, true],
    ['/users2/test', pages.users, false],
    ['/users', pages.users2, false],
    ['/about', pages.users, false],
  ])('%p', (pathname, routeOptions, expected) =>
    expect(isSubpathOf(pathname, routeOptions)).toBe(expected),
  )
})
