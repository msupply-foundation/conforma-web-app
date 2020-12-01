import React, { useEffect, useState } from 'react'
import { ErrorBoundary, pluginProvider } from '.'
import { ApplicationViewWrapperProps, PluginComponents, ValidationState } from './types'
import evaluateExpression from '@openmsupply/expression-evaluator'
import { IQueryNode } from '@openmsupply/expression-evaluator/lib/types'
import { useUpdateResponseMutation } from '../utils/generated/graphql'
import { EvaluatorParameters, LooseString, ResponseFull } from '../utils/types'
import { defaultValidate } from './defaultValidate'

const ApplicationViewWrapper: React.FC<ApplicationViewWrapperProps> = (props) => {
  const {
    code,
    pluginCode,
    parameters,
    isVisible,
    isEditable,
    isRequired,
    currentResponse,
    allResponses,
  } = props

  const { validation: validationExpression, validationMessage } = parameters

  const [responseMutation] = useUpdateResponseMutation()
  const [pluginMethods, setPluginMethods] = useState({
    validate: (
      validationExpress: IQueryNode,
      validationMessage: string,
      evaluatorParameters: EvaluatorParameters
    ): any => console.log('notLoaded'),
  })
  const [validationState, setValidationState] = useState<ValidationState>({} as ValidationState)

  useEffect(() => {
    if (!pluginCode) return
    // TODO use generic or plugin specific
    setPluginMethods({
      validate: defaultValidate,
    })
  }, [])

  const onUpdate = async (value: LooseString) => {
    const responses = { thisResponse: value, ...allResponses }

    if (!validationExpression || value === undefined) {
      setValidationState({ isValid: true } as ValidationState)
      return { isValid: true }
    }

    const validationResult: ValidationState = await pluginMethods.validate(
      validationExpression,
      validationMessage,
      { objects: [responses], APIfetch: fetch }
    )
    setValidationState(validationResult)

    return validationResult
  }

  const onSave = async (jsonValue: ResponseFull) => {
    const validationResult: ValidationState = await onUpdate(jsonValue.text)
    responseMutation({
      variables: {
        id: currentResponse?.id as number,
        value: jsonValue,
        isValid: validationResult.isValid,
      },
    })
  }

  if (!pluginCode || !isVisible) return null

  const { ApplicationView }: PluginComponents = pluginProvider.getPluginElement(pluginCode)

  return (
    <ErrorBoundary pluginCode={pluginCode}>
      <React.Suspense fallback="Loading Plugin">
        {
          <ApplicationView
            onUpdate={onUpdate}
            onSave={onSave}
            validationState={validationState || { isValid: true }}
            {...props}
          />
        }
      </React.Suspense>
    </ErrorBoundary>
  )
}

export default ApplicationViewWrapper
