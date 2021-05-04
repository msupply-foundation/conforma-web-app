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

const LookupTableListPage: React.FC<{ basePath: string }> = ({ basePath = '' }) => {
  const { pathname } = useRouter()
  const history = useHistory()

  const {
    allTableStructures,
    allTableStructuresLoadState,
    setAllTableStructures,
    refetchAllTableStructures,
  }: AllLookupTableStructuresType = useGetAllTableStructures()

  return (
    <Container style={{ padding: '2em 0em' }}>
      <LookUpTableListMainMenu
        headerText={'Lookup Tables'}
        subHeaderText={'This page contains the list of all lookup-tables'}
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
