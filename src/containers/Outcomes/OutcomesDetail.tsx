import React from 'react'
import { Header, Message, Label, Icon, Table } from 'semantic-ui-react'
import { Loading, NoMatch } from '../../components'
import usePageTitle from '../../utils/hooks/usePageTitle'
import { useRouter } from '../../utils/hooks/useRouter'
import { ErrorResponse, useOutcomesDetail } from '../../utils/hooks/useOutcomes'
import { useLanguageProvider } from '../../contexts/Localisation'
import Markdown from '../../utils/helpers/semanticReactMarkdown'
import { DisplayDefinition, LinkedApplication } from '../../utils/types'
import { constructElement, formatCellText } from './helpers'
import ApplicationLinks from './ApplicationLinks'

const OutcomeDetails: React.FC = () => {
  const { strings } = useLanguageProvider()
  const {
    push,
    params: { tableName, id },
  } = useRouter()
  const { outcomeDetail, loading, error } = useOutcomesDetail({ tableName, recordId: id })
  usePageTitle(outcomeDetail?.header?.value || '')

  if (error) return <NoMatch header={error?.message} message={error?.detail} />
  if (loading || !outcomeDetail) return <Loading />

  const { header, tableTitle, columns, displayDefinitions, item, linkedApplications } =
    outcomeDetail

  const linkedApplicationsError = getLinkedApplicationsError(linkedApplications)
  if (linkedApplicationsError)
    console.error(linkedApplicationsError.message + '\n' + linkedApplicationsError?.detail)

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
                  <Table.Cell key={`${columnName}_${index}_key`} textAlign="right">
                    <strong>{displayDefinitions[columnName].title}</strong>
                  </Table.Cell>
                  <Table.Cell key={`${columnName}_${index}_val`}>
                    {getCellComponent(item[columnName], displayDefinitions[columnName], item.id)}
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>
      </div>
      {linkedApplicationsError && (
        <Message error header={strings.ERROR_GENERIC} content={linkedApplicationsError.message} />
      )}
      {!linkedApplicationsError && linkedApplications && (
        <ApplicationLinks linkedApplications={linkedApplications as LinkedApplication[]} />
      )}
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

const getLinkedApplicationsError = (
  linkedApplications: LinkedApplication[] | [ErrorResponse] | undefined
): ErrorResponse | false =>
  linkedApplications && (linkedApplications[0] as ErrorResponse)?.error
    ? (linkedApplications[0] as ErrorResponse)
    : false
