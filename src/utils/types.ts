import { TemplateElement } from './generated/graphql'

export {
  ResponsePayload,
  SectionPayload,
  Sections,
  SectionPages,
  SectionPageDetails,
  TemplateTypePayload,
  TemplateSectionPayload,
  Response,
  ResponsesByCode,
}

interface ResponsePayload {
  applicationId: number
  templateQuestions: TemplateElement[]
}

interface SectionPayload {
  applicationId: number
  templateSections: (number | null)[]
}

type Sections = TemplateSectionPayload[]
interface SectionPages {
  [code: string]: SectionPageDetails
}

interface SectionPageDetails {
  id: number
  code: string
  title: string
  index: number
  startPage: number
  totalPages: number
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
  pagesCount: number
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
