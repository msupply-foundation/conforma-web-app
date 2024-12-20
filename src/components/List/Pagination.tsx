import React from 'react'
import { Pagination, Dropdown } from 'semantic-ui-react'
import { useRouter } from '../../utils/hooks/useRouter'
import { TranslateMethod } from '../../contexts/Localisation'
import { usePrefs } from '../../contexts/SystemPrefs'
import { useViewport } from '../../contexts/ViewportState'

interface PaginationProps {
  totalCount: number
  perPageText?: string
  translate: TranslateMethod
}

const PaginationBar: React.FC<PaginationProps> = ({
  totalCount,
  translate,
  perPageText = translate('LABEL_LIST_PER_PAGE'),
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

  const { isMobile, viewport } = useViewport()

  return (
    <div className="flex-column" style={{ width: '100%', alignItems: 'flex-end', gap: 10 }}>
      {totalCount > perPage && (
        <Pagination
          // totalPages={100} // Enable this to test more pages
          totalPages={Math.ceil(totalCount / perPage)}
          activePage={page}
          onPageChange={handlePageChange}
          floated="right"
          siblingRange={isMobile ? 0 : 1}
          boundaryRange={viewport.width < 410 ? 0 : 1}
        />
      )}
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
    </div>
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
