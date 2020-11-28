import React, { useEffect, useState } from 'react'
import { ErrorBoundary, pluginProvider } from '.'
import { ApplicationViewWrapperProps, PluginComponents, ValidationState } from './types'
import evaluateExpression from '@openmsupply/expression-evaluator'
import { useUpdateResponseMutation } from '../utils/generated/graphql'
import { LooseString, ResponseFull } from '../utils/types'
import { IQueryNode } from '@openmsupply/expression-evaluator/lib/types'

const ApplicationViewWrapper: React.FC<ApplicationViewWrapperProps> = (props) => {
  const {
    pluginCode,
    isVisible,
    isEditable,
    isRequired,
    parameters,
    currentResponse,
    allResponses,
  } = props
  const { validation: validationExpression, validationMessage } = parameters

  const [responseMutation] = useUpdateResponseMutation()
  const [pluginMethods, setPluginMethods] = useState({
    validate: (
      validationExpress: IQueryNode,
      validationMessage: string,
      evaluator: Function
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

    const evaluator = async (expression: IQueryNode) => {
      return await evaluateExpression(expression, { objects: [responses], APIfetch: fetch })
    }
    const validationResult: ValidationState = await pluginMethods.validate(
      validationExpression,
      validationMessage,
      evaluator
    )
    setValidationState(validationResult)

    return validationResult
  }

  const onSave = async (jsonValue: ResponseFull) => {
    const validationResult: ValidationState = await onUpdate(jsonValue.value.text)
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
            validationState={validationState}
            {...props}
          />
        }
      </React.Suspense>
    </ErrorBoundary>
  )
}

const defaultValidate = async (
  validationExpress: IQueryNode,
  validationMessage: string,
  evaluator: Function
): Promise<ValidationState> => {
  if (!validationExpress) return { isValid: true }
  const isValid = await evaluator(validationExpress)
  if (isValid) return { isValid }
  return { isValid, validationMessage }
}

export default ApplicationViewWrapper
