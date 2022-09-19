import {
  ApplicationListShape,
  ApplicationResponse,
  ApplicationStatus,
  Decision,
  PermissionPolicyType,
  ReviewAssignmentStatus,
  ReviewDecision,
  ReviewResponse,
  ReviewResponseDecision,
  ReviewStatus,
  TemplateElementCategory,
  User as GraphQLUser,
  Organisation as GraphQLOrg,
  Filter,
  UiLocation,
  Reviewability,
} from './generated/graphql'

import { ValidationState } from '../formElementPlugins/types'
import { Checkbox } from '../formElementPlugins/checkbox/src/ApplicationView'
import { EvaluatorNode } from '@openmsupply/expression-evaluator/lib/types'
import { SemanticICONS } from 'semantic-ui-react'
import { DocumentNode } from '@apollo/client'
import { DateTime, DateTimeFormatOptions } from 'luxon'
import { DateTimeConstant } from '../utils/data/LuxonDateTimeConstants'
import { ErrorResponse } from './hooks/useDataViews'
import { USER_ROLES } from './data'

export {
  ApplicationDetails,
  ApplicationElementStates,
  ApplicationScheduledEvent as ApplicationScheduledEvents,
  ApplicationListRow,
  ApplicationProps,
  AssignmentDetails,
  AssignmentOptions,
  AssignmentOption,
  CellProps,
  ChangeRequestsProgress,
  ColumnDetails,
  ContextApplicationState,
  CurrentPage,
  DecisionOption,
  ElementBase,
  ElementsById,
  ElementPluginParameterValue,
  ElementPluginParameters,
  ElementState,
  EvaluatorNode,
  EvaluatorParameters,
  Filters,
  FullStructure,
  HistoryElement,
  LevelDetails,
  LevelAssignments,
  LooseString,
  MethodRevalidate,
  MethodToCallProps,
  Page,
  PageElement,
  ApplicationProgress,
  ResponseFull,
  ResponsesByCode,
  ReviewAction,
  ReviewDetails,
  ReviewProgress,
  ConsolidationProgress,
  ReviewQuestion,
  ReviewAssignment,
  ReviewSectionComponentProps,
  SectionAndPage,
  SectionDetails,
  SectionAssignee,
  SectionAssignment,
  SectionState,
  SectionsStructure,
  SetStrictSectionPage,
  SortQuery,
  StageAndStatus,
  StageDetails,
  TemplateDetails,
  TemplateCategoryDetails,
  TemplatePermissions,
  TemplateInList,
  TemplatesDetails,
  TemplateType,
  UseGetApplicationProps,
  User,
  UseGetReviewStructureForSectionProps,
  OrganisationSimple,
  Organisation,
  LoginPayload,
  BasicStringObject,
}

interface ApplicationDetails {
  id: number
  template: TemplateDetails
  serial: string
  name: string
  outcome: string
  isLinear: boolean
  isChangeRequest: boolean
  current: StageAndStatus
  firstStrictInvalidPage: SectionAndPage | null
  hasPreviewActions: boolean
  submissionMessage?: string
  startMessage?: string
  user?: GraphQLUser
  org?: GraphQLOrg
  config?: any
}

interface ApplicationElementStates {
  [key: string]: ElementState
}

interface ApplicationListRow extends ApplicationListShape {
  isExpanded: boolean
}

interface ApplicationProps {
  structure: FullStructure
  requestRevalidation?: MethodRevalidate
  strictSectionPage?: SectionAndPage | null
  isValidating?: boolean
}

interface ApplicationScheduledEvent {
  id: number
  timeScheduled: Date
  eventCode: string
  isActive: boolean
}

interface AssignmentDetails {
  id: number
  level: number
  reviewerId?: number
  review: ReviewDetails | null
  reviewer: GraphQLUser
  current: {
    stage: StageDetails
    assignmentStatus: ReviewAssignmentStatus | null
    timeStageCreated: Date
    timeStatusUpdated: Date
    // Doesn't store ReviewStatus
  }
  isCurrentUserAssigner: boolean
  isCurrentUserReviewer: boolean
  isFinalDecision: boolean
  isLastLevel: boolean
  isSelfAssignable: boolean
  isLocked: boolean
  allowedSections: string[]
  assignedSections: string[]
}

interface AssignmentOptions {
  selected: number
  isCompleted: boolean
  options: AssignmentOption[]
}

interface AssignmentOption {
  key: number
  value: number
  text: string
  disabled?: boolean
}

interface BasicStringObject {
  [key: string]: string
}

interface CellProps {
  application: ApplicationListShape
  loading: boolean
  deleteApplication: Function
}

interface ColumnDetails {
  headerName: string
  headerDetail?: string
  sortName: string
  ColumnComponent: React.FunctionComponent<any>
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

type ElementPluginParameterValue = string | number | string[] | EvaluatorNode

interface ElementPluginParameters {
  [key: string]: ElementPluginParameterValue
}

export type ElementForEvaluation = {
  isEditableExpression?: EvaluatorNode
  isRequiredExpression?: EvaluatorNode
  isVisibleExpression?: EvaluatorNode
  validationExpression?: EvaluatorNode
  defaultValueExpression?: EvaluatorNode
  code: string
}

interface ElementBase extends ElementForEvaluation {
  id: number
  title: string
  pluginCode: string
  sectionIndex: number
  sectionCode: string
  elementIndex: number
  page: number
  category: TemplateElementCategory
  validationMessage: string | null
  helpText: string | null
  parameters: any
  reviewability: Reviewability | null
  // reviewRequired: boolean
}

export type EvaluatedElement = {
  isEditable: boolean
  isRequired: boolean
  isVisible: boolean
  isValid: boolean | undefined
  defaultValue: any
}

export type EvaluationOptions = (keyof EvaluatedElement)[]

type ElementState = ElementBase & EvaluatedElement

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
  headers?: { [key: string]: string }
}

type ElementsById = { [templateElementId: string]: PageElement }

interface Filters {
  selectedLevel: number
  currentStage: number
}

interface FullStructure {
  assignment?: ReviewAssignment
  thisReview?: ReviewDetails
  elementsById?: ElementsById
  lastValidationTimestamp?: number
  attemptSubmission: boolean
  info: ApplicationDetails
  canApplicantMakeChanges: boolean
  sections: SectionsStructure
  applicantDeadline: { deadline: Date | null; isActive: boolean }
  stages: {
    stage: StageDetails
    levels: LevelDetails[]
  }[]
  responsesByCode?: ResponsesByCode
  firstIncompleteReviewPage?: SectionAndPage
  sortedSections?: SectionState[]
  sortedPages?: Page[]
  reload: () => void
}

interface HistoryElement {
  author?: string
  title: string
  message: string
  timeUpdated: Date
  reviewerComment?: string
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
  sectionCode: string
  name: string
  progress: ApplicationProgress
  reviewProgress?: ReviewProgress
  consolidationProgress?: ConsolidationProgress
  changeRequestsProgress?: ChangeRequestsProgress
  state: PageElement[]
}

type PageElement = {
  element: ElementState
  response: ResponseFull | null
  previousApplicationResponse: ApplicationResponse
  latestApplicationResponse: ApplicationResponse
  lowerLevelReviewLatestResponse?: ReviewResponse
  lowerLevelReviewPreviousResponse?: ReviewResponse
  thisReviewLatestResponse?: ReviewResponse
  thisReviewPreviousResponse?: ReviewResponse
  latestOriginalReviewResponse?: ReviewResponse
  previousOriginalReviewResponse?: ReviewResponse
  isNewApplicationResponse?: boolean
  isNewReviewResponse?: boolean
  review?: ReviewQuestionDecision
  isPendingReview?: boolean
  isAssigned?: boolean
  isChangeRequest?: boolean
  isChanged?: boolean
  isActiveReviewResponse?: boolean
  enableViewHistory: boolean
}

interface ApplicationProgress {
  doneRequired: number
  doneNonRequired: number
  completed: boolean
  totalRequired: number
  totalNonRequired: number
  totalSum: number
  valid: boolean
  firstStrictInvalidPage: number | null
}

interface ResponseFull {
  id: number
  text: string
  optionIndex?: number
  isValid?: boolean | null
  hash?: string // Used in Password plugin
  files?: any[] // Used in FileUpload plugin
  other?: string // Used in RadioChoice plugin
  selection?: any // Used in Dropdown/Radio selectors
  code?: string // Used in ListBuilder
  list?: any // Used in ListBuilder
  date?: any // Used in DatePicker
  number?: number | null // Used in Number plugin
  // Next 5 used in Checkbox Summary view
  textUnselected?: string
  textMarkdownList?: string
  textUnselectedMarkdownList?: string
  textMarkdownPropertyList?: string
  values: { [key: string]: Checkbox }
  timeCreated?: Date
  reviewResponse?: ReviewResponse
  customValidation?: ValidationState
}

interface ResponsesByCode {
  [key: string]: ResponseFull
}

interface ReviewAssignment {
  assignmentId: number
  assignee: GraphQLUser
  assigneeLevel: number
  assigneeStage: number
  assignmentStatus: ReviewAssignmentStatus
  assignmentDate: Date
  assignedSections: string[]
  canSubmitReviewAs?: Decision | null
  isLastLevel: boolean
  isLocked: boolean
  isSelfAssignable: boolean
  isFinalDecision: boolean
  isFinalDecisionOnConsolidation: boolean
}

type ReviewSectionComponentProps = {
  reviewStructure: FullStructure
  reviewAssignment: AssignmentDetails
  section: SectionState
  previousAssignment: AssignmentDetails
  action: ReviewAction
  isAssignedToCurrentUser: boolean
  isConsolidation: boolean
}

interface ReviewDetails {
  id: number
  level: number
  reviewDecision?: ReviewDecision | null
  reviewer: GraphQLUser
  current: ReviewStageAndStatus
}

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

interface ReviewStageAndStatus {
  stage: StageDetails
  reviewStatus: ReviewStatus
  timeStageCreated: Date
  timeStatusCreated: Date
}

type SectionAndPage = {
  sectionCode: string
  pageNumber: number
}

interface SectionDetails {
  active: boolean
  id: number
  index: number
  code: string
  title: string
  totalPages: number
}

interface BaseReviewProgress {
  totalReviewable: number
  totalPendingReview: number
  totalActive: number // review or application responses that are in progress (as oppose to awaiting review to be started)
  totalNewReviewable: number // new reviable are updates from re-submission (after changes requested to applicant or lower level reviewer)
}

interface ReviewProgress extends BaseReviewProgress {
  doneConform: number
  doneNonConform: number
  doneNewReviewable: number // Review of applicant re-submission
}

interface ConsolidationProgress extends BaseReviewProgress {
  doneAgreeConform: number
  doneAgreeNonConform: number
  doneDisagree: number
  doneActiveDisagree: number
  doneActiveAgreeConform: number
  doneActiveAgreeNonConform: number
  doneNewReviewable: number // Review of reviewer re-submission
  totalConform: number
  totalNonConform: number
}

// TODO: Maybe better to replace with combined actions from ReviewerAction and AssignerAction
enum ReviewAction {
  canContinue = 'CAN_CONTINUE',
  canView = 'CAN_VIEW',
  canReReview = 'CAN_RE_REVIEW',
  canSelfAssign = 'CAN_SELF_ASSIGN',
  canSelfAssignLocked = 'CAN_SELF_ASSIGN_LOCKED',
  canStartReview = 'CAN_START_REVIEW',
  canReStartReview = 'CAN_RE_START_REVIEW', // User for second review (for consolidator)
  canContinueLocked = 'CAN_CONTINUE_LOCKED',
  canMakeDecision = 'CAN_MAKE_DECISION',
  canUpdate = 'CAN_UPDATE',
  unknown = 'UNKNOWN',
}

interface ChangeRequestsProgress {
  totalChangeRequests: number
  doneChangeRequests: number
}

export interface AssignedSectionsByLevel {
  [level: string]: SectionAssignee
}

interface SectionAssignee {
  [sectionCode: string]: {
    newAssignee: number | undefined
    previousAssignee?: number
  }
}

interface SectionAssignment {
  action: ReviewAction
  isAssignedToCurrentUser: boolean
  isConsolidation: boolean
  isReviewable: boolean
}

interface SectionState {
  details: SectionDetails
  progress?: ApplicationProgress
  reviewProgress?: ReviewProgress
  consolidationProgress?: ConsolidationProgress
  assignment?: SectionAssignment
  changeRequestsProgress?: ChangeRequestsProgress
  pages: {
    [pageNum: number]: Page
  }
}

interface SectionsStructure {
  [code: string]: SectionState
}

interface SetStrictSectionPage {
  (sectionAndPage: SectionAndPage | null): void
}

interface SortQuery {
  sortColumn?: string
  sortDirection?: 'ascending' | 'descending'
}

interface StageAndStatus {
  stage: StageDetails
  status: ApplicationStatus
  timeStageCreated: Date
  timeStatusCreated: Date
}

interface StageDetails {
  id: number
  name: string
  number: number
  colour: string
  description?: string
}

interface LevelDetails {
  name: string
  number: number
}

interface LevelAssignments {
  [level: number]: AssignmentDetails[]
}

interface TemplateCategoryDetails {
  title: string
  icon: SemanticICONS | undefined
  uiLocation: UiLocation[]
}

interface TemplateInList {
  id: number
  name: string
  namePlural?: string
  code: string
  version: number
  icon: string | null | undefined
  templateCategory: TemplateCategoryDetails
  permissions: PermissionPolicyType[]
  hasApplyPermission: boolean
  hasNonApplyPermissions: boolean
  filters: Filter[]
  totalApplications: number
}

interface TemplateDetails {
  id: number
  name: string
  code: string
  version: number
  elementsIds?: number[] // TODO: Change to not optional after re-structure
  elementsDefaults?: EvaluatorNode[]
  sections?: SectionDetails[] // TODO: Change to not optional after re-structure
  startMessage?: string
}

interface TemplatePermissions {
  [index: string]: Array<PermissionPolicyType>
}

type TemplatesDetails = {
  permissions: Array<PermissionPolicyType>
  name: string
  code: string
}[]

interface TemplateType {
  code: string
  name: string
  namePlural: string
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
  sessionId: string
}

interface OrganisationSimple {
  orgId: number
  userRole: string | null
  orgName: string
  isSystemOrg: boolean
}

interface Organisation extends OrganisationSimple {
  registration: string
  address: string
  logoUrl: string
}

interface LoginPayload {
  success?: boolean
  user: User
  JWT: string
  templatePermissions: TemplatePermissions
  permissionNames: string[]
  orgList?: OrganisationSimple[]
  isAdmin: boolean
}

interface UseGetReviewStructureForSectionProps {
  reviewStructure: FullStructure
  reviewAssignment?: AssignmentDetails
  previousAssignment?: AssignmentDetails
  filteredSectionIds?: number[]
  awaitMode?: boolean
}

interface SortQuery {
  sortColumn?: string
  sortDirection?: 'ascending' | 'descending'
}

// *****************
// DATA VIEWS
// *****************

// Response value of /data-views endpoint
export type DataViewsResponse = {
  tableName: string
  title: string
  code: string
  urlSlug: string
}[]

interface FormatOptions {
  elementTypePluginCode?: string
  elementParameters?: object
  substitution?: string
  dateFormat?: DateTimeConstant | DateTimeFormatOptions
  // Add more as required
}

export interface DisplayDefinitionBasic {
  dataType?: string
  formatting: FormatOptions
}

export interface DisplayDefinition {
  title: string
  isBasicField: boolean
  dataType?: string
  formatting: FormatOptions
}
export interface HeaderRow extends DisplayDefinition {
  columnName: string
}

interface TableRow {
  id: number
  rowValues: any[]
  item: { [key: string]: any }
}

// Response object of /data-views/table endpoint
export interface DataViewsTableResponse {
  tableName: string
  title: string
  code: string
  headerRow: HeaderRow[]
  tableRows: TableRow[]
  searchFields: string[]
  totalCount: number
  message?: string
}

export interface LinkedApplication {
  id: number
  name: string
  serial: string
  templateName: string
  templateCode: string
  dateCompleted: Date
}

export interface DetailsHeader {
  value: any
  columnName: string
  isBasicField: boolean
  dataType: string | undefined
  formatting: FormatOptions
}

// Response object of /data-views/table/.../item endpoint
export interface DataViewsDetailResponse {
  tableName: string
  tableTitle: string
  id: number
  header: DetailsHeader
  columns: string[]
  item: { [key: string]: any }
  displayDefinitions: { [key: string]: DisplayDefinition }
  linkedApplications?: LinkedApplication[] | [ErrorResponse]
}

export type ApplicationDisplayField = {
  field: keyof LinkedApplication
  displayName: string
  dataType: string
  link: string | null
  linkVar?: keyof LinkedApplication
}

export type DataViewTableAPIQueries = {
  first?: string | undefined
  offset?: string | undefined
  orderBy?: string | undefined
  ascending?: string | undefined
}

// *****************
// LIST FILTERS
// *****************

export type FilterTypeMethod = (filterKey: string, options?: FilterTypeOptions) => object

export type FilterTypeDefinitions = {
  [filterType in
    | 'number'
    | 'date'
    | 'boolean'
    | 'equals'
    | 'enumList'
    | 'searchableListIn'
    | 'searchableListInArray'
    | 'staticList'
    | 'search']: FilterTypeMethod
}

export type FilterTypes = keyof FilterTypeDefinitions

export type FilterListQueryResult = { [queryName: string]: any }
export type FilterListResultExtractor = (props: FilterListQueryResult) => {
  list: string[]
  totalCount: number
}

export type GetFilterListQueryResult = {
  query: DocumentNode
  variables: object
  resultExtractor: FilterListResultExtractor
}

export type GetFilterListQuery = (props: {
  searchValue?: string
  filterListParameters?: any
}) => GetFilterListQueryResult

export type NamedDates = {
  [key: string]: { getDates: () => [DateTime, DateTime]; title: string }
}
export type BooleanFilterMapping = { true: string; false: string }

export type FilterTypeOptions = {
  // For know enum list
  enumList?: string[]
  // For option list that requires api query
  getListQuery?: GetFilterListQuery
  // Or statement instead of columnOrIdentifier
  orFieldNames?: string[]
  // Substitue columnOrIdentifier
  substituteColumnName?: string
  // For named dates
  namedDates?: NamedDates
  // For boolean to show on and of criteria
  booleanMapping?: BooleanFilterMapping
}

export type FilterDefinition = {
  type: FilterTypes
  default: boolean
  visibleTo: USER_ROLES[]
  // Empty or undefined title will be excluded from generic fitler UI display (ListFilters)
  title?: string
  options?: FilterTypeOptions
}

export type FilterDefinitions = {
  // columnOrIdentifier as graphQL filter key unless orFieldNames or substituteColumnName is present in filter options
  [columnOrIdentifier: string]: FilterDefinition
}
