import React from 'react'
import { Message, Header, Form, Segment } from 'semantic-ui-react'
import { Loading } from '../../components'
import usePageTitle from '../../utils/hooks/usePageTitle'
import { useRouter } from '../../utils/hooks/useRouter'
import { SummaryViewWrapper } from '../../formElementPlugins'
import strings from '../../utils/constants'
import { TemplateElementCategory } from '../../utils/generated/graphql'
import {
  ApplicationDetails,
  DetailDisplay,
  DetailDisplayQuery,
  ResponseFull,
} from '../../utils/types'
import config from '../../config'
import { defaultEvaluatedElement } from '../../utils/hooks/useLoadApplication'
import { useOutcomesDetail } from '../../utils/hooks/useOutcomes'
import { FormattedCell, formatCellText } from './FormattedCell'
import { DisplayDefinition } from './types'

const OutcomeDetails: React.FC = () => {
  const {
    push,
    params: { tableName, id },
  } = useRouter()
  const { outcomeDetail, loading, error } = useOutcomesDetail({ tableName, recordId: id })
  usePageTitle(outcomeDetail?.header.value || '')

  if (error) return <p>{error?.message}</p>
  if (loading || !outcomeDetail) return <Loading />

  const { header, columns, displayDefinitions, item, linkedApplications } = outcomeDetail

  return (
    <>
      <Header as="h4">{header.value}</Header>
      <Form className="form-area">
        <div className="detail-container">
          {columns.map((columnName, index) => {
            return (
              <Segment key={`cell_${index}`} className="summary-page-element">
                {constructElement(item[columnName], displayDefinitions[columnName], id)}
              </Segment>
            )
          })}
        </div>
      </Form>
    </>
  )
}

const constructElement = (value: any, displayDefinition: DisplayDefinition, id: number) => {
  const { title } = displayDefinition
  const { elementTypePluginCode, elementParameters, response } = getElementDetails(
    value,
    displayDefinition
  )
  const element = {
    id,
    code: `Detail${id}`,
    pluginCode: elementTypePluginCode as string,
    category: TemplateElementCategory.Information,
    title,
    parameters: elementParameters,
    validationExpression: true,
    validationMessage: '',
    elementIndex: 0,
    page: 0,
    sectionIndex: 0,
    helpText: null,
    sectionCode: '0',
    ...defaultEvaluatedElement,
    isRequired: false,
  }
  return (
    <SummaryViewWrapper
      element={element}
      applicationData={{ config } as ApplicationDetails}
      /* TODO this is a hacky way of passing through server URL, I think it needs to be decoupled from applicationData. Config is needed for log_url in organisation to be displayed with imageDisplays plugin */
      response={response}
      allResponses={{}}
    />
  )
}

const getElementDetails = (value: any, displayDefinition: DisplayDefinition) => {
  // If it's not already a plugin element, structure it as a shortText
  // element for display purposes
  const { formatting } = displayDefinition
  const isAlreadyElement = !!formatting?.elementTypePluginCode
  const elementTypePluginCode = isAlreadyElement ? formatting?.elementTypePluginCode : 'shortText'
  const elementParameters = isAlreadyElement
    ? formatting?.elementParameters
    : {
        label: displayDefinition.title,
      }
  const response = isAlreadyElement ? value : { text: formatCellText(value, displayDefinition) }
  return { elementTypePluginCode, elementParameters, response }
}

export default OutcomeDetails
