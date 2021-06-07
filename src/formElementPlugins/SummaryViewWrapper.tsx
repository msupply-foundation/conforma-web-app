import React from 'react'
import { ErrorBoundary, pluginProvider } from '.'
import { Form } from 'semantic-ui-react'
import { SummaryViewWrapperProps, PluginComponents } from './types'
import Markdown from '../utils/helpers/semanticReactMarkdown'

const SummaryViewWrapper: React.FC<SummaryViewWrapperProps> = ({
  element,
  response,
  displayTitle = true,
}) => {
  const { pluginCode, isRequired, isVisible, evaluatedParameters } = element

  const { SummaryView }: PluginComponents = pluginProvider.getPluginElement(pluginCode)

  if (!pluginCode || !isVisible) return null

  const DefaultSummaryView: React.FC = () => {
    return (
      <Form.Field className="element-summary-view" required={isRequired}>
        {displayTitle && (
          <>
            <label style={{ color: 'black' }}>
              <Markdown text={evaluatedParameters.label} semanticComponent="noParagraph" />
            </label>
            <Markdown text={evaluatedParameters.description} />
          </>
        )}
        <Markdown text={(response ? response?.text : '') as string} />
      </Form.Field>
    )
  }

  const PluginComponent = (
    <SummaryView
      evaluatedParameters={evaluatedParameters}
      response={response}
      Markdown={Markdown}
      DefaultSummaryView={DefaultSummaryView}
    />
  )

  return (
    <ErrorBoundary pluginCode={pluginCode}>
      <React.Suspense fallback="Loading Plugin">
        <Form.Field required={isRequired}>{PluginComponent}</Form.Field>
      </React.Suspense>
    </ErrorBoundary>
  )
}

export default SummaryViewWrapper
