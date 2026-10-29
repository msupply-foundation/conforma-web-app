import { ReviewResponse, TemplateElement } from '../utils/generated/graphql'
import { ApplicationDetails, ElementState, ResponseFull, ResponsesByCode } from '../utils/types'

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

// The choices a choice element offers, as aiDocumentFill describes them to the
// AI service
interface AiFillChoices {
  options: string[] // display labels, in option order
  multiSelect?: boolean
}

// What a plugin provides so aiDocumentFill can fill its elements. Kept out of
// the lazy-loaded components, as most target elements aren't mounted.
interface AiFillMethods {
  // From the element's evaluated parameters; undefined if the options can't
  // all be shown as text
  getChoices?: (parameters: Record<string, unknown>) => AiFillChoices | undefined
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
  type AiFillChoices,
  type AiFillMethods,
}
