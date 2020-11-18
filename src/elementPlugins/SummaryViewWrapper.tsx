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

  const { SummaryView }: PluginComponents = pluginProvider.getPluginElement(pluginCode)

  // TO-DO: Provide a Default SummaryView (just label/text) if SummaryView not provided in plugin

  console.log('SummaryView', SummaryView)

  return (
    <ErrorBoundary pluginCode={pluginCode}>
      <React.Suspense fallback="Loading Plugin">
        <SummaryView parameters={parameters} value={value} />
      </React.Suspense>
    </ErrorBoundary>
  )

  // return <p>Nothing to see here</p>
}

export default SummaryViewWrapper
