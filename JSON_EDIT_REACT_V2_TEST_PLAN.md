# json-edit-react v2 — Manual Test Plan

> Temporary file for manually testing the json-edit-react v1 → v2 upgrade. Safe to delete.

Every change touches a JSON editor or viewer, so the cross-cutting things to exercise in each are:
**edit a value, add/delete keys, change a value's type, and copy a value/key (a toast should appear).**

## Admin pages

### 1. Admin → Preferences (`AdminPreferences.tsx`)
- Editable preferences editor: delete only allowed at level 1, add only at level 0; "Add preference" key dropdown + default values still populate.
- Enter something schema-invalid → expect the "Invalid entry" error toast and the edit is rejected (exercises the new `{ error }` return).
- Save / Undo / Redo / Search all work.
- The **overrides** panel below is fully read-only (no edit/add/delete).

### 2. Admin → Data View Config (`AdminDataViews.tsx`)
- Both editors (Data View + Column Definitions): add at level 0, delete at level 1; schema-invalid edits rejected with toast.
- Specifically test **changing a `null` value to an Array** — it should become `[]` (not `[null]`) and stay schema-valid (the `value`/`newValue` rename + `{ data }` path).

### 3. Admin → Evaluator Fragments (`EvaluatorFragments.tsx` + `FragmentTester` + `DataContainer`) — highest-touch area
- Fragment **Properties** JSON editor: add/delete by level, schema validation, save.
- **Color picker** on `metadata.backgroundColor` / `textColor` — ⚠️ behavior change: the swatch/picker now appears only when the value is a *valid* color, and entering an invalid color **rejects** the edit (no toast) instead of reverting-with-toast. Confirm picking a color updates the value.
- The custom **name display** node (colored name badge) still renders.
- **"Test with Parameters"** panel: parameters JSON is editable except the root level.
- **Data context** panel (the read-only app-data viewer): toggle "Use backend (Action) data" on/off — both render read-only.
- Also confirm copy-to-clipboard toast still works in the **fig-tree expression editor** here (shared helper, fig-tree itself unchanged).

## Template Builder

### 4. Expression/Evaluation editors (`Evaluation.tsx`)
Appears anywhere a field is dynamic: element **labels, visibility, validation**, **action parameters**, **data-view columns**.
- ⚠️ The **delete** and **edit-key** icons next to a collapsed expression are now Semantic UI icons (red trash / grey pencil) — check they look right and still click (delete / rename key).
- Expand an expression → the read-only **"data"** object panel renders (now `JsonViewer`).

### 5. Permissions tab → Policy info (`PermissionPolicyInfo.tsx`)
- Open the **"Policy Rules"** accordion → row-level rules display as read-only JSON.

### 6. Template Import (`EntitySelectModal.tsx`)
- Import a template that has **conflicting entities** (filters / permissions / data views / categories / files / fragments) → the "Import Template" modal shows incoming-vs-current JSON diffs (read-only `JsonViewer`), and "Show full data / Show differences" toggles work.

## Form element plugins (applicant + review)

### 7. `jsonEdit` element (`ApplicationView` / `SummaryView`)
- On an **application** using a jsonEdit question: editing respects the configured depth limits (`allowEditDepth`/`allowAddDepth`/`allowDeleteDepth`), `preventEditFields`, and the `canChangeType` setting (type change still allowed on `null` values when `canChangeType` is false).
- A non-editable instance is fully locked.
- **Summary/Review** view of that element is read-only.

### 8. `getValues` element (`ApplicationView`)
- Only visible in the **Template Builder preview** (`admin` page type): renders its stored data as a read-only JSON view.

## Priority

- The **Evaluator Fragments page** (#3) covers the most distinct changes in one screen (editor + color picker + tester + read-only viewers + copy toast).
- The **Template Builder expression editors** (#4) are the most widely-reached.
