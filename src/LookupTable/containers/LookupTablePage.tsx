import React, { useEffect } from 'react'
import { Container, Divider, Message } from 'semantic-ui-react'
import { Loading } from '../../components'
import { LookUpMainMenu, LookUpTable } from '../components/single'
import { matchPath, useHistory, useParams } from 'react-router'
import { useGetSingleTableStructure } from '../hooks'
import { useRouter } from '../../utils/hooks/useRouter'
import { ImportCsvModal } from '../components'
import { useLanguageProvider } from '../../contexts/Localisation'

const LookupTablePage: React.FC<{ basePath: string }> = ({ basePath = '' }) => {
  const { strings } = useLanguageProvider()
  const { pathname } = useRouter()

  const match: any = matchPath(pathname, {
    path: `${basePath}/:lookupTableID/import`,
    exact: true,
    strict: false,
  })

  const history = useHistory()

  let { lookupTableID: structureID } = useParams<{ lookupTableID: string }>()

  const { structureLoadState, structure, getStructure, setStructureID } =
    useGetSingleTableStructure()

  const { loading, error, called }: any = structureLoadState

  useEffect(() => {
    setStructureID(Number(structureID))
  }, [structureID])

  return (
    <React.Fragment>
      {error ? (
        <Message error header={strings.LOOKUP_ERROR_TITLE} list={[error.message]} />
      ) : loading || !called ? (
        <Loading />
      ) : structure ? (
        <Container style={{ padding: '2em 0em' }}>
          <LookUpMainMenu tableLabel={structure?.name} tableId={structure?.id} />
          <Divider />
          <LookUpTable structure={structure} />
        </Container>
      ) : (
        <Message error header={strings.LOOKUP_ERROR_NOT_FOUND} />
      )}
      <ImportCsvModal
        tableLabel={structure?.name}
        tableStructureID={structure?.id}
        open={match !== null}
        onClose={() => {
          match && history.replace(`${basePath}/${match.params.lookupTableID}`)
        }}
        onImportSuccess={getStructure}
      />
    </React.Fragment>
  )
}

export default LookupTablePage
