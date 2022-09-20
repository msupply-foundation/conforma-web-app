import React, { useEffect, useState } from 'react'
import { Header, Table, Message, Search } from 'semantic-ui-react'
import { Loading } from '../../components'
import { useLanguageProvider } from '../../contexts/Localisation'
import usePageTitle from '../../utils/hooks/usePageTitle'
import { useRouter } from '../../utils/hooks/useRouter'
import { useDataViewsTable } from '../../utils/hooks/useDataViews'
import { HeaderRow, DataViewTableAPIQueries, DataViewsTableResponse } from '../../utils/types'
import Markdown from '../../utils/helpers/semanticReactMarkdown'
import { constructElement, formatCellText } from './helpers'
import PaginationBar from '../../components/List/Pagination'
import buildQueryFilters from '../../utils/helpers/list/buildQueryFilters'
import useDebounce from '../../formElementPlugins/search/src/useDebounce'
import { useToast } from '../../contexts/Toast'

interface FilterObject {
  search?: string
  [key: string]: any
}

const DataViewTable: React.FC = () => {
  const { strings } = useLanguageProvider()
  const {
    query,
    location,
    updateQuery,
    params: { dataViewCode },
  } = useRouter()

  const [apiQueries, setApiQueries] = useState<DataViewTableAPIQueries>({})
  const [filter, setFilter] = useState<FilterObject>({ search: '' })
  const [searchText, setSearchText] = useState(query.search)
  const [debounceOutput, setDebounceInput] = useDebounce(searchText)
  const { dataViewTable, loading, error } = useDataViewsTable({
    dataViewCode,
    apiQueries,
    filter,
  })
  const title = location?.state?.title ?? dataViewTable?.title ?? ''
  usePageTitle(title)

  useEffect(() => {
    setApiQueries(getAPIQueryParams(query))
    setFilter(
      buildQueryFilters(query, {
        search: {
          type: 'search',
          default: false,
          visibleTo: [],
          options: {
            orFieldNames: ['name'],
          },
        },
      })
    )
  }, [query])

  useEffect(() => {
    updateQuery({ search: debounceOutput })
  }, [debounceOutput])

  if (error) {
    return <Message error header={strings.ERROR_GENERIC} content={error.message} />
  }

  return (
    <div id="data-view">
      <Header as="h3">{title}</Header>
      {dataViewTable && dataViewTable?.searchFields?.length > 0 && (
        <Search
          className="flex-grow-1"
          placeholder={strings.DATA_VIEW_SEARCH_PLACEHOLDER}
          onSearchChange={(e: any) => {
            setSearchText(e.target.value)
            setDebounceInput(e.target.value)
          }}
          input={{ icon: 'search', iconPosition: 'left' }}
          open={false}
          value={searchText}
        />
      )}
      {loading && <Loading />}
      {dataViewTable && (
        <DataViewTableContent dataViewTable={dataViewTable} apiQueries={apiQueries} />
      )}
    </div>
  )
}

export default DataViewTable

interface DataViewTableContentProps {
  dataViewTable: DataViewsTableResponse
  apiQueries: DataViewTableAPIQueries
}

const DataViewTableContent: React.FC<DataViewTableContentProps> = ({
  dataViewTable,
  apiQueries,
}) => {
  const { strings } = useLanguageProvider()
  const {
    push,
    updateQuery,
    params: { dataViewCode },
  } = useRouter()
  const showToast = useToast({ style: 'negative' })

  const { headerRow, tableRows, totalCount } = dataViewTable
  const showDetailsForRow = (id: number) => push(`/data/${dataViewCode}/${id}`)

  const sortByColumn = (
    sortColumn: string | undefined,
    columnTitle: string,
    ascending: 'true' | 'false'
  ) => {
    if (!sortColumn) {
      showToast({ text: `Column "${columnTitle}" not sortable` })
      return
    }
    updateQuery({
      sortBy: `${sortColumn}${ascending === 'true' ? ':desc' : ''}`,
    })
  }

  return (
    <div id="list-container" className="data-view-table-container">
      <Table stackable selectable sortable>
        <Table.Header>
          <Table.Row>
            {headerRow.map(({ title, columnName, sortColumn }) => (
              <Table.HeaderCell
                key={title}
                colSpan={1}
                sorted={isSorted(sortColumn, apiQueries)}
                onClick={() => sortByColumn(sortColumn, title, apiQueries?.ascending ?? 'true')}
              >
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
  )
}

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
  let ascending: 'true' | 'false' | undefined = undefined
  if (sortBy) {
    const [fieldName, direction] = sortBy.split(':')
    orderBy = fieldName
    ascending = direction === 'desc' ? 'false' : 'true'
  }
  return { first: perPage, offset, orderBy, ascending }
}

const isSorted = (sortColumn: string | undefined, apiQueries: DataViewTableAPIQueries) => {
  if (!sortColumn) return undefined
  if (sortColumn !== apiQueries.orderBy) return undefined
  return apiQueries.ascending === 'true' ? 'ascending' : 'descending'
}
