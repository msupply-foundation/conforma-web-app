import React from 'react'
import ReactDOM from 'react-dom'
import App from './containers/App'
import * as config from './config.json'
import cache from './cache'
import '../semantic/src/semantic.less'

import { ApolloClient, NormalizedCacheObject, ApolloProvider } from '@apollo/client'

const client: ApolloClient<NormalizedCacheObject> = new ApolloClient({
  uri: config.server,
  cache,
})

ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById('root')
)
