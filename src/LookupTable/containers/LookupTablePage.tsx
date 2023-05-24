import React, { useState, useEffect } from 'react'
import { Container, Divider, Message } from 'semantic-ui-react'
import { Loading } from '../../components'
import { LookUpMainMenu, LookUpTable } from '../components/single'
import { matchPath } from 'react-router'
import { useRouter } from '../../utils/hooks/useRouter'
import { ImportCsvModal } from '../components'
import { useLanguageProvider } from '../../contexts/Localisation'
import DataViewTable from '../../containers/DataDisplay/DataViewTable'
import { useGetLookupTableStructureByIdQuery } from '../../utils/generated/graphql'
import { LookUpTableType } from '../types'

const LookupTablePage: React.FC<{ basePath: string }> = ({ basePath = '' }) => {
  const { t } = useLanguageProvider()

  const { pathname, params, history } = useRouter()
  const [structure, setStructure] = useState<LookUpTableType>()

  const match: any = matchPath(pathname, {
    path: `${basePath}/:lookupTableID/import`,
    exact: true,
    strict: false,
  })

  const { lookupTableID: structureID } = params

  const { data, loading, error, refetch } = useGetLookupTableStructureByIdQuery({
    variables: { lookupTableID: Number(structureID) },
    fetchPolicy: 'network-only',
  })

  useEffect(() => {
    if (data?.dataTable) {
      const lookupTable = data.dataTable as LookUpTableType
      setStructure(lookupTable)
    }
  }, [data])

  const dataViewCode = structure?.dataViewCode

  return (
    <React.Fragment>
      {error ? (
        <Message error header={t('LOOKUP_ERROR_TITLE')} list={[error.message]} />
      ) : loading ? (
        <Loading />
      ) : structure ? (
        <Container style={{ padding: '2em 0em' }}>
          <LookUpMainMenu tableLabel={structure?.displayName} tableId={structure?.id} />
          <Divider />
          {/* Show data view table if defined, otherwise default table display */}
          {dataViewCode && <DataViewTable codeFromLookupTable={dataViewCode} />}
          {!structure.dataViewCode && <LookUpTable structure={structure} />}
        </Container>
      ) : (
        <Message error header={t('LOOKUP_ERROR_NOT_FOUND')} />
      )}
      <ImportCsvModal
        tableLabel={structure?.displayName}
        tableStructureID={structure?.id}
        open={match !== null}
        onClose={() => {
          match && history.replace(`${basePath}/${match.params.lookupTableID}`)
        }}
        onImportSuccess={refetch}
      />
    </React.Fragment>
  )
}

export default LookupTablePage
