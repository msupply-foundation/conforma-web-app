import { TemplateElement, TemplateElementCategory } from './generated/graphql'

import { IQueryNode } from '@openmsupply/expression-evaluator/lib/types'

export {
  ApplicationDetails,
  ApplicationElementStates,
  AppStatus,
  AssignmentDetails,
  ElementPluginParameterValue,
  ElementPluginParameters,
  ElementState,
  EvaluatorParameters,
  FullUserPermissions,
  IGraphQLConnection,
  LooseString,
  PageElementsStatuses,
  ProgressInApplication,
  ProgressInSection,
  ProgressInPage,
  ProgressStatus,
  ResponseFull,
  ResponsePayload,
  ResponsesByCode,
  ReviewDecision,
  ReviewDetails,
  ReviewQuestion,
  ReviewQuestionDecision,
  SectionElementStates,
  SectionDetails,
  TemplateTypePayload,
  TemplateSectionPayload,
  TemplateElementState,
  TemplatePermissions,
  ValidationMode,
  ValidateFunction,
  ValidateObject,
}

interface ApplicationDetails {
  id: number
  type: string
  serial: string
  name: string
  stageId: number
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

interface AssignmentDetails {
  id: number
  review?: ReviewDetails
  questions: ReviewQuestion[]
}

type ElementPluginParameterValue = string | number | string[] | IQueryNode

interface ElementPluginParameters {
  [key: string]: ElementPluginParameterValue
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

interface IGraphQLConnection {
  fetch: Function
  endpoint: string
}

interface EvaluatorParameters {
  objects?: object[]
  pgConnection?: any // Any, because not likely to be used in front-end
  graphQLConnection?: IGraphQLConnection
  APIfetch?: Function
}

interface FullUserPermissions {
  username: string
  templatePermissions: TemplatePermissions
  JWT: string
}

type LooseString = string | null | undefined

interface PageElementsStatuses {
  [code: string]: ProgressStatus
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
  pages: ProgressInPage[]
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

interface ResponsesByCode {
  [key: string]: ResponseFull | null
}

type ReviewDecision = 'Approve' | 'Reject'

interface ReviewDetails {
  id: number
  status: string
}

interface ReviewQuestion {
  code: string
  responseId: number
  sectionIndex: number
}
interface ReviewQuestionDecision {
  comment: string
  decision: ReviewDecision | undefined
}

interface SectionElementStates {
  section: SectionDetails
  pages: {
    [pageName: string]: {
      element: ElementState
      response: ResponseFull | null
      review?: ReviewQuestionDecision
    }[]
  }
}

interface SectionDetails {
  title: string
  code: string
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

interface ValidateFunction {
  (
    validationExpress: IQueryNode,
    validationMessage: string,
    evaluatorParameters: EvaluatorParameters
  ): any
}

interface ValidateObject {
  validate: ValidateFunction
}

type ValidationMode = 'STRICT' | 'LOOSE'
