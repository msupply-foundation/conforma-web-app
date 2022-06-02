# Conforma — web application

Front end for Conforma. 

Built in a React framework with Typescript.

The components style is done using Semantic UI React (SUIR). 

Apollo client for data fetching from a GraphQL server [conforma-server](https://github.com/openmsupply/conforma-server) running Postgraphile.

### React
16.13.1
### Typescript
4.0.2
### Webpack 4
4.44.1
### Apollo client 3
3.1.4
### Semantic UI React
1.2.1
### LESS
3.12.2

## Usage

* Install dependencies (Using node >=v13.8.0):

`yarn install`

`cd src/formElementPlugins/ && yarn install`

* Run on development mode:

`yarn dev`

* Bundle for production:

`yarn build`

* Serve bundled App:

`yarn serve`

## Development

* `main` branch - only has features which have been released (on a demo-tag)
* `develop` - to be used for development (to create a feature-branch before making a new PR) and selected as base for PRs

The organisation-team will transfer approved changes from `develop` into the `main` periodically once all new features are stable and tested.
