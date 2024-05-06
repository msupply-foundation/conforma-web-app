import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { createRoot } from 'react-dom/client'
import '../semantic/src/semantic.less'
import config from './config'
import cache from './cache'
import { AppWrapper } from './containers/Main'
import { ApolloClient, ApolloProvider, createHttpLink, NormalizedCacheObject } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import { LanguageOption, LanguageProvider } from './contexts/Localisation'
import { ToastProvider } from './contexts/Toast/ToastProvider'
import { SystemPrefsProvider } from './contexts/SystemPrefs'
import { usePrefs } from './contexts/SystemPrefs'
// import { persistCache } from 'apollo3-cache-persist'
import { Loading } from './components'
import getServerUrl from './utils/helpers/endpoints/endpointUrlBuilder'
import { AdminLogin } from './containers/User/Login'

// Adds authorisation header with token from local storage (to be used on every
// request) see
// https://www.apollographql.com/docs/react/networking/authentication/#header
const authLink = setContext((_, { headers }) => {
  const JWT = localStorage.getItem(config.localStorageJWTKey)
  return {
    headers: {
      ...headers,
      authorization: JWT ? `Bearer ${JWT}` : '',
    },
  }
})

// Needed to link or 'chain' commands in Apollo Clients (so that headers can be
// added to every apollo request) see
// https://www.apollographql.com/docs/react/networking/authentication/#header
const httpLink = createHttpLink({
  uri: ({ operationName }) => {
    return `${getServerUrl('graphQL')}?dev=${operationName}`
  },
})

// On iPhone, focusing on input fields causes the viewport to auto-zoom in. We
// can prevent this by setting `maximum-scale=1`, but this makes Android devices
// not be able to manually zoom at all, hence we need to conditionally apply it.
// See https://weblog.west-wind.com/posts/2023/Apr/17/Preventing-iOS-Safari-Textbox-Zooming
if (navigator.userAgent.indexOf('iPhone') > -1) {
  document
    .querySelector('[name=viewport]')
    ?.setAttribute('content', 'width=device-width, initial-scale=1, maximum-scale=1')
}

const App: React.FC = () => {
  const [client, setClient] = useState<ApolloClient<NormalizedCacheObject> | undefined>(undefined)
  const { preferences, languageOptions, error, loading, refetchPrefs, maintenanceMode } = usePrefs()

  useEffect(() => {
    const client = new ApolloClient({
      link: authLink.concat(httpLink),
      cache,
    })
    setClient(client)

    // persistCache({
    //   cache,
    //   storage: window.localStorage,
    //   /**
    //    * Storage options.
    //    */
    //   // Maximum size of cache to persist (in bytes).
    //   // Defaults to 1048576 (1 MB). For unlimited cache size, provide false.
    //   // If exceeded, persistence will pause and app will start up cold on next launch.
    //   maxSize: false,

    //   /**
    //    * Debugging options.
    //    */
    //   // Enable console logging.
    //   // debug: boolean,
    // }).then(() => {
    //   // TODO: Check when this would run!
    //   client.onResetStore(async () => cache.reset())
    //   setClient(client)
    // })
    return () => {}
  }, [])

  if (error) {
    console.error(error)
    const redirect = localStorage.getItem('redirectLocation')
    if (redirect) {
      window.location.href = redirect
      return null
    } else return <p>Can't load preferences. {error?.message}</p>
  }

  return client && !loading ? (
    <ApolloProvider client={client}>
      <Router>
        <ToastProvider>
          <LanguageProvider
            languageOptions={languageOptions as LanguageOption[]}
            defaultLanguageCode={preferences?.defaultLanguageCode as string}
            refetchPrefs={refetchPrefs}
          >
            <Switch>
              {maintenanceMode.enabled && (
                <Route exact path="/admin-login">
                  <AdminLogin />
                </Route>
              )}
              <Route>
                <AppWrapper />
              </Route>
            </Switch>
          </LanguageProvider>
        </ToastProvider>
      </Router>
    </ApolloProvider>
  ) : (
    <Loading />
  )
}

const container = document.getElementById('root')
const root = createRoot(container!)

root.render(
  <SystemPrefsProvider>
    <App />
  </SystemPrefsProvider>
)
