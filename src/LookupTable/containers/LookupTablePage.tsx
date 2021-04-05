import React, { useContext, useEffect, useState } from 'react'
import { useQuery } from '@apollo/client'
import { useParams } from 'react-router-dom'
import { Container, Divider, Message } from 'semantic-ui-react'
import { Loading } from '../../components'
import { LookUpMainMenu, LookUpTable } from '../components/single'
import { LookUpTableType } from '../types'
import { withImportCsvModal } from '../components/hocs'
import { SingleTableStructureContext } from '../contexts/SingleTableStructureContext'

const LookupTablePage: React.FC = () => {
  const { state, lookupTable } = useContext(SingleTableStructureContext)
  const { called, loading } = state

  console.log('lookupTable => ', loading, called, lookupTable)

  // return error ? (
  //   <Message error header={'Error loading lookup-table'} list={[error.message]} />
  // ) :
  return loading && !called && !lookupTable.id ? (
    <Loading />
  ) : lookupTable.id !== 0 ? (
    <Container style={{ padding: '2em 0em' }}>
      <LookUpMainMenu tableName={lookupTable.label} />
      <Divider />
      <LookUpTable structure={lookupTable} />
    </Container>
  ) : (
    <Message error header={'No lookup table found'} />
  )
}

export default withImportCsvModal(LookupTablePage)
