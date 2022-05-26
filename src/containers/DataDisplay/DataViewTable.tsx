import React, { useEffect, useState } from 'react'
import { Header, Table, Message } from 'semantic-ui-react'
import { Loading } from '../../components'
import { useLanguageProvider } from '../../contexts/Localisation'
import usePageTitle from '../../utils/hooks/usePageTitle'
import { useRouter } from '../../utils/hooks/useRouter'
import { useDataViewsTable } from '../../utils/hooks/useDataViews'
import { HeaderRow, DataViewTableAPIQueries } from '../../utils/types'
import Markdown from '../../utils/helpers/semanticReactMarkdown'
import { constructElement, formatCellText } from './helpers'
import PaginationBar from '../../components/List/Pagination'

const DataViewTable: React.FC = () => {
  const { strings } = useLanguageProvider()
  const {
    push,
    query,
    params: { tableName },
  } = useRouter()

  const [apiQueries, setApiQueries] = useState<DataViewTableAPIQueries>({})
  const { dataViewTable, loading, error } = useDataViewsTable({
    tableName,
    apiQueries,
  })
  usePageTitle(dataViewTable?.title || '')

  useEffect(() => {
    setApiQueries(getAPIQueryParams(query))
  }, [query])

  if (error) {
    return <Message error header={strings.ERROR_GENERIC} content={error.message} />
  }
  if (loading || !dataViewTable) return <Loading />

  const showDetailsForRow = (id: number) => push(`/data/${tableName}/${id}`)

  const { headerRow, tableRows, title, totalCount } = dataViewTable

  return (
    <div id="data-view">
      <Header as="h4">{title}</Header>
      <div id="list-container" className="data-view-table-container">
        <Table stackable selectable>
          <Table.Header>
            <Table.Row>
              {headerRow.map(({ title }: any) => (
                <Table.HeaderCell key={title} colSpan={1}>
                  {title}
                </Table.HeaderCell>
              ))}
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {tableRows.map(({ id, rowValues }: { id: number; rowValues: any }) => (
              <Table.Row
                key={`row_${id}`}
                className="clickable"
                onClick={() => showDetailsForRow(id)}
              >
                {rowValues.map((value: any, index: number) => (
                  <Table.Cell key={`value_${index}`}>
                    {getCellComponent(value, headerRow[index], id)}
                  </Table.Cell>
                ))}
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
        <PaginationBar
          totalCount={totalCount}
          perPageText={strings.OUTCOMES_TABLE_PAGINATION_TEXT}
          strings={strings}
        />
      </div>
    </div>
  )
}

export default DataViewTable

// If the cell contains plugin data, return a SummaryView component, otherwise
// just format the text and return Markdown component
const getCellComponent = (value: any, columnDetails: HeaderRow, id: number) => {
  const { formatting } = columnDetails
  const { elementTypePluginCode } = formatting
  if (elementTypePluginCode) return constructElement(value, columnDetails, id)
  else return <Markdown text={formatCellText(value, columnDetails) || ''} />
}

// NOTE: This is temporary -- when we add more filtering and search
// functionality, we will build query objects the same way the list works,
// but it's overkill for this first version
const getAPIQueryParams = ({ page, perPage, sortBy }: any) => {
  const offset = page && perPage ? String((Number(page) - 1) * Number(perPage)) : undefined
  let orderBy: string | undefined = undefined
  let ascending: string | undefined = undefined
  if (sortBy) {
    const [fieldName, direction] = sortBy.split(':')
    orderBy = fieldName
    ascending = direction === 'asc' ? 'true' : 'false'
  }
  return { first: perPage, offset, orderBy, ascending }
}
