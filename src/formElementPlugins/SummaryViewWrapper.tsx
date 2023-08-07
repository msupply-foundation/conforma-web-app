import React, { useEffect, useState } from 'react'
import { ErrorBoundary, pluginProvider } from '.'
import { Form } from 'semantic-ui-react'
import { SummaryViewWrapperProps, PluginComponents } from './types'
import figTree from '../components/FigTreeEvaluator'
import { EvaluatorNode } from '../utils/types'
import { buildParameters } from './ApplicationViewWrapper'
import { useUserState } from '../contexts/UserState'
import Markdown from '../utils/helpers/semanticReactMarkdown'
import { TemplateElementCategory } from '../utils/generated/graphql'

const SummaryViewWrapper: React.FC<SummaryViewWrapperProps> = ({
  element,
  response,
  allResponses,
  applicationData = {},
  displayTitle = true,
}) => {
  const { parameters, pluginCode, isRequired, isVisible } = element
  const {
    userState: { currentUser },
  } = useUserState()
  const [evaluatedParameters, setEvaluatedParameters] = useState({})

  const { SummaryView, config }: PluginComponents = pluginProvider.getPluginElement(pluginCode)

  const parameterLoadingValues = config?.parameterLoadingValues
  const internalParameters = config?.internalParameters || []
  const [simpleParameters, parameterExpressions] = buildParameters(
    parameters,
    parameterLoadingValues,
    internalParameters
  )

  useEffect(() => {
    // Update dynamic parameters when responses change
    Object.entries(parameterExpressions).forEach(([field, expression]) => {
      figTree
        .evaluate(expression as EvaluatorNode, {
          data: {
            responses: { ...allResponses, thisResponse: response?.text },
            currentUser,
            applicationData,
          },
        })
        .then((result: any) =>
          setEvaluatedParameters((prevState) => ({ ...prevState, [field]: result }))
        )
    })
  }, [allResponses])

  if (!pluginCode || !isVisible) return null

  const DefaultSummaryView: React.FC = () => {
    const combinedParams = {
      ...simpleParameters,
      ...evaluatedParameters,
      ...response?.evaluatedParameters,
    }
    return (
      <Form.Field
        className="element-summary-view"
        required={isRequired && element.category !== TemplateElementCategory.Information}
      >
        {displayTitle && (
          <>
            <label style={{ color: 'black' }}>
              <Markdown text={combinedParams.label} semanticComponent="noParagraph" />
            </label>
            <Markdown text={combinedParams.description} />
          </>
        )}
        <Markdown text={(response ? response?.text : '') as string} />
      </Form.Field>
    )
  }

  const PluginComponent = (
    <SummaryView
      parameters={{ ...simpleParameters, ...evaluatedParameters, ...response?.evaluatedParameters }}
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
