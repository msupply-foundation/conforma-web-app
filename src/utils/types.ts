export {
  ApplicationPayload,
  SectionPayload,
  TemplatePayload,
  TemplateSectionPayload,
  Response,
  ResponsesByCode,
}

interface ApplicationPayload {
  serialNumber: string
  template: TemplatePayload
}

interface SectionPayload {
  applicationId: number
  templateSections: number[]
}

interface TemplatePayload {
  id: number
  name: string
  code: string
  description: string
  documents: Array<string>
}

interface TemplateSectionPayload {
  id: number
  code: string
  title: string
  elementsCount: number
}

type Response = {
  text: string | null | undefined
  optionIndex?: number
  reference?: any // Not yet decided how to represent
}

interface ResponsesByCode {
  [key: string]: Response | string
}
