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
  const { state } = useContext(SingleTableStructureContext)
  const { called, loading, data } = state

  const [lookupTable, setLookupTable] = useState<LookUpTableType>({
    id: 0,
    name: '',
    label: '',
    fieldMap: [],
  })

  useEffect(() => {
    if (!loading && called && data.lookupTable) {
      setLookupTable(data.lookupTable)
    }
  }, [loading, called, data])

  // return error ? (
  //   <Message error header={'Error loading lookup-table'} list={[error.message]} />
  // ) :
  return loading && !called ? (
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
