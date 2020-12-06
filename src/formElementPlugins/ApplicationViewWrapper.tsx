import React, { useEffect, useState } from 'react'
import { ErrorBoundary, pluginProvider } from '.'
import { ApplicationViewWrapperProps, PluginComponents, ValidationState } from './types'
import { useUpdateResponseMutation } from '../utils/generated/graphql'
import {
  EvaluatorParameters,
  LooseString,
  ResponseFull,
  ElementPluginParameters,
  ElementPluginParameterValue,
  ValidateObject,
} from '../utils/types'
import { defaultValidate } from './defaultValidate'
import evaluateExpression from '@openmsupply/expression-evaluator'
import { IQueryNode } from '@openmsupply/expression-evaluator/lib/types'
import { Form } from 'semantic-ui-react'

const ApplicationViewWrapper: React.FC<ApplicationViewWrapperProps> = (props) => {
  const {
    code,
    pluginCode,
    parameters,
    initialValue,
    isVisible,
    isEditable,
    isRequired,
    currentResponse,
    allResponses,
    forceValidation,
  } = props

  const { validation: validationExpression, validationMessage } = parameters
  const [responseMutation] = useUpdateResponseMutation()
  const [pluginMethods, setPluginMethods] = useState<ValidateObject>({
    validate: (validationExpress, validationMessage, evaluatorParameters) =>
      console.log('notLoaded'),
  })
  const [validationState, setValidationState] = useState<ValidationState>({} as ValidationState)
  const [evaluatedParameters, setEvaluatedParameters] = useState({})
  const [parametersLoaded, setParametersLoaded] = useState(false)

  const { ApplicationView, config }: PluginComponents = pluginProvider.getPluginElement(pluginCode)

  const dynamicParameters = config?.dynamicParameters

  const dynamicExpressions =
    dynamicParameters && extractDynamicExpressions(dynamicParameters, parameters)
  const [value, setValue] = useState<string>(initialValue?.text)

  useEffect(() => {
    // Runs once on component mount
    if (!pluginCode) return
    // TODO use plugin-specific validation method if defined
    setPluginMethods({
      validate: defaultValidate,
    })
  }, [])

  // Update dynamic parameters when responses change
  useEffect(() => {
    evaluateDynamicParameters(dynamicExpressions as ElementPluginParameters, {
      objects: [allResponses],
      APIfetch: fetch,
    }).then((result: ElementPluginParameters) => {
      setEvaluatedParameters(result)
      setParametersLoaded(true)
    })
  }, [allResponses])
  useEffect(() => {
    if (forceValidation) onUpdate(currentResponse?.text)
  }, [currentResponse, forceValidation])

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
    if (jsonValue.text !== undefined)
      responseMutation({
        variables: {
          id: currentResponse?.id as number,
          value: jsonValue,
          isValid: validationResult.isValid,
        },
      })
  }

  if (!pluginCode || !isVisible) return null

  const PluginComponent = (
    <ApplicationView
      onUpdate={onUpdate}
      onSave={onSave}
      {...props}
      parameters={{ ...parameters, ...evaluatedParameters }}
      value={value}
      setValue={setValue}
      validationState={validationState || { isValid: true }}
      // TO-DO: ensure validationState gets calculated BEFORE rendering this child, so we don't need this fallback.
    />
  )

  return (
    <ErrorBoundary pluginCode={pluginCode}>
      <React.Suspense fallback="Loading Plugin">
        {parametersLoaded && <Form.Field required={isRequired}>{PluginComponent}</Form.Field>}
      </React.Suspense>
    </ErrorBoundary>
  )
}

export default ApplicationViewWrapper

export function extractDynamicExpressions(fields: string[], parameters: ElementPluginParameters) {
  const expressionObject: ElementPluginParameters = {}
  fields.forEach((field) => {
    expressionObject[field] = parameters[field]
  })
  return expressionObject
}

export async function evaluateDynamicParameters(
  dynamicExpressions: ElementPluginParameters,
  evaluatorParameters: EvaluatorParameters
) {
  if (!dynamicExpressions) return {}
  const fields = Object.keys(dynamicExpressions)
  const expressions = Object.values(dynamicExpressions).map(
    (expression: ElementPluginParameterValue) => {
      evaluateExpression(expression, evaluatorParameters)
    }
  )
  const evaluatedExpressions: any = await Promise.all(expressions)
  const evaluatedParameters: ElementPluginParameters = {}
  for (let i = 0; i < fields.length; i++) {
    evaluatedParameters[fields[i]] = evaluatedExpressions[i]
  }
  return evaluatedParameters
}
