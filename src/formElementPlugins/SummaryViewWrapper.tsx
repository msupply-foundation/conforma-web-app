import React from 'react'
import { ErrorBoundary, pluginProvider } from '.'
import { Grid, Icon } from 'semantic-ui-react'
import { SummaryViewWrapperProps, PluginComponents } from './types'
import { TemplateElementCategory } from '../utils/generated/graphql'

const SummaryViewWrapper: React.FC<SummaryViewWrapperProps> = (props) => {
  const { element, response } = props
  const { parameters, category, code, pluginCode, isEditable, isRequired, isVisible } = element

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
              {!response?.isValid ? <Icon name="exclamation circle" color="red" /> : null}
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </React.Suspense>
    </ErrorBoundary>
  )
}

export default SummaryViewWrapper
