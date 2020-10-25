import { ApplicationResponse, TemplateElement } from './generated/graphql'

export {
  ElementAndResponse,
  SectionPages,
  ResponsePayload,
  SectionPayload,
  TemplateTypePayload,
  TemplateSectionPayload,
  Response,
  ResponsesByCode,
}

interface ElementAndResponse {
  question: TemplateElement
  response: ApplicationResponse | null
}

interface SectionPages {
  [page: number]: Array<ElementAndResponse>
}

interface ResponsePayload {
  applicationId: number
  templateQuestions: TemplateElement[]
}

interface SectionPayload {
  applicationId: number
  templateSections: (number | null)[]
}

interface TemplateTypePayload {
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
  index: number
  totalPages: number
}

type Response = {
  text: string | null | undefined
  optionIndex?: number
  reference?: any // Not yet decided how to represent
}

interface ResponsesByCode {
  [key: string]: Response | string
}
