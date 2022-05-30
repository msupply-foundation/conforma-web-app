# Localisation Management

A UI to export/import and enable/disable languages is available at: `/admin/localisations`:

## Localisation UI (external users)

![Localisation](images/localisation-ui.png)

It is recommended to use a Google sheet (or Excel spreadsheet) to manage the available languages and keep them up-to-date with the current application strings. Currently we have been using this (private) Google spreasheet to keep the localisation used per project: [Localisation Spreadsheet](https://docs.google.com/spreadsheets/d/1RE80Rqm5_TI3k1ibm9C5gEyGjk9l91Od4244D6gZqCw)

Workflow for exporting and importing could be as follows:

### For initial setup:

- Export a CSV of languages using the app
- In Google Sheets, select "Import" from the "File" menu
- Select the "Upload" tab and drag the CSV file in
- In the import dialog that appears:
  - Select "Create new spreadsheet"
  - **UN-check** "Convert text to numbers, dates, and formulas"
  - Click "Import data", then click "Open now"

![Import dialog](/images/google-sheet-import-dialog-new.png)

- Once the sheet has loaded, make it look useable:
  - Give it a sensible name
  - Set column widths to appropriate amounts
  - Freeze the 5 header rows (and make the top row **bold**)
  - Select all, then "Format" -> "Wrapping" -> "Wrap

### For subsequent updates:

- Export as CSV from page
- In your existing Google Sheet, "Import" CSV:
  - Select "Replace current sheet" for "import location"
  - **UN-check** "Convert text to numbers, dates, and formulas"
- Import and data will be update. Browse, edit accordingly
- Export by "File -> Download -> CSV"
- Re-import using UI!

![Import dialog](/images/google-sheet-import-dialog.png)

## Localisation development

To access localised strings,  just import the `useLanguageProvider` hook from `contexts/Localisation`. Note that you  need to be inside a React component or React hook to be able to use the localisations hook. For localised enums (defined in the Database) import the `utils/hooks/useLocalisedEnums` hook.

### How localisation works?

The app comes with a base`defaultLanguageStrings.ts` file which defines all the localisation keys and the base English strings to be used. These are also used as fallbacks if the currently active language is missing some translations.

Defining other languages is usually done by exporting the existing languages and reimporting with the new language's strings (as explained above in **Localisation UI (external users)**). The localisation files are stored in the folder in the server: `./localisation`. They are also exported and imported with [Snapshots](https://github.com/openmsupply/conforma-server/wiki/Snapshots)

### Localisations directory

 Contains one languages configuration file `languages.json` and each language folders each containing one file `strings.json` with a map of strings (key) and localised text. The configuration file is easy to follow, and relates to the other language folder in the same directory:
 ```
 [
  {
    "languageName": "English",
    "description": "NZ English",
    "code": "en_nz",
    "flag": "🇳🇿",
    "enabled": true
  },
  {
    "languageName": "Portugese",
    "description": "Portugese translations",
    "code": "pt_br",
    "flag": "🇧🇷",
    "enabled": false
  },
  {
    "languageName": "English",
    "description": "Certain string replacements for DTAC scholarship",
    "code": "en_dtac",
    "flag": "🇦🇺",
    "enabled": true
  }
]
 ```

 The configuration file bascially has which languages are selectable by the user (`enabled` option), which how it displays to be user for selecion. In case only one language is available, the user don't the 'Language selection' option on the UI. In other cases it will display as the following:

![Language selecion dropdown](/images/localisation-selection-dropdown.png)

![Language selecion dialog](/images/localisation-selection-dialog.png)