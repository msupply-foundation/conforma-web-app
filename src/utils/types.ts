import {
  ApplicationList,
  ApplicationStatus,
  PermissionPolicyType,
  ReviewResponse,
  ReviewResponseDecision,
  ReviewStatus,
  TemplateElement,
  TemplateElementCategory,
} from './generated/graphql'

import { ValidationState } from '../formElementPlugins/types'

import { IQueryNode } from '@openmsupply/expression-evaluator/lib/types'
import { SummaryViewWrapperProps } from '../formElementPlugins/types'
import { APPLICATION_COLUMNS, USER_ROLES } from './data'
import { DateTime } from 'luxon'

export {
  ApplicationDetails,
  ApplicationElementStates,
  ApplicationListRow,
  ApplicationProps,
  ApplicationStage,
  ApplicationStageMap,
  ApplicationStages, // TODO: Remove this
  AssignmentDetails,
  CellProps,
  ColumnDetails,
  ColumnsPerRole,
  ContextApplicationState,
  ContextFormElementUpdateTrackerState,
  ContextListState,
  CurrentPage,
  DecisionAreaState,
  ElementBase,
  ElementBaseNEW,
  ElementsById,
  ElementPluginParameterValue,
  ElementPluginParameters,
  ElementState,
  ElementStateNEW,
  ElementsActivityState,
  EvaluatorParameters,
  FullStructure,
  GroupedReviewResponses,
  IGraphQLConnection,
  LooseString,
  MethodRevalidate,
  MethodToCallProps,
  Page,
  PageElements,
  PageNEW,
  PageElement,
  PageElementsStatuses,
  Progress,
  ProgressStatus,
  ResponseFull,
  ResponsePayload,
  ResponsesByCode,
  ResumeSection,
  ReviewDetails,
  ReviewProgressStatus,
  ReviewProgress,
  ReviewQuestion,
  ReviewQuestionDecision,
  ReviewerResponsesPayload,
  SectionAndPage,
  SectionState,
  SectionDetails,
  SectionProgress,
  SectionsStructure,
  SectionStateNEW,
  SectionsStructureNEW,
  SetStrictSectionPage,
  SortQuery,
  StageAndStatus,
  TemplateDetails,
  TemplateElementState,
  TemplateElementStateNEW,
  TemplatePermissions,
  TemplatesDetails,
  ValidateFunction,
  ValidateObject,
  ValidatedSections,
  ValidityFailure,
  RevalidateResult,
  UseGetApplicationProps,
  User,
  UserRoles,
  OrganisationSimple,
  Organisation,
  LoginPayload,
  BasicStringObject,
}

interface ApplicationDetails {
  id: number
  type: string
  serial: string
  name: string
  outcome: string
  isLinear: boolean
  current?: StageAndStatus // TODO: Change to compulsory after re-strcture is finished
  firstStrictInvalidPage: SectionAndPage | null
  submissionMessage?: string // TODO: Change to compulsory after re-structure is finished
}

interface ApplicationElementStates {
  [key: string]: ElementState
}

interface ApplicationListRow extends ApplicationList {
  isExpanded: boolean
}

interface ApplicationProps {
  structure: FullStructure
  responses?: ResponsesByCode
}

interface ApplicationStage {
  id: number
  name: string
}

interface ApplicationStageMap {
  [key: string]: ApplicationStage
}

interface ApplicationStages {
  stages: StageDetails[]
  submissionMessage: string
}

interface AssignmentDetails {
  id: number
  review?: ReviewDetails
  questions: ReviewQuestion[]
}

interface BasicStringObject {
  [key: string]: string
}

interface CellProps {
  application: ApplicationList
}

interface ColumnDetails {
  headerName: string
  sortName: string
  ColumnComponent: React.FunctionComponent<any>
}

type ColumnsPerRole = {
  [role in USER_ROLES]: Array<APPLICATION_COLUMNS>
}

interface ContextFormElementUpdateTrackerState {
  elementEnteredTimestamp: number
  elementEnteredTextValue: string
  elementUpdatedTimestamp: number
  elementUpdatedTextValue: string
  isLastElementUpdateProcessed: boolean
  wasElementChange: boolean
}

interface ContextApplicationState {
  id: number | null
  serialNumber: string | null
  inputElementsActivity: ElementsActivityState
}

interface ContextListState {
  applications: ApplicationDetails[]
}

interface CurrentPage {
  section: SectionDetails
  page: number
}
interface DecisionAreaState {
  open: boolean
  review: ReviewQuestionDecision | null
  summaryViewProps: SummaryViewWrapperProps | null
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
  sectionCode: string
  elementIndex: number
  page: number
  category: TemplateElementCategory
  validation: IQueryNode
  validationMessage: string | null
  parameters: any
}

interface ElementBaseNEW {
  id: number
  code: string
  title: string
  pluginCode: string
  sectionIndex: number
  sectionCode: string
  elementIndex: number
  page: number
  category: TemplateElementCategory
  validationExpression: IQueryNode
  validationMessage: string | null
  parameters: any
}

interface ElementState extends ElementBase {
  isEditable: boolean
  isRequired: boolean
  isVisible: boolean
}

interface ElementStateNEW extends ElementBaseNEW {
  isEditable: boolean
  isRequired: boolean
  isVisible: boolean
}

interface ElementsActivityState {
  elementEnteredTimestamp: number
  elementLostFocusTimestamp: number
  elementsStateUpdatedTimestamp: number
  areTimestampsInSequence: boolean
}

interface EvaluatorParameters {
  objects?: { [key: string]: any }
  pgConnection?: any // Any, because not likely to be used in front-end
  graphQLConnection?: IGraphQLConnection
  APIfetch?: Function
}

type ElementsById = { [templateElementId: string]: PageElement }

interface FullStructure {
  elementsById?: ElementsById
  lastValidationTimestamp?: number
  info: ApplicationDetails
  sections: SectionsStructureNEW
  stages: StageDetails[]
  responsesByCode?: ResponsesByCode
  firstIncompleteReviewPage?: SectionAndPage
  canSubmitReviewAs?: ReviewResponseDecision | null
  sortedSections?: SectionStateNEW[]
  sortedPages?: PageNEW[]
}

type GroupedReviewResponses = {
  [templateElementId: string]: ReviewResponse[]
}

interface IGraphQLConnection {
  fetch: Function
  endpoint: string
}

type LooseString = string | null | undefined

interface MethodRevalidate {
  (methodToCall: (props: MethodToCallProps) => void): void
}

interface MethodToCallProps {
  firstStrictInvalidPage: SectionAndPage | null
  setStrictSectionPage: SetStrictSectionPage
}

interface Page {
  number: number
  state: PageElements
}

type PageElements = {
  element: ElementState
  response: ResponseFull | null
  review?: ReviewQuestionDecision
}[]

interface PageNEW {
  number: number
  sectionCode: string
  name: string
  progress: Progress
  reviewProgress?: ReviewProgress
  state: PageElement[]
}

type PageElement = {
  element: ElementStateNEW
  response: ResponseFull | null
  thisReviewLatestResponse?: ReviewResponse
  review?: ReviewQuestionDecision
  isAssigned?: boolean
}

interface PageElementsStatuses {
  [code: string]: ProgressStatus
}

interface Progress {
  doneRequired: number
  doneNonRequired: number
  completed: boolean
  totalRequired: number
  totalNonRequired: number
  totalSum: number
  valid: boolean
  firstStrictInvalidPage: number | null
}

type ProgressStatus = 'VALID' | 'NOT_VALID' | 'INCOMPLETE'

interface ResponseFull {
  id: number
  text: string | null | undefined
  optionIndex?: number
  reference?: any // Not yet decided how to represent
  isValid?: boolean | null
  hash?: string
  timeCreated?: Date
  reviewResponse?: ReviewResponse
  customValidation?: ValidationState
}

interface ResponsePayload {
  applicationId: number
  templateQuestions: TemplateElement[]
}
interface ResponsesByCode {
  [key: string]: ResponseFull
}

interface ResumeSection {
  sectionCode: string
  page: number
}

interface ReviewDetails {
  id: number
  status: ReviewStatus
}

interface ReviewerDetails {
  id: number
  firstName: string
  lastName: string
}

type ReviewProgressStatus = 'NOT_COMPLETED' | 'DECLINED' | 'APPROVED'

interface ReviewQuestion {
  code: string
  responseId: number
  sectionIndex: number
}
interface ReviewQuestionDecision {
  id: number
  comment: string
  decision: ReviewResponseDecision | undefined
}

interface ReviewerResponsesPayload {
  userId: number
  reviewSections: SectionsStructure
}

type SectionAndPage = {
  sectionCode: string
  pageNumber: number
}

interface SectionDetails {
  id: number
  index: number
  code: string
  title: string
  totalPages: number
}
interface SectionProgress {
  total: number
  done: number
  completed: boolean
  valid: boolean
  linkedPage: number
}

interface SectionState {
  details: SectionDetails
  progress?: SectionProgress
  assigned?: ReviewerDetails
  pages: {
    [pageName: string]: Page
  }
}
interface SectionsStructure {
  [code: string]: SectionState
}

interface ReviewProgress {
  totalReviewable: number
  doneConform: number
  doneNonConform: number
}

interface SectionStateNEW {
  details: SectionDetails
  progress?: Progress
  reviewProgress?: ReviewProgress
  assigned?: ReviewerDetails
  pages: {
    [pageNum: number]: PageNEW
  }
}
interface SectionsStructureNEW {
  [code: string]: SectionStateNEW
}

interface SetStrictSectionPage {
  (sectionAndPage: SectionAndPage | null): void
}

interface SortQuery {
  sortColumn?: string
  sortDirection?: 'ascending' | 'descending'
}

interface StageAndStatus {
  stage: ApplicationStage
  status: ApplicationStatus
  date: DateTime
}

interface StageDetails {
  number: number
  title: string
  description?: string
}

interface TemplateDetails {
  id: number
  name: string
  code: string
  elementsIds?: number[] // TODO: Change to not optional after re-structure
  sections?: SectionDetails[] // TODO: Change to not optional after re-structure
  startMessage?: string
}

interface TemplateElementState extends ElementBase {
  isRequired: IQueryNode
  visibilityCondition: IQueryNode
  isEditable: IQueryNode
  // isValid: boolean | null
}

interface TemplateElementStateNEW extends ElementBaseNEW {
  isRequiredExpression: IQueryNode
  isVisibleExpression: IQueryNode
  isEditableExpression: IQueryNode
}

interface TemplatePermissions {
  [index: string]: Array<PermissionPolicyType>
}

type TemplatesDetails = {
  permissions: Array<PermissionPolicyType>
  name: string
  code: string
}[]

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

interface ValidatedSections {
  sectionsWithProgress: SectionsStructure
  elementsToUpdate: ValidityFailure[]
}
interface ValidityFailure {
  id: number
  isValid: boolean
  code: string
}

interface RevalidateResult {
  allValid: boolean
  progress: SectionProgress
  sectionCode?: string
  validityFailures: ValidityFailure[]
}

interface UseGetApplicationProps {
  serialNumber: string
  currentUser: User
  sectionCode?: string
  page?: number
  networkFetch?: boolean
  isApplicationReady?: boolean
  setApplicationState?: Function
}

interface User {
  userId: number
  firstName: string
  lastName?: string | null
  username: string
  email: string
  dateOfBirth?: Date | null
  organisation?: Organisation
}

interface OrganisationSimple {
  orgId: number
  userRole: string | null
  orgName: string
}

interface Organisation extends OrganisationSimple {
  licenceNumber: string
  address: string
}

interface LoginPayload {
  success?: boolean
  user: User
  JWT: string
  templatePermissions: TemplatePermissions
  orgList?: OrganisationSimple[]
}

type UserRoles = {
  [role in USER_ROLES]: Array<PermissionPolicyType>
}

interface SortQuery {
  sortColumn?: string
  sortDirection?: 'ascending' | 'descending'
}

interface SetStrictSectionPage {
  (sectionAndPage: SectionAndPage | null): void
}

interface MethodToCallOnRevalidation {
  (firstInvalidPage: SectionAndPage | null, setStrictSectionPage: SetStrictSectionPage): void
}
