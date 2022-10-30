import React from 'react'
import { Container, Divider } from 'semantic-ui-react'
import {
  ListMainMenu as LookUpTableListMainMenu,
  ListTable as LookUpTableListTable,
} from '../components/list'
import { ImportCsvModal } from '../components'
import { AllLookupTableStructuresType } from '../types'
import { useGetAllTableStructures } from '../hooks'
import { useHistory } from 'react-router'
import { useRouter } from '../../utils/hooks/useRouter'
import { useLanguageProvider } from '../../contexts/Localisation'
import usePageTitle from '../../utils/hooks/usePageTitle'

const LookupTableListPage: React.FC<{ basePath: string }> = ({ basePath = '' }) => {
  const { strings } = useLanguageProvider()
  const { pathname } = useRouter()
  const history = useHistory()
  usePageTitle(strings.LOOKUP_TABLES_TITLE)

  const {
    allTableStructures,
    allTableStructuresLoadState,
    setAllTableStructures,
    refetchAllTableStructures,
  }: AllLookupTableStructuresType = useGetAllTableStructures()

  return (
    <Container style={{ padding: '2em 0em' }}>
      <LookUpTableListMainMenu
        headerText={strings.LOOKUP_TABLES_TITLE}
        subHeaderText={strings.LOOKUP_TABLE_SUBTITLE}
      />
      <Divider />
      <LookUpTableListTable
        allTableStructures={allTableStructures}
        allTableStructuresLoadState={allTableStructuresLoadState}
        setAllTableStructures={setAllTableStructures}
      />
      <ImportCsvModal
        open={pathname === `${basePath}/import`}
        onClose={() => history.replace(`${basePath}`)}
        onImportSuccess={refetchAllTableStructures}
      />
    </Container>
  )
}

export default LookupTableListPage
