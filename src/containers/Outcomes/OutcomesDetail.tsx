import React from 'react'
import { Header, Form, Segment, Label, Icon, Table } from 'semantic-ui-react'
import { Loading } from '../../components'
import usePageTitle from '../../utils/hooks/usePageTitle'
import { useRouter } from '../../utils/hooks/useRouter'
import { useOutcomesDetail } from '../../utils/hooks/useOutcomes'
import Markdown from '../../utils/helpers/semanticReactMarkdown'
import { DisplayDefinition, HeaderRow } from '../../utils/types'
import { constructElement, formatCellText } from './helpers'
import ApplicationLinks from './ApplicationLinks'

const OutcomeDetails: React.FC = () => {
  const {
    push,
    params: { tableName, id },
  } = useRouter()
  const { outcomeDetail, loading, error } = useOutcomesDetail({ tableName, recordId: id })
  usePageTitle(outcomeDetail?.header.value || '')

  if (error) return <p>{error?.message}</p>
  if (loading || !outcomeDetail) return <Loading />

  const { header, tableTitle, columns, displayDefinitions, item, linkedApplications } =
    outcomeDetail

  return (
    <div id="outcomes-display">
      <div className="outcome-nav">
        <Label
          className="back-label clickable"
          onClick={() => push(`/outcomes/${tableName}`)}
          content={
            <>
              <Icon name="chevron left" className="dark-grey" />
              {tableTitle}
            </>
          }
        />
      </div>
      <div className="outcome-detail-container">
        <Header as="h2">{header.value}</Header>
        <div className="outcome-detail-table">
          <Table celled stackable striped>
            <Table.Body>
              {columns.map((columnName, index) => (
                <Table.Row key={`row_${columnName}`}>
                  <Table.Cell key={`${columnName}_${index}`} textAlign="right">
                    <strong>{displayDefinitions[columnName].title}</strong>
                  </Table.Cell>
                  <Table.Cell key={`${columnName}_${index}`}>
                    {getCellComponent(item[columnName], displayDefinitions[columnName], item.id)}
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>
      </div>
      {linkedApplications && <ApplicationLinks linkedApplications={linkedApplications} />}
    </div>
  )
}

export default OutcomeDetails

const getCellComponent = (value: any, columnDetails: DisplayDefinition, id: number) => {
  const { formatting } = columnDetails
  const { elementTypePluginCode } = formatting
  if (elementTypePluginCode) return constructElement(value, columnDetails, id)
  else return <Markdown text={formatCellText(value, columnDetails) || ''} />
}
