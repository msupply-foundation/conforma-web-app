// The shapes of the server's /api/ai/extract endpoint. See
// conforma-server/src/components/ai/AI_DOCUMENT_FILL_SPEC.md.

export interface ExtractionElement {
  code: string
  pluginCode: string
  title: string // the element's label, markdown stripped
  helpText?: string
  isRequired: boolean
  options?: string[] // display labels, for choice elements
  multiSelect?: boolean // dropdownChoice
  currentValue?: string | null // the response's `text`
}
