import React from 'react'
import { NavLink } from 'react-router-dom'
import { Button, Header, Icon, Message, Popup, Table } from 'semantic-ui-react'
import { Loading } from '../../../components'
import { FieldMapType, LookUpTableType } from '../../types'
import { DownloadButton } from '..'
import { useRouter } from '../../../utils/hooks/useRouter'
import { useLanguageProvider } from '../../../contexts/Localisation'

const TABLE_PREFIX = 'data_table_'

const ListTable: React.FC<any> = ({
  allTableStructures,
  allTableStructuresLoadState,
  setAllTableStructures,
}: any) => {
  const { strings } = useLanguageProvider()
  const { loading, error } = allTableStructuresLoadState
  const {
    match: { path },
  } = useRouter()

  const handleExpansion = (lookupTable: LookUpTableType) => {
    if (!lookupTable) return
    lookupTable.isExpanded = !lookupTable.isExpanded
    setAllTableStructures(allTableStructures)
  }

  return error ? (
    <Message error header={strings.LOOKUP_ERROR_TITLE} list={[error.message]} />
  ) : loading || !allTableStructures ? (
    <Loading />
  ) : (
    <Table sortable stackable selectable>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell
            key={`lookup-table-header-title`}
            colSpan={1}
            content={strings.LOOKUP_TABLE_HEADER_NAME}
          ></Table.HeaderCell>
          <Table.HeaderCell
            key={`lookup-table-header-table-name`}
            colSpan={1}
            content={strings.LOOKUP_TABLE_HEADER_TABLE_NAME}
          ></Table.HeaderCell>
          <Table.HeaderCell
            key={`lookup-table-header-actions`}
            colSpan={2}
            content={strings.LOOKUP_TABLE_HEADER_ACTIONS}
          ></Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {allTableStructures.length > 0 ? (
          (allTableStructures as LookUpTableType[]).map((lookupTable: LookUpTableType) => (
            <React.Fragment key={`lookup-table-a-${lookupTable.id}`}>
              <Table.Row
                key={`lookup-table-${lookupTable.id}`}
                onClick={() => handleExpansion(lookupTable)}
              >
                <Table.Cell>{lookupTable.name}</Table.Cell>
                <Table.Cell>{TABLE_PREFIX + lookupTable.tableName}</Table.Cell>
                <Table.Cell collapsing>
                  <Button.Group>
                    <Popup
                      content={strings.LOOKUP_TABLE_VIEW}
                      trigger={
                        <Button icon as={NavLink} to={`${path}/${lookupTable.id}`}>
                          <Icon name="eye" />
                        </Button>
                      }
                    />
                    <Popup
                      content={strings.LOOKUP_TABLE_IMPORT}
                      trigger={
                        <Button icon as={NavLink} to={`${path}/${lookupTable.id}/import`}>
                          <Icon name="upload" />
                        </Button>
                      }
                    />
                    <DownloadButton
                      popUpContent={strings.LOOKUP_TABLE_DOWNLOAD.replace('%1', lookupTable.name)}
                      id={lookupTable.id}
                      name={lookupTable.name}
                    />
                  </Button.Group>
                </Table.Cell>
                {/* <Table.Cell icon="chevron down" collapsing /> */}
              </Table.Row>
              {lookupTable.isExpanded && (
                <Table.Row key={`table-row-detail-${lookupTable.id}`}>
                  <Table.Cell colSpan="4">
                    <Table>
                      <Table.Header>
                        <Table.Row>
                          <Table.HeaderCell content={strings.LOOKUP_TABLE_FIELD_NAME} />
                          <Table.HeaderCell content={strings.LOOKUP_TABLE_LABEL} />
                        </Table.Row>
                      </Table.Header>
                      <Table.Body>
                        {lookupTable.fieldMap.map((field: FieldMapType) => (
                          <Table.Row
                            key={`lookup-table-${lookupTable.id}-fieldMap-${field.fieldname}`}
                          >
                            <Table.Cell>{field.fieldname}</Table.Cell>
                            <Table.Cell>{field.label}</Table.Cell>
                          </Table.Row>
                        ))}
                      </Table.Body>
                    </Table>
                  </Table.Cell>
                </Table.Row>
              )}
            </React.Fragment>
          ))
        ) : (
          <Table.Row>
            <Table.Cell colSpan="4">
              <Header as="h5" icon="exclamation circle" content={strings.LOOKUP_ERROR_NOT_FOUND} />
            </Table.Cell>
          </Table.Row>
        )}
      </Table.Body>
    </Table>
  )
}

export default ListTable
