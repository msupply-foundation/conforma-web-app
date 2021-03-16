import React, { useEffect, useState } from 'react'
import { gql, useQuery } from '@apollo/client'
import { NavLink, useParams } from 'react-router-dom'
import { Container, Menu, Header, Button, Icon, Divider, Message } from 'semantic-ui-react'
import { Loading } from '../../components'
import { LookUpTable } from '../components'
import { LookUpTableType } from '../types'
import { WithLookupTableUploadModal } from '../hocs'
import { getLookUpTableStructureByTableId } from '../graphql'

const LookupTablePage: React.FC = () => {
  let { lookupTableID } = useParams<{ lookupTableID: string }>()
  const [lookupTable, setLookupTable] = useState<LookUpTableType>({
    id: 0,
    name: '',
    label: '',
    fieldMap: [],
  })

  const { loading, error, data } = useQuery(getLookUpTableStructureByTableId, {
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
      <Menu borderless secondary>
        <Menu.Item>
          <Header>
            Lookup Table: {lookupTable.label}
            <Header.Subheader>View individual lookup-table and its contents</Header.Subheader>
          </Header>
        </Menu.Item>
        <Menu.Item position="right">
          <Button.Group>
            <Button icon as={NavLink} labelPosition="left" to="/lookup-tables">
              <Icon name="arrow alternate circle left" />
              Back
            </Button>
            <Button icon labelPosition="left" href="#">
              <Icon name="upload" />
              Import
            </Button>
            <Button icon labelPosition="right" href="#">
              <Icon name="download" />
              Export
            </Button>
          </Button.Group>
        </Menu.Item>
      </Menu>
      <Divider />
      <LookUpTable structure={lookupTable} />
    </Container>
  ) : (
    <Message error header={'No lookup table found'} />
  )
}

export default WithLookupTableUploadModal(LookupTablePage)
