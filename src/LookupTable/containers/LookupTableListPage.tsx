import React from 'react'
import { Container, Divider } from 'semantic-ui-react'
import LookUpTableMainMenu from '../components/list/HeaderMenu'
import LookUpTableList from '../components/list/LookUpTableListTable'
import { WithLookupTableUploadModal } from '../hocs'

const LookupTableListPage: React.FC = () => {
  return (
    <Container style={{ padding: '2em 0em' }}>
      <LookUpTableMainMenu
        headerText={'Lookup Tables'}
        subHeaderText={'This page contains the list of all lookup-tables'}
      />
      <Divider />
      <LookUpTableList />
    </Container>
  )
}

export default WithLookupTableUploadModal(LookupTableListPage)
