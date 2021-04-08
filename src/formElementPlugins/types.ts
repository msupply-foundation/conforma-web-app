import { ReviewResponse, TemplateElement } from '../utils/generated/graphql'
import { ElementStateNEW, ResponseFull, ResponsesByCode } from '../utils/types'

interface OnUpdateApplicationView {
  (updateObject: { value?: any; isValid: boolean | undefined }): void
}

type BasicObject = {
  [key: string]: any
}

interface ApplicationViewWrapperProps {
  element: ElementStateNEW
  isStrictPage: boolean | undefined
  changesRequired?: {
    isChangeRequest: boolean
    isChanged: boolean
    reviewerComment: string
  }
  allResponses: ResponsesByCode
  currentResponse: ResponseFull | null
  currentReview?: ReviewResponse
}

type ValidationState = {
  isValid: boolean | undefined | null
  validationMessage?: string | undefined
}

interface ApplicationViewProps extends ApplicationViewWrapperProps {
  onUpdate: Function
  onSave: Function
  initialValue: any
  value: string // TODO: Change to allow object with any shape
  setValue: (text: string) => void // TO update the value on the ApplicationViewWrapper
  setIsActive: () => void
  validationState: ValidationState
  Markdown: any
  getDefaultIndex: Function
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
  element: ElementStateNEW
  response: ResponseFull | null
  allResponses: ResponsesByCode
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
  folderName: string
  displayName: string
  dynamicParameters?: string[]
  category: 'Input' | 'Informative'
}

interface PluginManifest {
  [key: string]: PluginConfig
}

interface PluginComponents {
  ApplicationView: React.FunctionComponent<ApplicationViewProps>
  SummaryView: React.FunctionComponent<SummaryViewProps>
  TemplateView: React.FunctionComponent<TemplateViewProps>
  config?: PluginConfig
}

interface Plugins {
  [key: string]: PluginComponents
}

export {
  OnUpdateApplicationView,
  OnUpdateTemplateWrapperView,
  TemplateViewProps,
  OnUpdateTemplateView,
  ApplicationViewWrapperProps,
  ApplicationViewProps,
  ValidationState,
  TemplateViewWrapperProps,
  SummaryViewWrapperProps,
  SummaryViewProps,
  PluginConfig,
  PluginManifest,
  PluginComponents,
  Plugins,
}
