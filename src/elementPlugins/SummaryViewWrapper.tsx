import React from 'react'
import { ErrorBoundary, pluginProvider } from '.'
import { SummaryViewWrapperProps, PluginComponents } from './types'
import { TemplateElementCategory } from '../utils/generated/graphql'

const SummaryViewWrapper: React.FC<SummaryViewWrapperProps> = (props) => {
  const { element, response } = props
  const {
    parameters,
    category,
    code,
    elementTypePluginCode: pluginCode,
    isEditable,
    isRequired,
    isVisible,
  } = element

  // Don't show non-question elements -- although this may change
  if (!pluginCode || !isVisible || category === TemplateElementCategory.Information) return null

  const { SummaryView }: PluginComponents = pluginProvider.getPluginElement(pluginCode)

  // TO-DO: Provide a Default SummaryView (just label/text) if SummaryView not provided in plugin

  return (
    <ErrorBoundary pluginCode={pluginCode}>
      <React.Suspense fallback="Loading Plugin">
        <SummaryView parameters={parameters} response={response} />
      </React.Suspense>
    </ErrorBoundary>
  )
}

export default SummaryViewWrapper
