import { useParams, useLocation, useHistory, useRouteMatch } from 'react-router-dom'
import queryString from 'query-string'
import { useMemo } from 'react'

interface QueryObject {
  mode?: string
  type?: string
  serialNumber?: string
  sectionCode?: string
  page?: string
  templateId?: string
  step?: string
  notificationId?: string
  productId?: string
  orgName?: string
}

interface RouterResult {
  pathname: string
  push: (path: string) => void
  query: QueryObject
  replace: (path: string) => void
}

export function useRouter(): RouterResult {
  const params = useParams()
  const location = useLocation()
  const history = useHistory()
  const match = useRouteMatch()

  // Return our custom router object

  // Memoize so that a new object is only returned if something changes

  return useMemo(() => {
    return {
      // For convenience add push(), replace(), pathname at top level

      push: history.push,

      replace: history.replace,

      pathname: location.pathname,

      // Merge params and parsed query string into single "query" object

      // so that they can be used interchangeably.

      // Example: /:topic?sort=popular -> { topic: "react", sort: "popular" }

      query: {
        ...queryString.parse(location.search), // Convert string to object

        ...params,
      },

      // Include match, location, history objects so we have

      // access to extra React Router functionality if needed.

      params,

      match,

      location,

      history,
    }
  }, [params, match, location, history])
}
