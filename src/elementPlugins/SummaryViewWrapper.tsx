import React from 'react'
import { ErrorBoundary, pluginProvider } from '.'
import { ApplicationViewWrapperProps, PluginComponents } from './types'
import evaluateExpression from '@openmsupply/expression-evaluator'
import { useUpdateResponseMutation } from '../utils/generated/graphql'

const ApplicationViewWrapper: React.FC<ApplicationViewWrapperProps> = (props) => {
  const {
    templateElement: { elementTypePluginCode: pluginCode },
    isVisible,
    isEditable,
    isRequired,
    currentResponse,
  } = props

  if (!pluginCode || !isVisible) return null

  const [responseMutation] = useUpdateResponseMutation()

  const onUpdate = (updateObject: any) => {
    const { isValid, value } = updateObject
    responseMutation({
      variables: { id: currentResponse?.id as number, value, isValid },
    })
  }

  const newProps = { evaluator: evaluateExpression, onUpdate, ...props }

  const { ApplicationView }: PluginComponents = pluginProvider.getPluginElement(pluginCode)

  return (
    <ErrorBoundary pluginCode={pluginCode}>
      <React.Suspense fallback="Loading Plugin">{<ApplicationView {...newProps} />}</React.Suspense>
    </ErrorBoundary>
  )
}

export default ApplicationViewWrapper
