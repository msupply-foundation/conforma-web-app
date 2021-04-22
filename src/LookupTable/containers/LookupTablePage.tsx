import React, { useContext, useEffect } from 'react'
import { Container, Divider, Message } from 'semantic-ui-react'
import { Loading } from '../../components'
import { LookUpMainMenu, LookUpTable } from '../components/single'
import { SingleTableStructureContext } from '../contexts'
import { useParams } from 'react-router'
import { SingleTableProvider } from '../contexts'
import { withImportCsvModal } from '../components/hocs'

const LookupTablePage: React.FC = (props: any) => {
  let { lookupTableID: structureID } = useParams<{ lookupTableID: string }>()
  const { structureLoadState, structure, setStructureID } = useContext(SingleTableStructureContext)

  useEffect(() => {
    setStructureID(Number(structureID))
  }, [structureID])

  const { loading, error } = structureLoadState

  return error ? (
    <Message error header={'Error loading lookup-table'} list={[error.message]} />
  ) : loading || !structure?.id ? (
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
