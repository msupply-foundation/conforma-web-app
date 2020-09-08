import React from 'react'
import ReactDOM from 'react-dom'
import App from './components/App'
import * as config from '../config.json'
import '../semantic/src/semantic.less'

import { ApolloClient, 
        InMemoryCache,
        NormalizedCacheObject,
        ApolloProvider
         } from '@apollo/client'; 
    
const client: ApolloClient<NormalizedCacheObject> = new ApolloClient({ 
    uri: config.server, 
    cache: new InMemoryCache() 
});

ReactDOM.render(
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>,
    document.getElementById('root')
);