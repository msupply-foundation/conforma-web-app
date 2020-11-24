import { ApplicationResponse, TemplateElement, TemplateElementCategory } from './generated/graphql'

import { BasicObject, IQueryNode } from '@openmsupply/expression-evaluator/lib/types'

export {
  ApplicationDetails,
  ApplicationElementStates,
  AppStatus,
  ElementAndResponse,
  ElementState,
  ResponsePayload,
  SectionPages,
  SectionElements,
  SectionElementStates,
  SectionPayload,
  TemplateTypePayload,
  TemplateSectionPayload,
  ProgressInApplication,
  ProgressInSection,
  ProgressInPage,
  ProgressStatus,
  ReviewCode,
  ResponseFull,
  ResponsesFullByCode,
  ResponsesByCode,
  TemplateElementState,
  TemplatePermissions,
  FullUserPermissions,
}

interface TemplatePermissions {
  [index: string]: {
    [index: string]: Array<'Apply' | 'Review' | 'Assign'>
  }
}

interface FullUserPermissions {
  username: string
  templatePermissions: TemplatePermissions
  JWT: string
}

interface ApplicationDetails {
  id: number
  type: string
  serial: string
  name: string
  stage: string
  status: string
  outcome: string
  isLinear: boolean
}

interface ApplicationElementStates {
  [key: string]: ElementState
}

interface AppStatus {
  stage: string
  status: string
  outcome: string
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

interface ProgressInPage {
  pageName: string
  status: ProgressStatus
  canNavigate: boolean
  isActive: boolean
}

interface ProgressInSection {
  code: string | ReviewCode
  title: string
  status?: ProgressStatus
  canNavigate: boolean
  isActive: boolean
  pages?: ProgressInPage[]
}

type ProgressInApplication = ProgressInSection[]

type ProgressStatus = 'VALID' | 'NOT_VALID' | 'INCOMPLETE'

type ReviewCode = 'PR'

interface ResponseFull {
  text: string | null | undefined
  optionIndex?: number
  reference?: any // Not yet decided how to represent
  isValid: boolean | null
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
  section: number // Index
  category: TemplateElementCategory
  parameters: any
}

interface TemplateElementState extends ElementBase {
  isRequired: IQueryNode
  visibilityCondition: IQueryNode
  isEditable: IQueryNode
  // isValid: boolean | null
}

interface ElementState extends ElementBase {
  isEditable: boolean
  isRequired: boolean
  isVisible: boolean
}
