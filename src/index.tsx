import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import '../semantic/src/semantic.less'; // if you do this once in your entry point file, you don't have to do it again in other files.

import { ApolloClient, 
        InMemoryCache,
        NormalizedCacheObject,
        ApolloProvider
         } from '@apollo/client'; 
    
const client: ApolloClient<NormalizedCacheObject> = new ApolloClient({ 
    uri: 'http://localhost:4000/graphql', 
    cache: new InMemoryCache() 
});

ReactDOM.render(
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>,
    document.getElementById('root')
);