import React from 'react'
import { Container, Divider, Message } from 'semantic-ui-react'
import { Loading } from '../../components'
import { LookUpMainMenu } from '../components/single'
import { matchPath } from 'react-router'
import { useRouter } from '../../utils/hooks/useRouter'
import { ImportCsvModal } from '../components'
import { useLanguageProvider } from '../../contexts/Localisation'
import DataViewTable from '../../containers/DataDisplay/DataViewTable'
import { useGetSingleTableStructure } from '../hooks'

const LookupTablePage: React.FC<{ basePath: string }> = ({ basePath = '' }) => {
  const { t } = useLanguageProvider()
  const { pathname, params, history } = useRouter()

  const match: any = matchPath(pathname, {
    path: `${basePath}/:lookupTableID/import`,
    exact: true,
    strict: false,
  })

  const { lookupTableID: structureID } = params

  const {
    tableStructure,
    tableStructureLoadingState: { error, loading },
    refetchTableStructure,
  } = useGetSingleTableStructure(structureID)

  const { dataViewCode, displayName, id } = tableStructure ?? {}

  return (
    <React.Fragment>
      {error ? (
        <Message error header={t('LOOKUP_ERROR_TITLE')} list={[error]} />
      ) : loading ? (
        <Loading />
      ) : tableStructure ? (
        <Container style={{ padding: '2em 0em' }}>
          <LookUpMainMenu tableLabel={displayName} tableId={id} />
          <Divider />
          {dataViewCode && <DataViewTable codeFromLookupTable={dataViewCode} />}
          {!dataViewCode && <p>Lookup table has no dataViewCode defined</p>}
        </Container>
      ) : (
        <Message error header={t('LOOKUP_ERROR_NOT_FOUND')} />
      )}
      <ImportCsvModal
        tableLabel={displayName}
        dataViewCode={dataViewCode}
        tableStructureID={tableStructure?.id}
        open={match !== null}
        onClose={() => {
          match && history.replace(`${basePath}/${match.params.lookupTableID}`)
        }}
        onImportSuccess={refetchTableStructure}
      />
    </React.Fragment>
  )
}

export default LookupTablePage
