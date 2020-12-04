import React, { useEffect, useState } from 'react'
import { ErrorBoundary, pluginProvider } from '.'
import { Grid, Icon, Form, Input } from 'semantic-ui-react'
import { SummaryViewWrapperProps, PluginComponents, ValidationState } from './types'
import { TemplateElementCategory } from '../utils/generated/graphql'
import { defaultValidate } from './defaultValidate'
import { EvaluatorParameters } from '../utils/types'
import { IQueryNode } from '@openmsupply/expression-evaluator/lib/types'
import { extractDynamicExpressions, evaluateDynamicParameters } from './ApplicationViewWrapper'

const SummaryViewWrapper: React.FC<SummaryViewWrapperProps> = (props) => {
  const { element, response, allResponses, isStrictValidation } = props
  const { parameters, category, code, pluginCode, isEditable, isRequired, isVisible } = element
  const { validation: validationExpression, validationMessage } = parameters
  const [validationState, setValidationState] = useState<ValidationState>({} as ValidationState)
  const [evaluatedParameters, setEvaluatedParameters] = useState({})
  const [parametersLoaded, setParametersLoaded] = useState(false)
  const responses = { thisResponse: response?.text, ...allResponses }
  const [pluginMethods, setPluginMethods] = useState({
    validate: (
      validationExpress: IQueryNode,
      validationMessage: string,
      evaluatorParameters: EvaluatorParameters
    ): any =>
      defaultValidate(validationExpression, validationMessage, {
        objects: [responses],
        APIfetch: fetch,
      }),
  })

  const {
    SummaryView,
    config: { dynamicParameters },
  }: PluginComponents = pluginProvider.getPluginElement(pluginCode)

  const dynamicExpressions =
    dynamicParameters && extractDynamicExpressions(dynamicParameters, parameters)

  useEffect(() => {
    if (!pluginCode) return
    // TODO use plugin-specific validation method if defined
    setPluginMethods({
      validate: defaultValidate,
    })
    evaluateDynamicParameters(dynamicExpressions, {
      objects: [allResponses],
      APIfetch: fetch,
    }).then((result: any) => {
      setEvaluatedParameters(result)
      setParametersLoaded(true)
    })
  }, [])

  useEffect(() => {
    // Re-validate on load
    if (!isStrictValidation && (!validationExpression || response?.text === undefined)) {
      setValidationState({ isValid: true } as ValidationState)
      return
    }

    if (isStrictValidation && isRequired && response?.text === undefined) {
      console.log('Going to invalid:', code)
      setValidationState({ isValid: false, validationMessage: 'Field cannot be blank' })
      return
    }

    pluginMethods
      .validate(validationExpression, validationMessage, { objects: [responses], APIfetch: fetch })
      .then((validationResult: ValidationState) => {
        setValidationState(validationResult)
      })
  }, [isStrictValidation])

  // Don't show non-question elements -- although this may change
  if (!pluginCode || !isVisible || category === TemplateElementCategory.Information) return null

  const DefaultSummaryView: React.FC = () => {
    const combinedParams = { ...parameters, ...evaluatedParameters }
    return (
      <Form.Field required={isRequired}>
        {parametersLoaded && <label>{combinedParams.label}</label>}
        <Input fluid readOnly disabled transparent value={response ? response?.text : ''} />
      </Form.Field>
    )
  }

  const PluginComponent = (
    <SummaryView parameters={{ ...parameters, ...evaluatedParameters }} response={response} />
  )

  return (
    <Grid columns={2}>
      <Grid.Row centered>
        <Grid.Column verticalAlign="middle" width={2}>
          {!validationState?.isValid ? <Icon name="exclamation circle" color="red" /> : null}
        </Grid.Column>
        <Grid.Column width={14}>
          <ErrorBoundary pluginCode={pluginCode} FallbackComponent={DefaultSummaryView}>
            <React.Suspense fallback="Loading Plugin">
              {parametersLoaded && <Form.Field required={isRequired}>{PluginComponent}</Form.Field>}
            </React.Suspense>
          </ErrorBoundary>
          <p style={{ fontSize: '80%', color: 'red' }}>{validationState.validationMessage}</p>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  )
}

export default SummaryViewWrapper
