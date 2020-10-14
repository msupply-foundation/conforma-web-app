import React, { useEffect, useState } from 'react'
import { ErrorBoundary, pluginProvider } from './'
import { ApplicatioViewProps, PluginComponents } from './types'
import evaluateExpression from '@openmsupply/expression-evaluator'

const ApplicationViewWrapper = (props: ApplicatioViewProps) => {
  const {
    templateElement: { elementTypePluginCode: pluginCode },
    isVisibleExpression,
  } = props

const [isVisible, setIsVisible] = useState(evaluateExpression(isVisibleExpression))  

useEffect(() => {
  evaluateExpression(isVisibleExpression).then((result:any) => {
    setIsVisible(result)
  })
}, [isVisibleExpression])

  if (!pluginCode || !isVisible) return null

  const { ApplicationView }: PluginComponents = pluginProvider.getPluginElement(pluginCode)

  return (
    <ErrorBoundary pluginCode={pluginCode}>
      <React.Suspense fallback="Loading Plugin">{<ApplicationView {...props} />}</React.Suspense>
    </ErrorBoundary>
  )
}

export default ApplicationViewWrapper
