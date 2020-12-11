import React, { useEffect, useState } from 'react'
import { ErrorBoundary, pluginProvider } from '.'
import { Grid, Icon, Form, Input } from 'semantic-ui-react'
import { SummaryViewWrapperProps, PluginComponents, ValidationState } from './types'
import { TemplateElementCategory } from '../utils/generated/graphql'
import { ElementPluginParameters, EvaluatorParameters, ValidateObject } from '../utils/types'
import { extractDynamicExpressions, evaluateDynamicParameters } from './ApplicationViewWrapper'

const SummaryViewWrapper: React.FC<SummaryViewWrapperProps> = (props) => {
  const { element, response, allResponses } = props
  const { parameters, category, code, pluginCode, isEditable, isRequired, isVisible } = element
  const [evaluatedParameters, setEvaluatedParameters] = useState({})
  const [parametersLoaded, setParametersLoaded] = useState(false)
  const responses = { thisResponse: response?.text, ...allResponses }

  const { SummaryView, config }: PluginComponents = pluginProvider.getPluginElement(pluginCode)

  const dynamicParameters = config?.dynamicParameters
  const dynamicExpressions =
    dynamicParameters && extractDynamicExpressions(dynamicParameters, parameters)

  useEffect(() => {
    // Runs once on component mount
    evaluateDynamicParameters(dynamicExpressions as ElementPluginParameters, {
      objects: [allResponses],
      APIfetch: fetch,
    }).then((result: ElementPluginParameters) => {
      setEvaluatedParameters(result)
      setParametersLoaded(true)
    })
  }, [])

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
    <Grid columns={1}>
      <Grid.Row centered>
        <Grid.Column width={14}>
          <ErrorBoundary pluginCode={pluginCode} FallbackComponent={DefaultSummaryView}>
            <React.Suspense fallback="Loading Plugin">
              {parametersLoaded && <Form.Field required={isRequired}>{PluginComponent}</Form.Field>}
            </React.Suspense>
          </ErrorBoundary>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  )
}

export default SummaryViewWrapper
