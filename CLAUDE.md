# Conforma web-app — agent & developer guide

The React frontend for Conforma. **React 18 + Vite 5 + TypeScript 5 + Apollo Client 3 + Semantic UI React 2 + React Router 5.** It talks to the [conforma-server](https://github.com/msupply-foundation/conforma-server) backend over **GraphQL** (queries/mutations) and **REST** (uploads, login, prefs, files, snapshots, lookup tables, localisation).

> ⚠️ The [README.md](README.md) historically understated the stack (it once said React 16 / Webpack 4 / TS 4). The versions above (from `package.json`) are correct.

> This is one of two sibling repos; the backend is `conforma-server/`. They share **no TypeScript** — the contracts are the generated GraphQL schema plus the REST endpoint paths in [src/config.ts](src/config.ts). See [../CLAUDE.md](../CLAUDE.md). When the DB schema changes server-side, this app's generated types are stale until you re-run `yarn generate` here (against a running server).

## Nested guides (read these when working in their area)

- [src/formElementPlugins/CLAUDE.md](src/formElementPlugins/CLAUDE.md) — question/element-type plugin system + how to add one
- [src/containers/TemplateBuilder/CLAUDE.md](src/containers/TemplateBuilder/CLAUDE.md) — the admin template editor (the most complex feature)

Long-form docs live in `docs/` (a Zola site; `docs/_wiki` is the wiki submodule) and the [GitHub wiki](https://github.com/msupply-foundation/conforma-web-app/wiki).

## Commands

Run with **yarn** (Node 20 or later — `.nvmrc` has the baseline version).

| Command | What it does |
| --- | --- |
| `yarn dev` | Vite dev server (port **5100**; preview on 5101; proxies API to the backend). |
| `yarn build` | `tsc -b && vite build` → `dist/`. **Type errors fail the build**, so generated types must be current. |
| `yarn lint` | ESLint (flat config, `eslint.config.js`). |
| `yarn generate` | GraphQL codegen → `src/utils/generated/graphql.tsx`. **Requires the server running** at `localhost:8080/graphql`. |
| `yarn preview` | Serve the built `dist/`. |

> **There is no test runner** in this repo (no Jest/Vitest, no `test` script). Verification is manual / via the running app.

## Talking to the server

- **Endpoint URLs** are built by [src/utils/helpers/endpoints/endpointUrlBuilder.ts](src/utils/helpers/endpoints/endpointUrlBuilder.ts) — it returns **absolute, same-origin** URLs (required because the fig-tree evaluator would otherwise mangle relative paths). REST endpoint keys are defined in [src/config.ts](src/config.ts).
- **Which backend**: in dev, Vite proxies `/api` and `/graphql` to `http://localhost:8080` by default, or to `VITE_REMOTE_SERVER` (set in `.env`) rewritten under `/server/*`. See [vite.config.ts](vite.config.ts). Restart Vite after changing `.env`.
- **Auth**: the JWT is stored in `localStorage` (`config.localStorageJWTKey`) and attached as `Authorization: Bearer …` by Apollo's `authLink` ([src/App.tsx](src/App.tsx)). It is **not auto-refreshed** — a fresh JWT comes back from `/user-info`. On an `invalid signature` GraphQL error the app reloads (forces re-login).
- **REST vs GraphQL**: use Apollo (generated hooks) for application/template/review data; use `getRequest`/`postRequest` ([src/utils/helpers/fetchMethods.ts](src/utils/helpers/fetchMethods.ts)) for files, login, prefs, PDFs, lookup tables, localisation.

## GraphQL & codegen

- Query/mutation/fragment documents live in [src/utils/graphql/](src/utils/graphql/) (`queries/`, `mutations/`, `fragments/`) as `gql` templates.
- `yarn generate` produces [src/utils/generated/graphql.tsx](src/utils/generated/graphql.tsx) — a large, **generated** file of types + React Apollo hooks (`useGetApplicationQuery`, etc.). **Never hand-edit it.** Re-run codegen after editing any document or after the server schema changes.
- App-level domain types (e.g. `FullStructure`, `ElementState`) are in [src/utils/types.ts](src/utils/types.ts), built on top of the generated GraphQL types.

## Core concept: the application/review "structure"

The heart of the app. A template plus the user's responses are assembled into a **`FullStructure`** (sections → pages → elements + each element's current response and state), then dynamic bits (labels, visibility, validation, defaults) are evaluated with the **fig-tree evaluator** ([src/FigTreeEvaluator/](src/FigTreeEvaluator/)). Rendering walks that structure and delegates each element to its **form element plugin**.

This pipeline is **cross-cutting**, spanning:
- `src/utils/hooks/useGetApplicationStructure`, `useLoadApplication`, `useLoadTemplate` — build/refresh the structure.
- `src/utils/helpers/structure/` — assemble sections, add responses, compute progress/accessibility.
- `src/components/PageElements/` — choose the right renderer per context (applicant fill / review / summary / history).
- `src/formElementPlugins/` — the per-type input & summary components (see its nested guide).

Understanding `FullStructure` + `useGetApplicationStructure` + the fig-tree evaluation step unlocks most of the codebase.

## Codebase map

```
src/
  main.tsx, App.tsx     Bootstrap: SystemPrefs → Apollo client + cache persist → Router → providers
  config.ts             REST endpoint map, localStorage keys, debounce timing
  cache.ts              Apollo InMemoryCache type policies (e.g. Application keyed by `serial`)
  contexts/             Global state (see below)
  containers/           Page-level features:
                          Application/   applicant form-filling flow
                          Review/        reviewer & consolidation flow (tabbed)
                          TemplateBuilder/  admin template editor   → nested CLAUDE.md
                          List/          applications dashboard (filter/sort/paginate)
                          DataDisplay/   configurable data views
                          User/          login, verification, profile
                          Main/          AppWrapper → AuthenticatedWrapper → SiteLayout, routing
                          Dev/           dev-only tools
  components/           Shared UI: PageElements/, Application/, Review/, Sections/, List/, Admin/, common/
  formElementPlugins/   Question/element type plugins                → nested CLAUDE.md
  FigTreeEvaluator/     Front-end fig-tree singleton + custom functions
  LookupTable/          Lookup-table UI (list/view, CSV import)
  utils/
    graphql/            gql query/mutation/fragment documents
    generated/          codegen output (do NOT edit)
    hooks/              ~36 domain hooks (data fetching, mutations, routing, UI)
    helpers/            endpoints/, structure/, application/, list/, fetchMethods, evaluateElements
    types.ts            app-level domain types over the generated GraphQL types
    data/               constants (columns per role, date formats, style constants)
```

### Contexts ([src/contexts/](src/contexts/))

`SystemPrefs` (prefs, languages, maintenance mode, custom CSS — fetched first, wraps everything) · `UserState` (current user, permissions, orgs, inactivity logout) · `Localisation` (language + translation strings; `t()` / `tFormat()`) · `Toast` · `ViewportState` (responsive/mobile) · `FormElementUpdateTrackerState` (blocks navigation while elements re-evaluate/save) · `ReviewStructuresState` (caches loaded review structures).

## Conventions

- **Prettier**: no semicolons, single quotes, 2-space, 100-col (`.prettierrc`).
- **Data fetching via custom hooks**, not raw queries in components (e.g. `useLoadApplication`, `useListApplications`). Follow the existing hook pattern.
- **Routing**: React Router 5 with `useRouter` ([src/utils/hooks/useRouter.tsx](src/utils/hooks/useRouter.tsx)) for location/query/navigate. Deep links like `/application/:serial/:sectionCode/:page`.
- Branch off `develop` → PR back into `develop`; `main` is released features only. Commit/push only when asked.

## Gotchas

- **No tests** — there is no test tooling; don't suggest `yarn test`.
- **Apollo cache persists to localStorage with a 3 MB cap** ([src/App.tsx](src/App.tsx)). Beyond that, persistence pauses and the app starts "cold" — large applications can hit this.
- **JWT isn't auto-refreshed** (refreshed via `/user-info`); expired tokens trigger a reload-to-login.
- **`yarn build` runs `tsc`** — stale generated types or schema drift will break the build, not just lint.
- **A form element plugin's `code` must match the server's `template_element` plugin code**, or the element won't render. See [src/formElementPlugins/CLAUDE.md](src/formElementPlugins/CLAUDE.md).
- Endpoint URLs are deliberately **absolute & same-origin** (fig-tree URL-joining quirk) — don't "simplify" them to relative paths.
