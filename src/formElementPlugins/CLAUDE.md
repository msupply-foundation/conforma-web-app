# formElementPlugins/ — question / element type plugins

Each subfolder is a **form element plugin**: the front-end implementation of one question/element type (`shortText`, `dropdownChoice`, `checkbox`, `fileUpload`, `datePicker`, `radioChoice`, `number`, `listBuilder`, `search`, `textInfo`, `imageDisplay`, `jsonEdit`, `password`, `longText`, plus internal ones like `getValues`/`previewAction`). A plugin's `code` must match the `pluginCode` stored on the server's `template_element` rows, or the element won't render. (Repo overview: [../../CLAUDE.md](../../CLAUDE.md).)

> **No separate install.** The old README step `cd src/formElementPlugins && yarn install` is obsolete — there's no `package.json` here. Plugins are plain TSX compiled by the main Vite build; just `yarn install` at the repo root.

## Anatomy

```
<pluginCode>/
  pluginConfig.json     metadata (required)
  localisation.json     plugin-specific strings (optional)
  config.json           plugin-specific settings, e.g. fileUpload (optional)
  src/
    ApplicationView.tsx  the editable input shown to applicants (required)
    SummaryView.tsx      read-only display for summary/review (required)
    TemplateView.tsx     view used inside the Template Builder (optional; present on some plugins)
```

**`pluginConfig.json`** (see `shortText/pluginConfig.json`):
- `code` — unique id, must match the server element type.
- `displayName` — label in the Template Builder.
- `category` — `"Input"` (collects a response) or `"Informative"` (display only).
- `parameterLoadingValues` — fallback values shown while fig-tree parameters evaluate (e.g. `"label": "Loading..."`).
- `internalParameters` — *(optional)* parameter keys that are **never** re-evaluated by fig-tree (static config). Not every plugin declares it — `shortText`, for example, doesn't.
- `isCore` — bundled plugin flag (all current ones are core).

## Registration

Plugins are registered in **[pluginProvider.tsx](pluginProvider.tsx)** — a `Record<code, PluginComponents>` mapping each `code` to its `config`, `localisation`, and **lazily-imported** `ApplicationView`/`SummaryView`:

```ts
shortText: {
  localisation: {},
  config: shortTextConfig as PluginConfig,
  ApplicationView: React.lazy(() => import('./shortText/src/ApplicationView')),
  SummaryView: React.lazy(() => import('./shortText/src/SummaryView')),
},
```

## The wrappers (shared plumbing)

Plugins don't talk to Apollo or fig-tree directly — the wrappers do:

- **[ApplicationViewWrapper.tsx](ApplicationViewWrapper.tsx)** wraps every `ApplicationView`. It splits static vs. fig-tree `parameters` and evaluates the dynamic ones, runs validation ([defaultValidate.tsx](defaultValidate.tsx), using the element's `validationExpression`), applies defaults ([useDefault.ts](useDefault.ts)), persists responses (GraphQL update), and reports focus/processing state to `FormElementUpdateTrackerState`.
- **[SummaryViewWrapper.tsx](SummaryViewWrapper.tsx)** wraps `SummaryView` for read-only display, using the `evaluatedParameters` **frozen at submission time** (unless `showLiveParameters`).
- [types.ts](types.ts) defines `ApplicationViewProps`, `SummaryViewProps`, `PluginConfig`, and the `ResponseFull` shape.

A plugin's `ApplicationView` receives evaluated `parameters`, the current/`allResponses`, `applicationData`, a `Markdown` renderer, `validationState`, and callbacks `onUpdate(value)` (validates live) and `onSave(ResponseFull)` (persists). The **`ResponseFull` shape varies per plugin** (e.g. `optionIndex`/`selection` for dropdown, `values` for checkbox, `files` for fileUpload, `date` for datePicker).

## Add a new plugin

1. Create `src/formElementPlugins/<code>/` with `pluginConfig.json` and `src/ApplicationView.tsx` + `src/SummaryView.tsx` (model them on an existing plugin like `shortText` or `dropdownChoice`).
2. Add `localisation.json` if it needs strings.
3. Register it in [pluginProvider.tsx](pluginProvider.tsx) (import config/localisation + add the `React.lazy` entry).
4. Ensure the same `code` exists as a server element type so templates can use it.

## Gotchas

- **`code` mismatch with the server = blank element.** Keep them aligned.
- `internalParameters` are not re-evaluated when responses change.
- Plugins are `React.lazy` + Suspense — a broken import shows a stuck "Loading Plugin" / triggers the [ErrorBoundary.tsx](ErrorBoundary.tsx).
- Summary/review shows parameters as they were **at submission**, not live — by design, so reviewers see what the applicant saw.
