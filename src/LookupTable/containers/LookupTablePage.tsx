import React, { useContext, useEffect } from 'react'
import { Container, Divider, Message } from 'semantic-ui-react'
import { Loading } from '../../components'
import { LookUpMainMenu, LookUpTable } from '../components/single'
import { withImportCsvModal } from '../components/hocs'
import { SingleTableStructureContext } from '../contexts'
import { useParams } from 'react-router'
import { SingleTableProvider } from '../contexts'

const LookupTablePage: React.FC = (props: any) => {
  let { lookupTableID: structureID } = useParams<{ lookupTableID: string }>()
  const { structureLoadState, structure, setStructureID } = useContext(SingleTableStructureContext)

  useEffect(() => {
    setStructureID(Number(structureID))
  }, [structureID])

  const { called, loading, error } = structureLoadState

  return error ? (
    <Message error header={'Error loading lookup-table'} list={[error.message]} />
  ) : loading || !called || !structure.id ? (
    <Loading />
  ) : structure.id !== 0 ? (
    <Container style={{ padding: '2em 0em' }}>
      <LookUpMainMenu structure={structure} />
      <Divider />
      <SingleTableProvider>
        <LookUpTable structure={structure} />
      </SingleTableProvider>
    </Container>
  ) : (
    <Message error header={'No lookup table found'} />
  )
}

export default withImportCsvModal(LookupTablePage)
