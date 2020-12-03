import React, { useEffect, useState } from 'react'
import { ErrorBoundary, pluginProvider } from '.'
import { Grid, Icon, Form, Input } from 'semantic-ui-react'
import { SummaryViewWrapperProps, PluginComponents, ValidationState } from './types'
import { TemplateElementCategory } from '../utils/generated/graphql'
import { defaultValidate } from './defaultValidate'
import { EvaluatorParameters } from '../utils/types'
import { IQueryNode } from '@openmsupply/expression-evaluator/lib/types'

const SummaryViewWrapper: React.FC<SummaryViewWrapperProps> = (props) => {
  const { element, response, allResponses, isStrictValidation } = props
  const { parameters, category, code, pluginCode, isEditable, isRequired, isVisible } = element
  const { validation: validationExpression, validationMessage } = parameters
  const [validationState, setValidationState] = useState<ValidationState>({} as ValidationState)
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

  useEffect(() => {
    if (!pluginCode) return
    // TODO use plugin-specific validation method if defined
    setPluginMethods({
      validate: defaultValidate,
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

  const { SummaryView }: PluginComponents = pluginProvider.getPluginElement(pluginCode)

  const DefaultSummaryView: React.FC = () => {
    return (
      <Form.Field required={isRequired}>
        <label>{parameters.label}</label>
        <Input fluid readOnly disabled transparent value={response ? response?.text : ''} />
      </Form.Field>
    )
  }

  const PluginComponent = <SummaryView parameters={parameters} response={response} />

  return (
    <Grid columns={2}>
      <Grid.Row centered>
        <Grid.Column verticalAlign="middle" floated="left" width={2}>
          {!validationState?.isValid ? <Icon name="exclamation circle" color="red" /> : null}
        </Grid.Column>
        <Grid.Column floated="right" width={14}>
          <ErrorBoundary pluginCode={pluginCode} FallbackComponent={DefaultSummaryView}>
            <React.Suspense fallback="Loading Plugin">
              <Form.Field required={isRequired}>{PluginComponent}</Form.Field>
            </React.Suspense>
          </ErrorBoundary>
          <p style={{ fontSize: '80%', color: 'red' }}>{validationState.validationMessage}</p>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  )
}

export default SummaryViewWrapper
