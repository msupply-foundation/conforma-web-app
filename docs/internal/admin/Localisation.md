# Localisation Management

A UI to export/import and enable/disable languages is available at: `/admin/localisations`:

![Localisation](images/localisation-ui.png)

It is recommended to use a Google sheet (or Excel spreadsheet) to manage the available languages and keep them up-to-date with the current application strings. Currently we have been using this (private) Google spreasheet to keep the localisation used per project: [Localisation Spreasheet]( https://docs.google.com/spreadsheets/d/1RE80Rqm5_TI3k1ibm9C5gEyGjk9l91Od4244D6gZqCw)

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