import React, { useEffect, useState } from 'react'
import { ErrorBoundary, pluginProvider } from './'
import { ApplicatioViewProps, PluginComponents } from './types'
import { Message } from 'semantic-ui-react'
import evaluateExpression from '@openmsupply/expression-evaluator'

const ApplicationViewWrapper = (props: ApplicatioViewProps) => {
  const {
    templateElement: { elementTypePluginCode: pluginCode },
    isVisibleExpression,
  } = props

const [isVisible, setIsVisible]:any[] = useState({visible: evaluateExpression(isVisibleExpression), error: null})

useEffect(() => {
  evaluateExpression(isVisibleExpression).then((result:any) => {
    setIsVisible({visible: result, error: null})
  }).catch((err) => {
    setIsVisible({visible: true, error: err.message})
  })
}, [isVisibleExpression])

  if (!pluginCode || !isVisible) return null

  if (isVisible.error) return (<Message negative>
    <p>{isVisible.error}</p>
  </Message>)

  const { ApplicationView }: PluginComponents = pluginProvider.getPluginElement(pluginCode)

  return (
    <ErrorBoundary pluginCode={pluginCode}>
      <React.Suspense fallback="Loading Plugin">{<ApplicationView {...props} />}</React.Suspense>
    </ErrorBoundary>
  )
}

export default ApplicationViewWrapper
