import React from 'react'
import { ErrorBoundary, pluginProvider } from './'
import { ApplicationViewWrapperProps, PluginComponents } from './types'
import evaluateExpression from '@openmsupply/expression-evaluator'

const ApplicationViewWrapper: React.FC<ApplicationViewWrapperProps> = (props) => {
  const {
    templateElement: { elementTypePluginCode: pluginCode },
    isVisible,
  } = props

  if (!pluginCode || !isVisible) return null

  const newProps = { evaluator: evaluateExpression, ...props }

  const { ApplicationView }: PluginComponents = pluginProvider.getPluginElement(pluginCode)

  return (
    <ErrorBoundary pluginCode={pluginCode}>
      <React.Suspense fallback="Loading Plugin">{<ApplicationView {...newProps} />}</React.Suspense>
    </ErrorBoundary>
  )
}

export default ApplicationViewWrapper
