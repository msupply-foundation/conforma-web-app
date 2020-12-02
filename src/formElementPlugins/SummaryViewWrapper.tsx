import React from 'react'
import { ErrorBoundary, pluginProvider } from '.'
import { Form, Header } from 'semantic-ui-react'
import { SummaryViewWrapperProps, PluginComponents } from './types'
import { TemplateElementCategory } from '../utils/generated/graphql'

const SummaryViewWrapper: React.FC<SummaryViewWrapperProps> = (props) => {
  const { element, response } = props
  const { parameters, category, code, pluginCode, isEditable, isRequired, isVisible } = element

  // Don't show non-question elements -- although this may change
  if (!pluginCode || !isVisible || category === TemplateElementCategory.Information) return null

  const { SummaryView }: PluginComponents = pluginProvider.getPluginElement(pluginCode)

  // TO-DO: Provide a Default SummaryView (just label/text) if SummaryView not provided in plugin

  const PluginComponent = <SummaryView parameters={parameters} response={response} />

  return (
    <ErrorBoundary pluginCode={pluginCode}>
      <React.Suspense fallback="Loading Plugin">
        <Form.Field required={isRequired} inline>
          {PluginComponent}
        </Form.Field>
      </React.Suspense>
    </ErrorBoundary>
  )
}

export default SummaryViewWrapper
