import { ApplicationResponse, TemplateElement, TemplateElementCategory } from './generated/graphql'

import { IQueryNode } from '@openmsupply/expression-evaluator/lib/types'

export {
  ApplicationDetails,
  ApplicationElementStates,
  ElementAndResponse,
  ElementState,
  ResponsePayload,
  SectionPages,
  SectionElements,
  SectionElementStates,
  SectionPayload,
  TemplateTypePayload,
  TemplateSectionPayload,
  ResponseFull,
  ResponsesFullByCode,
  ResponsesByCode,
  TemplateElementState,
}

interface ApplicationDetails {
  type: string
  serial: string
  name: string
  stage: string
  status: string
  outcome: string
}

interface ApplicationElementStates {
  [key: string]: ElementState
}

interface ElementAndResponse {
  question: TemplateElement
  response: ApplicationResponse | null
}

interface ResponsePayload {
  applicationId: number
  templateQuestions: TemplateElement[]
}

interface SectionPages {
  [page: number]: Array<ElementAndResponse>
}

interface SectionElements {
  [id: number]: Array<ElementAndResponse>
}

interface SectionElementStates {
  section: TemplateSectionPayload
  elements: {
    element: ElementState
    value: ResponseFull | null
  }[]
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

type ResponseFull = {
  text: string | null | undefined
  optionIndex?: number
  reference?: any // Not yet decided how to represent
}

interface ResponsesFullByCode {
  [key: string]: ResponseFull | null
}

interface ResponsesByCode {
  [key: string]: string | null | undefined
}

interface ElementBase {
  id: number
  code: string
  title: string
  elementTypePluginCode: string
  section: number
  category: TemplateElementCategory
}

interface ElementStateEvaluated {
  isEditable: boolean
  isRequired: boolean
  isVisible: boolean
  // isValid: boolean
  // validationMessage: string | null
}

interface ElementStateUnevaluated {
  isRequired: IQueryNode
  visibilityCondition: IQueryNode
  validation: IQueryNode
  validationMessage: string | null
  isEditable: IQueryNode
}

type TemplateElementState = ElementBase & ElementStateUnevaluated
type ElementState = ElementBase & ElementStateEvaluated