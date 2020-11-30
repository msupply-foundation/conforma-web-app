import { ApplicationResponse, TemplateElement, TemplateElementCategory } from './generated/graphql'

import { IQueryNode } from '@openmsupply/expression-evaluator/lib/types'

export {
  ApplicationDetails,
  ApplicationElementStates,
  AppStatus,
  ElementState,
  ElementAndResponse,
  FullUserPermissions,
  LooseString,
  ProgressInApplication,
  ProgressInSection,
  ProgressInPage,
  ProgressStatus,
  ResponseFull,
  ResponsePayload,
  ResponsesFullByCode,
  ResponsesByCode,
  SectionElementStates,
  TemplateTypePayload,
  TemplateSectionPayload,
  TemplateElementState,
  TemplatePermissions,
  ValidationMode,
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
  element: ElementState,
  response: ResponseFull
}

interface ElementBase {
  id: number
  code: string
  title: string
  pluginCode: string
  sectionIndex: number
  elementIndex: number
  page: number
  category: TemplateElementCategory
  parameters: any
}

interface ElementState extends ElementBase {
  isEditable: boolean
  isRequired: boolean
  isVisible: boolean
}

interface FullUserPermissions {
  username: string
  templatePermissions: TemplatePermissions
  JWT: string
}

type LooseString = string | null | undefined

interface ProgressInPage {
  pageName: string
  status: ProgressStatus
  canNavigate: boolean
  isActive: boolean
}

interface ProgressInSection {
  code: string
  title: string
  status?: ProgressStatus
  canNavigate: boolean
  isActive: boolean
  pages?: ProgressInPage[]
}

type ProgressInApplication = ProgressInSection[]

type ProgressStatus = 'VALID' | 'NOT_VALID' | 'INCOMPLETE'

interface ResponseFull {
  id: number
  text: string | null | undefined
  optionIndex?: number
  reference?: any // Not yet decided how to represent
  isValid?: boolean | null
}

interface ResponsePayload {
  applicationId: number
  templateQuestions: TemplateElement[]
}

interface ResponsesFullByCode {
  [key: string]: ResponseFull | null
}

interface ResponsesByCode {
  [key: string]: LooseString
}

interface SectionElementStates {
  sectionTitle: string
  pages: {
    [page: number]: ElementAndResponse[]
  }
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

interface TemplateElementState extends ElementBase {
  isRequired: IQueryNode
  visibilityCondition: IQueryNode
  isEditable: IQueryNode
  // isValid: boolean | null
}

interface TemplatePermissions {
  [index: string]: {
    [index: string]: Array<'Apply' | 'Review' | 'Assign'>
  }
}

type ValidationMode = 'STRICT' | 'LOOSE'
