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
}

interface SummaryViewWrapperProps {
  element: ElementState
  response: ResponseFull | null
  allResponses: ResponsesByCode
  applicationData?: ApplicationDetails
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

interface PluginComponents {
  ApplicationView: React.FunctionComponent<ApplicationViewProps>
  SummaryView: React.FunctionComponent<SummaryViewProps>
  // TemplateView: React.FunctionComponent<TemplateViewProps>
  config: PluginConfig
  localisation?: Record<string, string>
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
}
