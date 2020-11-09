import React from 'react'
import { ErrorBoundary, pluginProvider } from './'
import { ApplicationViewProps, PluginComponents } from './types'

const ApplicationViewWrapper: React.FC<ApplicationViewProps> = (props) => {
  const {
    templateElement: { elementTypePluginCode: pluginCode },
    isVisible,
    isEditable,
    isRequired,
    allResponses,
  } = props

  if (!pluginCode || !isVisible) return null

  const { ApplicationView }: PluginComponents = pluginProvider.getPluginElement(pluginCode)

  return (
    <ErrorBoundary pluginCode={pluginCode}>
      <React.Suspense fallback="Loading Plugin">{<ApplicationView {...props} />}</React.Suspense>
    </ErrorBoundary>
  )
}

export default ApplicationViewWrapper
