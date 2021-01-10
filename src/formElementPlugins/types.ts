import { IQueryNode } from '@openmsupply/expression-evaluator/lib/types'
import { TemplateElement } from '../utils/generated/graphql'
import { ElementState, ResponseFull, ResponsesByCode } from '../utils/types'

interface OnUpdateApplicationView {
  (updateObject: { value?: any; isValid: boolean | undefined }): void
}

type BasicObject = {
  [key: string]: any
}

interface ApplicationViewWrapperProps {
  code: string
  pluginCode: string // TODO: Create type OR use existing from graphql
  isVisible: boolean
  isEditable: boolean
  isRequired: boolean
  parameters: any // TODO: Create type for existing pre-defined types for parameters (TemplateElement)
  validationExpression: IQueryNode
  validationMessage: string | null
  allResponses: ResponsesByCode
  currentResponse: ResponseFull | null
  // applicationState,
  // graphQLclient
  initialValue: any // Could be a primative or an object with any shape
  forceValidation: boolean // Run validation on formElement on load - usualy would run only onChange events
}

type ValidationState = {
  isValid: boolean | undefined
  validationMessage?: string | undefined
}

interface ApplicationViewProps extends ApplicationViewWrapperProps {
  onUpdate: Function
  onSave: Function
  value: string // TODO: Change to allow object with any shape
  setValue: (text: string) => void // TO update the value on the ApplicationViewWrapper
  setIsActive: () => void
  validationState: ValidationState
  Markdown: any
  defaultValidate: Function
}

interface SummaryViewProps {
  parameters: BasicObject
  response: ResponseFull | null
  Markdown: any
}

interface SummaryViewWrapperProps {
  element: ElementState
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
