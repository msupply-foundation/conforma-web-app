import React from 'react'
import { ErrorBoundary, pluginProvider } from '.'
import { Header } from 'semantic-ui-react'
import { SummaryViewWrapperProps, PluginComponents } from './types'

const SummaryViewWrapper: React.FC<SummaryViewWrapperProps> = (props) => {
  const { element, value } = props
  const {
    parameters,
    category,
    code,
    elementTypePluginCode: pluginCode,
    isEditable,
    isRequired,
    isVisible,
  } = element

  if (!pluginCode || !isVisible || category === 'INFORMATION') return null

  // const newProps = { evaluator: evaluateExpression, onUpdate, ...props }

  const { SummaryView }: PluginComponents = pluginProvider.getPluginElement(pluginCode)

  console.log('parameters', parameters)

  return (
    <ErrorBoundary pluginCode={pluginCode}>
      <React.Suspense fallback="Loading Plugin">
        <Header as="h3" content={parameters.label} />
        {value?.text}
      </React.Suspense>
    </ErrorBoundary>
  )

  // return <p>Nothing to see here</p>
}

export default SummaryViewWrapper
