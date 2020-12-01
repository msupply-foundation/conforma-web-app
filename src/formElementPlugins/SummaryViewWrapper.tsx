import React, { useEffect, useState } from 'react'
import { ErrorBoundary, pluginProvider } from '.'
import { Grid, Icon } from 'semantic-ui-react'
import { SummaryViewWrapperProps, PluginComponents } from './types'
import { TemplateElementCategory } from '../utils/generated/graphql'
import evaluateExpression from '@openmsupply/expression-evaluator'
import { IQueryNode } from '@openmsupply/expression-evaluator/lib/types'

const SummaryViewWrapper: React.FC<SummaryViewWrapperProps> = (props) => {
  const { element, response } = props
  const { parameters, category, code, pluginCode, isEditable, isRequired, isVisible } = element
  const [validationState, setValidationState] = useState({
    isValid: response?.isValid,
    validationMessage: parameters.validationMessage,
  })
  const [pluginMethods, setPluginMethods] = useState({
    validate: (
      validationExpress: IQueryNode,
      validationMessage: string,
      evaluator: Function
    ): any => console.log('notLoaded'),
  })

  useEffect(() => {
    // Re-validate on initial load
  }, [])

  // Don't show non-question elements -- although this may change
  if (!pluginCode || !isVisible || category === TemplateElementCategory.Information) return null

  const { SummaryView }: PluginComponents = pluginProvider.getPluginElement(pluginCode)

  // TO-DO: Provide a Default SummaryView (just label/text) if SummaryView not provided in plugin

  return (
    <ErrorBoundary pluginCode={pluginCode}>
      <React.Suspense fallback="Loading Plugin">
        <Grid columns={2}>
          <Grid.Row>
            <Grid.Column floated="left" width={12}>
              <SummaryView parameters={parameters} response={response} />
            </Grid.Column>
            <Grid.Column floated="right" width={3}>
              {!validationState?.isValid ? <Icon name="exclamation circle" color="red" /> : null}
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </React.Suspense>
    </ErrorBoundary>
  )
}

export default SummaryViewWrapper
