import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { hot } from 'react-hot-loader'
import ReactGA from 'react-ga4'
import Login from '../User/Login'
import Verify from '../User/Verification'
import { UserProvider, useUserState } from '../../contexts/UserState'
import { useLanguageProvider } from '../../contexts/Localisation'
import NonRegisteredLogin from '../User/NonRegisteredLogin'
import AuthenticatedContent from './AuthenticatedWrapper'
import { Loading } from '../../components'
import { usePrefs } from '../../contexts/SystemPrefs'
import { trackerTestMode } from './Tracker'
import { ViewportStateProvider } from '../../contexts/ViewportState'
import { ServerStatusListener } from './WebsocketListener'

const AppWrapper: React.FC = () => {
  const { error, loading } = useLanguageProvider()
  const { preferences } = usePrefs()

  if (error) {
    console.error(error)
    return <p>Can't load language provider. {error.message}</p>
  }

  if (loading) {
    return <Loading />
  }

  // Register Google Analytics tracker if a tracking ID and host are specified
  // in prefs.
  const hostMatch = trackerTestMode || window.location.hostname === preferences?.siteHost
  if (preferences?.googleAnalyticsId && hostMatch) {
    ReactGA.initialize([
      {
        trackingId: preferences.googleAnalyticsId,
      },
    ])
  }

  return (
    <Router>
      <ViewportStateProvider>
        <UserProvider>
          <ServerStatusListener>
            <Switch>
              <Route exact path="/login">
                <Login />
              </Route>
              <Route exact path="/register">
                <NonRegisteredLogin option="register" />
              </Route>
              <Route exact path="/reset-password">
                <NonRegisteredLogin option="reset-password" />
              </Route>
              <Route exact path="/verify">
                <Verify />
              </Route>
              <Route exact path="/logout">
                <Logout />
              </Route>
              <Route>
                <AuthenticatedContent />
              </Route>
            </Switch>
          </ServerStatusListener>
        </UserProvider>
      </ViewportStateProvider>
    </Router>
  )
}

declare const module: any
export default hot(module)(AppWrapper)

const Logout: React.FC = () => {
  const { logout } = useUserState()
  logout()
  return null
}
