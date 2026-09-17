# TemplateBuilder/ — the admin template editor

The admin UI for building and editing **templates** (the configurable forms/workflows that drive every application). This is the most complex feature in the web-app: it edits form structure, permissions, actions, data views, and fig-tree expressions (with undo/redo when editing an individual element's config). (Repo overview: [../../../CLAUDE.md](../../../CLAUDE.md). Domain terms: server [Glossary](../../../../conforma-server/documentation/Glossary.md). Wiki: [Template-Builder](https://github.com/msupply-foundation/conforma-web-app/wiki/Template-Builder).)

## Structure

```
TemplateBuilder/
  Templates.tsx          List of all templates (entry point) + useGetTemplates.ts
  template/
    TemplateWrapper.tsx   Single-template editor shell; hosts the tabs
    Form/                 Form structure: Pages → Sections → Elements, + ElementConfig (per-element settings),
                            FromExistingElement (clone), moveStructure.ts (reorder)
    General/              Metadata & shared config: Categories, Messages, Filters, VersionHistory,
                            and sub-editors DataViews/, Files/, Fragments/
    Permissions/          Permission matrix, review levels/stages
    Actions/              Trigger→action configuration (wires up server action plugins)
    ApplicationWrapper.tsx  Live preview / test harness for the template being edited
    helpers.ts
  shared/                 Reusable building blocks (see below)
  templateOperations/     Commit / duplicate / export / import (calls server template routes)
```

## Key shared machinery (`shared/`)

- **`OperationContext.tsx` + `OperationContextHelpers.tsx`** — the spine of the editor. Wraps the GraphQL mutations (update/delete/commit/duplicate/export/import) so most edits go through one place rather than calling Apollo directly, and renders the shared loading/error modal. It does **not** handle undo/redo or confirmations — those are separate (below).
- **`ConfirmationContext.tsx`** — confirm-before-destructive-action modals.
- **Undo/redo is not global.** It's scoped to per-element editing in `template/Form/ElementConfig.tsx` (and `Actions/ActionConfig.tsx`), built on the `useUndo` hook from `@json-edit-react/utils` + the shared `components/common/UndoRedo` control.
- **Typed input components** — `TextIO`, `NumberIO`, `CheckboxIO`, `DropdownIO`, `JsonIO` — the consistent labelled inputs used throughout the builder.
- **`Evaluation.tsx` + `Parameters.tsx` + `useInitialiseMultipleExpressions.ts`** — the fig-tree **expression editors** used wherever a field can be dynamic (labels, visibility, validation, action parameters, data-view columns).

## Template operations (`templateOperations/`)

Commit (version), duplicate (new template or new version), export, and import — these call the server's template-import-export routes (`/api/admin/template/*`). See server [template-import-export](../../../../conforma-server/src/components/template-import-export/) and [Template-Import-Export.md](../../../../conforma-server/documentation/Template-Import-Export.md).

## Gotchas

- **Templates are versioned and lock on commit.** A committed template is read-only; editing means creating a new version/draft. Check `helpers.ts` for lock/version logic before assuming a field is editable.
- **Mutate through `OperationContext`**, not ad-hoc Apollo calls, so mutations and the loading/error modal stay consistent. (Confirmations come from `ConfirmationContext`; element-level undo/redo from `ElementConfig.tsx`.)
- **Expressions are fig-tree objects**, edited via `Evaluation.tsx`/`Parameters.tsx`. The available custom functions must line up with the server's fig-tree config — see [src/FigTreeEvaluator/](../../FigTreeEvaluator/).
- The Actions tab configures server-side **action plugins**; the set of available actions and their parameters comes from the backend's registered plugins ([conforma-server/plugins/](../../../../conforma-server/plugins/CLAUDE.md)).
- Editing a template here changes data the applicant/review **rendering pipeline** reads — the "core concept" section of the [repo guide](../../../CLAUDE.md) explains how that structure is consumed.
