# Conforma — web application

Front end for Conforma.

Built in a React framework with Typescript, bundled with Vite.

The components style is done using Semantic UI React (SUIR).

Apollo client for data fetching from a GraphQL server [conforma-server](https://github.com/msupply-foundation/conforma-server) running Postgraphile.

### Stack

- React 18
- TypeScript 5
- Vite 5 (build/dev server)
- Apollo Client 3
- Semantic UI React 2 (LESS for theming)

(See `package.json` for exact versions. For an architecture overview and conventions, see [CLAUDE.md](CLAUDE.md).)

## Usage

Requires Node 20 (see `.nvmrc`).

- Install dependencies:

`yarn install`

- Run in development mode:

`yarn dev`

- Bundle for production (`dist/`):

`yarn build`

- Preview the production build:

`yarn preview`

## Development

- `main` branch - only has features which have been released (on a demo-tag)
- `develop` - to be used for development (to create a feature-branch before making a new PR) and selected as base for PRs

The organisation-team will transfer approved changes from `develop` into the `main` periodically once all new features are stable and tested.

## Connecting to server

In development, by default, the app will try to connect to local servers on `http://localhost:8080`, so you'll need to have the [back-end](https://github.com/msupply-foundation/conforma-server) running.

It's possible to connect to a remote/online server by specifying it a local `.env` file (not committed with repo) in the repo root. An example `.env` file might look like:

```
# Angola testing server
# REMOTE_SERVER=https://conforma-demo.msupply.org:50008

# Demo server
REMOTE_SERVER=https://conforma-demo.msupply.org:50000

```

(Only the base url is required -- the full REST and GraphQL server urls will be constructed in `config.ts`)

To disable servers, just comment out the line (with `# `). When they're all disabled, the default `localhost` will be used.