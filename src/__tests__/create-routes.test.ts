import { $dynamic, $route, createRoutes } from '..'

describe('createRoutes', () => {
  const routes = createRoutes({
    about: $route,
    users: {
      index: $route,
      [$dynamic]: {
        index: $route,
        posts: {
          [$dynamic]: {
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
    [routes.about, '/about'],
    [routes.users.index, '/users'],
    [routes.users('123').index, '/users/123'],
    [routes.users('123').posts('456').index, '/users/123/posts/456'],
    [routes.users('123').settings.index, '/users/123/settings'],
    [routes.users('123').settings.lang, '/users/123/settings/lang'],
  ])('%p', (actual, expected) => expect<string>(actual).toBe(expected))
})
