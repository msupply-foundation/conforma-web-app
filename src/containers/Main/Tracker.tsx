/*
Tracking component for Google Analytics. Requires an analytics id and siteHost
to be specified in the server's preferences.json file.

The siteHost much match the url domain -- this is so we only enable tracking on
the live hosted site, not demos or local dev environment.
*/

import { useEffect } from 'react'
import ReactGA from 'react-ga4'
import { useRouter } from '../../utils/hooks/useRouter'
import { usePrefs } from '../../contexts/SystemPrefs'

// Set to true to enable tracking in dev mode
export const trackerTestMode = false

export const Tracker = () => {
  const { location } = useRouter()
  const { preferences } = usePrefs()
  const { hostname } = window.location

  const hostMatch = trackerTestMode || hostname === preferences?.siteHost

  useEffect(() => {
    if (preferences?.googleAnalyticsId && hostMatch) {
      ReactGA.send({ hitType: 'pageview', page: location.pathname + location.search })

      if (trackerTestMode) {
        console.log(location.pathname + location.search)
      }
    }
  }, [location])

  return null
}
