import React, { useEffect, useState } from 'react'
import { Pagination, Dropdown, Grid } from 'semantic-ui-react'
import { useRouter } from '../../utils/hooks/useRouter'

interface PaginationProps {
  totalCount: number
}

const PaginationBar: React.FC<PaginationProps> = ({ totalCount }) => {
  const { query, updateQuery } = useRouter()

  const page = Number(query?.page) || 1
  const perPage = Number(query?.perPage) || 20

  const handlePageChange = (_: any, { activePage }: any) => updateQuery({ page: activePage })

  const handlePerPageChange = (_: any, { value }: any) =>
    updateQuery({ page: calculateNewPage(page, perPage, totalCount, value), perPage: value })

  return (
    <div>
      {/* <Grid.Row>
          <Grid.Column width={5} floated="right"> */}
      {totalCount > perPage && (
        <Pagination
          totalPages={Math.ceil(totalCount / perPage)}
          activePage={page}
          onPageChange={handlePageChange}
          // style={{ marginBottom: '10px' }}
          floated="right"
        />
      )}
      {/* </Grid.Column>
        </Grid.Row> */}
      {/* <Grid.Row verticalAlign="middle"> */}
      {/* <Grid.Column textAlign="right" width={6} floated="right"> */}
      <p>Applications per page:</p>
      {/* </Grid.Column>
          <Grid.Column floated="right" width={1}> */}
      <Dropdown
        selection
        compact
        options={[
          { key: 2, text: '2', value: 2 },
          { key: 5, text: '5', value: 5 },
          { key: 10, text: '10', value: 10 },
          { key: 20, text: '20', value: 20 },
          { key: 50, text: '50', value: 50 },
        ]}
        value={perPage}
        onChange={handlePerPageChange}
        style={{ minWidth: 20 }}
      />
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
