import { ApplicationResponse, TemplateElement, TemplateElementCategory } from './generated/graphql'

export {
  ElementAndResponse,
  SectionPages,
  SectionElements,
  ResponsePayload,
  SectionPayload,
  TemplateTypePayload,
  TemplateSectionPayload,
  Response,
  ResponsesByCode,
  ApplicationElementState,
}

interface ElementAndResponse {
  question: TemplateElement
  response: ApplicationResponse | null
}

interface SectionPages {
  [page: number]: Array<ElementAndResponse>
}

interface SectionElements {
  [id: number]: Array<ElementAndResponse>
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
  [key: string]: Response
  // [key: string]: {
  //   category: TemplateElementCategory
  //   isRequired: boolean
  //   isVisible: boolean
  //   isValid: any
  //   validationMessage: string | null
  //   responseId: number
  //   responseJSON: Response
  //   responseValue: string | number
  //   isEditable: boolean
  // }
}

interface ApplicationElementState {
  [key: string]: {
    category: TemplateElementCategory
    isRequired: boolean
    isVisible: boolean
    isValid: any
    validationMessage: string | null
    isEditable: boolean
    responseId: number
  }
}
