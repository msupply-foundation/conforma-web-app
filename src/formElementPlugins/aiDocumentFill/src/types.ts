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

// A plain value: string for text and single choices, number, ISO date
// (YYYY-MM-DD), or the labels of the chosen options for multiple choice
export type ExtractionValue = string | number | string[]

export interface ExtractionAnswer {
  value: ExtractionValue
  confidence: number // 0-1
  evidence: string // short quote or location from the document
}

export interface ExtractionResult {
  // Keyed by element code; only questions the documents answer
  answers: Record<string, ExtractionAnswer>
  // Codes of elements the server didn't ask about
  skipped: string[]
  usage: { model: string; inputTokens: number; outputTokens: number; durationMs: number }
}
