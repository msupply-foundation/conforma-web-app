# Frontend: Typescript and Apollo client

## First remove Javascript transpiling with babel - we will change to use Typescript

### Clean up
* Remove all packages installed for using transpiling from newer version of javascript
`yarn remove @babel/core @babel/plugin-proposal-class-properties @babel/plugin-syntax-dynamic-import @babel/preset-env @babel/preset-react babel-loader`

* Remove config file with Babel presets:
`rm -f .babelrc`

* Open `webpack.common.js` and remove from `module.rules`:
```
      {
         test: /\.(js)$/,
         exclude: /node_modules/,
         use: ['babel-loader']
      },
```

## Now let's start adding Typescript

### Reference
Typescript in webpack tutorial: https://www.smashingmagazine.com/2020/05/typescript-modern-react-projects-webpack-babel/#comments-typescript-modern-react-projects-webpack-babel
Hot loading App tutorial: https://dev.to/cronokirby/react-typescript-parcel-setting-up-hot-module-reloading-4f3f

<!-- * Remove the old router. We will be using another (@reach/router) that works for Typescript:
`yarn remove react-router-dom` -->

* Add Developer dependencies, types and loaders to transpile Typescript using webpack:
`yarn add -D typescript @types/node @types/react @types/react-dom @types/react-router-dom awesome-typescript-loader source-map-loader`

* Add a file `tsconfig.json` for all your Typescript configurations:
`touch tsconfig.js`

* Open the file and copy the following Typescript configuration:
```
{
  "compilerOptions": {
    "jsx": "react",
    "module": "commonjs",
    "noImplicitAny": true,
    "outDir": "./build/",
    "preserveConstEnums": true,
    "removeComments": true,
    "sourceMap": true,
    "target": "es5",
    "esModuleInterop": true
  },
  "include": [
    "src/*"
  ]
}
```

* Rename files in src folder to *.tsx (Typescript files):
`cd src`\
`mv index.js index.tsx`\
`cd components`\
`mv App.js App.tsx`\
`mv Home.js Home.tsx`\
`mv Footer.js Footer.tsx`\
`mv NoMatch.js NoMatch.tsx`\
`mv Form.js Form.tsx`\
`mv NavigationMenu.js NavigationMenu.tsx`\
`cd ../../`

* Open `webpack.common.config` and add some lines to be using Typescript:

**Note**: The comented block for source-map-loader was part of the configuration but is showing warnings on the console about apollo client, so it's commented until this has been fixed. 
```
resolve: {
    extensions: [".js", ".jsx", ".json", ".ts", ".tsx"]
},
(...)
module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        loader: "awesome-typescript-loader",
      },
      // {
      //   enforce: "pre",
      //   test: /\.js$/,
      //   loader: "source-map-loader",
      // },
      (...)
    ]
}
```

* Open `webpack.dev.config` & `webpack.prod.config` to update the entry file with correct extension:
```
  entry: {
    app: `${commonPaths.appEntry}/index.tsx`
  },
```

* The setup to be using Typescript is completed although we need to go into each file to be using Typescript instead of Javascript. We will do this in a momment. But let's do something else first.

## Install Apollo client and Graphql-codegen

`Apollo client` This package will be used for fetching (queries and mutations) from the Graphql server. It has also other cool features such as cache management, subscription for live update, local state management and inbuilt async control for states such as **isLoading** and **error**.
`Graphql-codegen` Used for Typescript to import Types from your GraphQl server

### Reference
Apollo-client tutorial: https://www.apollographql.com/docs/tutorial/client/
Install Graphql-codegen tutorial: https://medium.com/make-it-heady/part-2-building-full-stack-web-app-with-postgraphile-and-react-client-side-1c5085c5a182

* Add dependencies for using Apollo client
`yarn add @apollo/client graphql`

* Install Graphql-codegen packages for importing types from GraphQL:
`yarn add -D @graphql-codegen/cli @graphql-codegen/typescript @graphql-codegen/typescript-operations @graphql-codegen/typescript-react-apollo`

* Setup the Graphql-codegen configuration by running:
`yarn graphql-codegen init`

* This will launch a CLI wizard. Next, we’ll follow the steps in this list:
- The application is built with React.
- The schema is located at http://localhost:5000/graphql
- Set our operations and fragments location to ./src/components/**/*.ts so that it will search all our TypeScript files for query declarations.
- Use the default plugins “TypeScript”, “TypeScript Operations”, “TypeScript React Apollo.”
- Update the generated destination to src/generated/graphql.tsx (.tsx is required by the react-apollo plugin).
- Do not generate an introspection file.
- Use the default codegen.yml file.
- Make our run script called: codegen.

This will create a codegen.yml file in the root.

When we run the new script `yarn codegen` will generate the **Types** to be store in the file `src/generated/graphql.tsx`.

* Open the `codegen.yml` file copy the following:

```
overwrite: true
schema: 'http://localhost:5000/graphql'
generates:
  src/generated/graphql.tsx:
    plugins:
      - 'typescript'
      - 'typescript-operations'
      - 'typescript-react-apollo'
    config:
      withHooks: true
```

* Run the codegen script now to create the file `graphql.tsx`:
`yarn codegen`

* There is something missing on this config since it asks for a missing package at some point:
? Please choose a version of "@graphql-codegen/typescript-react-apollo" from this list: 2.0.6

## Setup Apollo-client and App using Typescript

* Open the `index.tsx` and copy the following:

We are starting the Apollo client connect to a running backend with Graphql using cache management for not fetching the same query twice (we will use subscription later to update the local cached queries). Then passing the client to a provider.

The ApolloProvider component is similar to React’s context provider: it wraps your React app and places the client on the context, which allows you to access it from anywhere in your component tree.

```
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
    uri: 'http://localhost:5000/graphql', 
    cache: new InMemoryCache() 
});

ReactDOM.render(
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>,
    document.getElementById('root')
);
```

* Open `App.tsx` and copy the following code:
```
import React from 'react'
import { Router, Link } from "@reach/router"
import { hot } from 'react-hot-loader/root'
import { Divider, Container, Segment } from 'semantic-ui-react'

import NavigationMenu from './NavigationMenu'
import Footer from './Footer'
import Form from './Form'
import Home from './Home'
import NoMatch from './NoMatch'

const App: React.FC = () => {
    return (
        <Router>
            <div>
                <NavigationMenu
                    onItemClick={(item) => this.onItemClick(item)}
                    items={[
                        ['Home', '/'],
                        ['Form', '/form']
                    ]}
                    headerIcon={'compass outline'}
                />
                <Divider />
                <Segment inverted>
                    <Container fluid>
                        <Home path="/" />
                        <Form path="/form" />
                        <NoMatch default />
                    </Container>
                </Segment>
            </div>
            <Footer />
        </Router>
    )
};
declare const module: any;
export default hot(module)(App)
```
