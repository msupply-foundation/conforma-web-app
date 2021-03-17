import React, { useEffect, useState } from 'react'
import { useQuery } from '@apollo/client'
import { useParams } from 'react-router-dom'
import { Container, Divider, Message } from 'semantic-ui-react'
import { Loading } from '../../components'
import { LookUpMainMenu, LookUpTable } from '../components/single'
import { LookUpTableType } from '../types'
import { getTableStructureId } from '../graphql'
import { withImportCsvModal } from '../components/hocs'

const LookupTablePage: React.FC = () => {
  let { lookupTableID } = useParams<{ lookupTableID: string }>()
  const [lookupTable, setLookupTable] = useState<LookUpTableType>({
    id: 0,
    name: '',
    label: '',
    fieldMap: [],
  })

  const { loading, error, data } = useQuery(getTableStructureId, {
    skip: !lookupTableID,
    variables: { lookupTableID: Number(lookupTableID) },
    fetchPolicy: 'no-cache',
  })

  useEffect(() => {
    if (!loading && data.lookupTable) {
      setLookupTable(data.lookupTable)
    }
  }, [loading, data])

  return error ? (
    <Message error header={'Error loading lookup-table'} list={[error.message]} />
  ) : loading ? (
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
