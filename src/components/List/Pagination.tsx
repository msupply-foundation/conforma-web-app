import React from 'react'
import { Pagination, Dropdown, Grid } from 'semantic-ui-react'
import { useRouter } from '../../utils/hooks/useRouter'
import { LanguageStrings } from '../../contexts/Localisation'
import { usePrefs } from '../../contexts/SystemPrefs'

interface PaginationProps {
  totalCount: number
  perPageText?: string
  strings: LanguageStrings
}

const PaginationBar: React.FC<PaginationProps> = ({
  totalCount,
  strings,
  perPageText = strings.LABEL_LIST_PER_PAGE,
}) => {
  const { preferences } = usePrefs()
  const { query, updateQuery } = useRouter()

  const paginationPresets = preferences?.paginationPresets ?? [2, 5, 10, 20, 50]
  const defaultPaginationValue = preferences?.paginationDefault ?? 20
  const page = Number(query?.page) || 1
  const perPage = Number(query?.perPage) || defaultPaginationValue

  const handlePageChange = (_: any, { activePage }: any) => updateQuery({ page: activePage })

  const handlePerPageChange = (_: any, { value }: any) =>
    updateQuery({ page: calculateNewPage(page, perPage, totalCount, value), perPage: value })

  return (
    <Grid container>
      <Grid.Row>
        <Grid.Column width={5} floated="right">
          {totalCount > perPage && (
            <Pagination
              // totalPages={15} // Enable this to test more pages
              totalPages={Math.ceil(totalCount / perPage)}
              activePage={page}
              onPageChange={handlePageChange}
              floated="right"
            />
          )}
        </Grid.Column>
      </Grid.Row>
      <Grid.Row>
        <Grid.Column textAlign="right" width={6} floated="right">
          <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
            <span style={{ padding: 5 }}>{`${perPageText}:`}</span>
            <Dropdown
              selection
              compact
              floated="right"
              options={paginationPresets.map((value: number) => ({
                key: value,
                text: String(value),
                value,
              }))}
              value={perPage}
              onChange={handlePerPageChange}
              style={{ minWidth: 20 }}
            />
          </div>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  )
}

export default PaginationBar

const calculateNewPage = (
  page: number,
  perPage: number,
  totalCount: number,
  newPerPage: number
) => {
  const firstItem = perPage * (page - 1) + 1
  const newTotalPages = Math.ceil(totalCount / newPerPage)
  const newPage = Math.floor((firstItem / totalCount) * newTotalPages)
  return newPage === 0 ? 1 : newPage
}
