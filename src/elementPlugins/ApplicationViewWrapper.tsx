import React from 'react'
import { ErrorBoundary, pluginProvider } from './'
import { ApplicatioViewProps, PluginComponents } from './types'

const ApplicationViewWrapper = (props: ApplicatioViewProps) => {
  const {
    templateElement: { elementTypePluginCode: pluginCode },
    isVisible,
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
