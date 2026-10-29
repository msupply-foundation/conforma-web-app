import { ReviewResponse, TemplateElement } from '../utils/generated/graphql'
import { ApplicationDetails, ElementState, ResponseFull, ResponsesByCode } from '../utils/types'
import type { TranslatePluginMethod } from '../contexts/Localisation'

interface OnUpdateApplicationView {
  (updateObject: { value?: any; isValid: boolean | undefined }): void
}

type BasicObject = {
  [key: string]: any
}

interface ApplicationViewWrapperProps {
  element: ElementState
  isStrictPage: boolean | undefined
  changesRequired?: {
    isChangeRequest: boolean
    isChanged: boolean
    reviewerComment?: string
  }
  allResponses: ResponsesByCode
  onSaveUpdateMethod?: Function
  currentResponse: ResponseFull | null
  applicationData: ApplicationDetails
  currentReview?: ReviewResponse
}

type ValidationState = {
  isValid: boolean | undefined | null
  validationMessage?: string | undefined
}

interface ApplicationViewProps extends ApplicationViewWrapperProps {
  onUpdate: (value: string) => void
  onSave: (value: any) => void
  setIsActive: () => void
  validationState: ValidationState
  Markdown: any
  getDefaultIndex: (defaultValue: string | number, options: any[]) => number
  parameters: any // TODO: Create type for existing pre-defined types for parameters (TemplateElement)s
  validate: Function
}

interface SummaryViewProps {
  parameters: BasicObject
  response: ResponseFull | null
  Markdown: any
  DefaultSummaryView: React.FC
  applicationData: ApplicationDetails
}

interface SummaryViewWrapperProps {
  element: ElementState
  response: ResponseFull | null
  allResponses: ResponsesByCode
  applicationData: ApplicationDetails
  displayTitle?: boolean
}

interface OnUpdateTemplateWrapperView {
  (updateObject: { [key: string]: any }): void
}

interface TemplateViewWrapperProps {
  templateElement: TemplateElement
  onUpdate: OnUpdateTemplateWrapperView
}

interface OnUpdateTemplateView {
  (parameters: any): void
}

interface TemplateViewProps {
  parameters: any
  onUpdate: OnUpdateTemplateView
}

interface PluginConfig {
  isCore?: boolean
  code: string
  // folderName: string
  displayName: string
  internalParameters?: string[]
  parameterLoadingValues?: { [key: string]: string | string[] | number | null }
  category: 'Input' | 'Informative'
}

interface PluginManifest {
  [key: string]: PluginConfig
}

// An answer from the AI service: text, a number, an ISO date (YYYY-MM-DD), the
// label of the chosen option, or the labels of the chosen options
// A list item's answers, keyed by field code
type AiFillRow = Record<string, string | number | string[]>

type AiFillValue = string | number | string[] | AiFillRow[]

// What aiDocumentFill tells the AI service about a question beyond its label
interface AiFillDescription {
  options?: string[] // display labels, in option order
  multiSelect?: boolean
  maxItems?: number // lists
}

// One of a list's fields, with its answer converted by its own plugin
interface AiFillField {
  code: string
  fill: (value: AiFillValue) => Promise<AiFillResponse | undefined> | AiFillResponse | undefined
}

interface AiFillContext {
  locale: string // the selected language's
  t: TranslatePluginMethod // the plugin's own strings
  fields?: AiFillField[] // a list's fields that can be filled (see getFields)
  // For expressions in the element's parameters, as the element evaluates them
  evaluationData?: Record<string, unknown>
}

// A response value as the plugin itself saves it
type AiFillResponse = { text: string } & Record<string, unknown>

type AiFillParameters = Record<string, unknown>

// What a plugin provides so aiDocumentFill can fill its elements. Kept out of
// the lazy-loaded components, as most target elements aren't mounted.
interface AiFillMethods {
  // From the element's evaluated parameters; undefined if the element can't be
  // filled as it's configured (e.g. options that can't all be shown as text)
  describe?: (parameters: AiFillParameters) => AiFillDescription | undefined
  // A list's fields, from its evaluated parameters. aiDocumentFill fills
  // those whose plugins provide aiFill, and only sends the list if every
  // required field is one of them.
  getFields?: (parameters: AiFillParameters) => TemplateElement[]
  // The response for an answer; undefined if the answer doesn't fit the
  // element (e.g. not one of its options, or outside its limits)
  fromPlainValue: (
    value: AiFillValue,
    parameters: AiFillParameters,
    context: AiFillContext
  ) => Promise<AiFillResponse | undefined> | AiFillResponse | undefined
}

interface PluginComponents {
  ApplicationView: React.FunctionComponent<ApplicationViewProps>
  SummaryView: React.FunctionComponent<SummaryViewProps>
  // TemplateView: React.FunctionComponent<TemplateViewProps>
  config: PluginConfig
  localisation?: Record<string, string>
  aiFill?: AiFillMethods
}

interface Plugins {
  [key: string]: PluginComponents
}

export {
  type OnUpdateApplicationView,
  type OnUpdateTemplateWrapperView,
  type TemplateViewProps,
  type OnUpdateTemplateView,
  type ApplicationViewWrapperProps,
  type ApplicationViewProps,
  type ValidationState,
  type TemplateViewWrapperProps,
  type SummaryViewWrapperProps,
  type SummaryViewProps,
  type PluginConfig,
  type PluginManifest,
  type PluginComponents,
  type Plugins,
  type AiFillRow,
  type AiFillValue,
  type AiFillDescription,
  type AiFillField,
  type AiFillContext,
  type AiFillResponse,
  type AiFillParameters,
  type AiFillMethods,
}
