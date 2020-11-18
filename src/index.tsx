import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom'
import '../semantic/src/semantic.less'
import config from './config.json'
import cache from './cache'
import { AppWrapper } from './containers/Main'
import { ApolloClient, ApolloProvider, NormalizedCacheObject } from '@apollo/client'
import { persistCache } from 'apollo3-cache-persist'
import { Loading } from './components'

const App: React.FC = () => {
  const [client, setClient] = useState<ApolloClient<NormalizedCacheObject> | undefined>(undefined)
  useEffect(() => {
    const client = new ApolloClient({
      uri: config.serverGraphQL,
      cache,
    })

    persistCache({
      cache,
      storage: window.localStorage,
      /**
       * Storage options.
       */
      // Maximum size of cache to persist (in bytes).
      // Defaults to 1048576 (1 MB). For unlimited cache size, provide false.
      // If exceeded, persistence will pause and app will start up cold on next launch.
      maxSize: false,

      /**
       * Debugging options.
       */
      // Enable console logging.
      // debug: boolean,
    }).then(() => {
      // TODO: Check when this would run!
      client.onResetStore(async () => cache.reset())
      setClient(client)
    })
    return () => {}
  }, [])

  return client ? (
    <ApolloProvider client={client}>
      <AppWrapper />
    </ApolloProvider>
  ) : (
    <Loading />
  )
}

ReactDOM.render(<App />, document.getElementById('root'))
