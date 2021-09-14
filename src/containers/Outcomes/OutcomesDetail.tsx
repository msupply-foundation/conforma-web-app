import React from 'react'
import { Header, Form, Segment } from 'semantic-ui-react'
import { Loading } from '../../components'
import usePageTitle from '../../utils/hooks/usePageTitle'
import { useRouter } from '../../utils/hooks/useRouter'
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
import { constructElement } from './helpers'
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

export default OutcomeDetails
