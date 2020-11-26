import { TemplateElement, TemplateElementCategory } from './generated/graphql'

import { IQueryNode } from '@openmsupply/expression-evaluator/lib/types'

export {
  ApplicationDetails,
  ApplicationElementStates,
  AppStatus,
  ElementState,
  ElementAndResponse,
  ResponsePayload,
  TemplateTypePayload,
  TemplateSectionPayload,
  ProgressInApplication,
  ProgressInSection,
  ProgressInPage,
  ProgressStatus,
  ResponseFull,
  ResponsesFullByCode,
  ResponsesByCode,
  SectionElements,
  SectionPagesElements,
  TemplateElementState,
  TemplatePermissions,
  FullUserPermissions,
  ValidationMode,
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

interface ElementBase {
  id: number
  code: string
  title: string
  elementTypePluginCode: string
  section: SectionDetails
  category: TemplateElementCategory
  parameters: any
}
interface ElementState extends ElementBase {
  isEditable: boolean
  isRequired: boolean
  isVisible: boolean
}

interface ElementAndResponse {
  element: ElementState,
  response: ResponseFull
}

interface ResponsePayload {
  applicationId: number
  templateQuestions: TemplateElement[]
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
  isValid: boolean
  // value: {
  //   text: string | null | undefined
  //   optionIndex?: number
  //   reference?: any // Not yet decided how to represent
  // }
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

interface SectionDetails {
  index: number
  page: number
}

interface SectionElements {
  index: number
  title: string
  pages: SectionPagesElements
}

interface SectionPagesElements {
  [page: number]: ElementAndResponse[]
}

interface TemplateElementState extends ElementBase {
  isRequired: IQueryNode
  visibilityCondition: IQueryNode
  isEditable: IQueryNode
}

type ValidationMode = 'STRICT' | 'LOOSE'
