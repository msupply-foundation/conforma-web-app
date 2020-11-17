import { TemplateElement } from '../utils/generated/graphql'
import { ResponsesByCode } from '../utils/types'

interface OnUpdateApplicationView {
  (updateObject: { value?: any; isValid: boolean | undefined }): void
}

interface ApplicationViewProps {
  templateElement: TemplateElement
  onUpdate: OnUpdateApplicationView
  isVisible: boolean
  isEditable: boolean
  isRequired: boolean
  allResponses: ResponsesByCode
  evaluator: Function
  // applicationState,
  // graphQLclient
  initialValue: any // Could be a primative or an object with any shape
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
  folderName: string
  displayName: string
  category: 'Input' | 'Informative'
}

interface PluginManifest {
  [key: string]: PluginConfig
}

interface PluginComponents {
  [key: string]: React.FunctionComponent<ApplicationViewProps | TemplateViewProps>
}

interface Plugins {
  [key: string]: PluginComponents
}
export {
  OnUpdateApplicationView,
  OnUpdateTemplateWrapperView,
  TemplateViewProps,
  OnUpdateTemplateView,
  ApplicationViewProps,
  TemplateViewWrapperProps,
  PluginConfig,
  PluginManifest,
  PluginComponents,
  Plugins,
}
