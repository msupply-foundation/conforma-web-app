import {
  ApplicationListShape,
  ApplicationResponse,
  ApplicationStatus,
  Decision,
  PermissionPolicyType,
  ReviewAssignmentStatus,
  ReviewDecision,
  ReviewQuestionAssignment,
  ReviewResponse,
  ReviewResponseDecision,
  ReviewStatus,
  TemplateElement,
  TemplateElementCategory,
  User as GraphQLUser,
} from './generated/graphql'

import { ValidationState } from '../formElementPlugins/types'

import { IQueryNode } from '@openmsupply/expression-evaluator/lib/types'
import { APPLICATION_COLUMNS, USER_ROLES } from './data'

export {
  ApplicationDetails,
  ApplicationElementStates,
  ApplicationListRow,
  ApplicationProps,
  AssignmentDetails,
  CellProps,
  ChangeRequestsProgress,
  ColumnDetails,
  ColumnsPerRole,
  ContextApplicationState,
  CurrentPage,
  DecisionOption,
  ElementBaseNEW,
  ElementsById,
  ElementPluginParameterValue,
  ElementPluginParameters,
  ElementStateNEW,
  ElementsActivityState,
  EvaluatorParameters,
  FullStructure,
  GroupedReviewResponses,
  IGraphQLConnection,
  LooseString,
  MethodRevalidate,
  MethodToCallProps,
  PageNEW,
  PageElement,
  PageElementsStatuses,
  Progress,
  ProgressStatus,
  ResponseFull,
  ResponsePayload,
  ResponsesByCode,
  ResumeSection,
  ReviewAction,
  ReviewDetails,
  ReviewProgressStatus,
  ReviewProgress,
  ReviewQuestion,
  ReviewQuestionDecision,
  ReviewSectionComponentProps,
  SectionAndPage,
  SectionDetails,
  SectionProgress,
  SectionStateNEW,
  SectionsStructureNEW,
  SetStrictSectionPage,
  SortQuery,
  StageAndStatus,
  TemplateDetails,
  TemplateElementStateNEW,
  TemplatePermissions,
  TemplatesDetails,
  ValidateFunction,
  ValidateObject,
  UseGetApplicationProps,
  User,
  UserRoles,
  UseGetFullReviewStructureProps,
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
  isChangeRequest: boolean
  current?: StageAndStatus // TODO: Change to compulsory after re-strcture is finished
  firstStrictInvalidPage: SectionAndPage | null
  submissionMessage?: string // TODO: Change to compulsory after re-structure is finished
}

interface ApplicationElementStates {
  [key: string]: ElementStateNEW
}

interface ApplicationListRow extends ApplicationListShape {
  isExpanded: boolean
}

interface ApplicationProps {
  structure: FullStructure
  requestRevalidation?: MethodRevalidate
  strictSectionPage?: SectionAndPage | null
}

interface ApplicationStage {
  id: number
  name: string
}

interface AssignmentDetails {
  id: number
  status: ReviewAssignmentStatus | null
  timeCreated: Date
  level: number
  reviewerId?: number
  review: ReviewDetails | null
  reviewer: GraphQLUser
  totalAssignedQuestions: number
  stage: ApplicationStage
  reviewQuestionAssignments: ReviewQuestionAssignment[]
  isCurrentUserAssigner: boolean
  assignableSectionRestrictions: (string | null)[]
  isCurrentUserReviewer: boolean
}

interface BasicStringObject {
  [key: string]: string
}

interface CellProps {
  application: ApplicationListShape
}

interface ColumnDetails {
  headerName: string
  sortName: string
  ColumnComponent: React.FunctionComponent<any>
}

type ColumnsPerRole = {
  [role in USER_ROLES]: Array<APPLICATION_COLUMNS>
}

interface ContextApplicationState {
  id: number | null
  serialNumber: string | null
  inputElementsActivity: ElementsActivityState
}

interface CurrentPage {
  section: SectionDetails
  page: number
}

type DecisionOption = {
  code: Decision
  title: string
  isVisible: boolean
  value: boolean
}

type ElementPluginParameterValue = string | number | string[] | IQueryNode

interface ElementPluginParameters {
  [key: string]: ElementPluginParameterValue
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
  thisReview?: ReviewDetails | null
  elementsById?: ElementsById
  lastValidationTimestamp?: number
  info: ApplicationDetails
  sections: SectionsStructureNEW
  stages: StageDetails[]
  responsesByCode?: ResponsesByCode
  firstIncompleteReviewPage?: SectionAndPage
  canSubmitReviewAs?: Decision | null
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

interface PageNEW {
  number: number
  sectionCode: string
  name: string
  progress: Progress
  reviewProgress?: ReviewProgress
  changeRequestsProgress?: ChangeRequestsProgress
  state: PageElement[]
}

type PageElement = {
  element: ElementStateNEW
  response: ResponseFull | null
  previousApplicationResponse: ApplicationResponse
  latestApplicationResponse: ApplicationResponse
  thisReviewLatestResponse?: ReviewResponse
  isNewApplicationResponse?: boolean
  review?: ReviewQuestionDecision
  assignmentId: number
  isAssigned?: boolean
  isChangeRequest?: boolean
  isChanged?: boolean
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
  hash?: string // Used in Password plugin
  files?: any[] // Used in FileUpload plugin
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

type ReviewSectionComponentProps = {
  fullStructure: FullStructure
  section: SectionStateNEW
  assignment: AssignmentDetails
  thisReview?: ReviewDetails | null
  action: ReviewAction
  isAssignedToCurrentUser: boolean
}

interface ReviewDetails {
  id: number
  status: ReviewStatus
  timeStatusCreated?: Date
  stage: ApplicationStage
  isLastLevel: boolean
  level: number
  reviewDecision?: ReviewDecision | null
}

interface ReviewerDetails {
  id: number
  firstName: string
  lastName: string
  current: boolean
}

type ReviewProgressStatus = 'NOT_COMPLETED' | 'DECLINED' | 'APPROVED'

interface ReviewQuestion {
  code: string
  responseId: number
  id: number
  sectionIndex: number
}
interface ReviewQuestionDecision {
  id: number
  comment?: string | null
  decision?: ReviewResponseDecision | null
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

interface ReviewProgress {
  totalReviewable: number
  doneConform: number
  doneNonConform: number
  doneNewReviewable: number
  totalNewReviewable: number
}
enum ReviewAction {
  canContinue = 'CAN_CONTINUE',
  canView = 'CAN_VIEW',
  canReReview = 'CAN_RE_REVIEW',
  canSelfAssign = 'CAN_SELF_ASSIGN',
  canStartReview = 'CAN_START_REVIEW',
  canContinueLocked = 'CAN_CONTINUE_LOCKED',
  canUpdate = 'CAN_UPDATE',
  unknown = 'UNKNOWN',
}

interface ChangeRequestsProgress {
  totalChangeRequests: number
  doneChangeRequests: number
}

interface SectionStateNEW {
  details: SectionDetails
  progress?: Progress
  reviewProgress?: ReviewProgress
  reviewAction?: {
    action: ReviewAction
    isAssignedToCurrentUser: boolean
    isReviewable: boolean
  }
  changeRequestsProgress?: ChangeRequestsProgress
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
  date: Date
}

interface StageDetails {
  number: number
  id: number
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

interface UseGetFullReviewStructureProps {
  fullApplicationStructure: FullStructure
  reviewAssignment: AssignmentDetails
  filteredSectionIds?: number[]
  awaitMode?: boolean
}

interface SortQuery {
  sortColumn?: string
  sortDirection?: 'ascending' | 'descending'
}

interface SetStrictSectionPage {
  (sectionAndPage: SectionAndPage | null): void
}
