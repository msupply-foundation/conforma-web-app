import React from 'react'
import strings from '../../utils/constants'
import { Header, Table } from 'semantic-ui-react'
import { useRouter } from '../../utils/hooks/useRouter'
import { Link } from 'react-router-dom'
import { ApplicationDisplayField, LinkedApplication } from '../../utils/types'
import { formatCellText } from './helpers'

// These can be modified if we want more/different columns in linked application
// list
const displayFields: ApplicationDisplayField[] = [
  {
    field: 'name',
    displayName: strings.APP_LINK_NAME,
    dataType: 'character varying',
    link: '/application/',
    linkVar: 'serial',
  },
  {
    field: 'serial',
    displayName: strings.APP_LINK_SERIAL,
    dataType: 'character varying',
    link: '/application/',
    linkVar: 'serial',
  },
  {
    field: 'templateName',
    displayName: strings.APP_LINK_TYPE,
    dataType: 'character varying',
    link: '/applications?type=',
    linkVar: 'templateCode',
  },
  {
    field: 'dateCompleted',
    displayName: strings.APP_LINK_COMPLETED,
    dataType: 'timestamp with time zone',
    link: null,
  },
]

const ApplicationLinks: React.FC<{ linkedApplications: LinkedApplication[] }> = ({
  linkedApplications,
}) => {
  const { push } = useRouter()

  return (
    <>
      <Header as="h4">{strings.APP_LINK_LINKED_APPLICATIONS}</Header>
      <div id="list-container">
        <Table sortable stackable selectable>
          <Table.Header>
            <Table.Row>
              {displayFields.map(({ field, displayName }, index) => (
                <Table.HeaderCell key={`${field}_${index}`} colSpan={1}>
                  {displayName}
                </Table.HeaderCell>
              ))}
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {linkedApplications.map((application) => {
              const { id, templateCode } = application
              return (
                <Table.Row key={`${templateCode}_${id}`}>
                  {displayFields.map(({ field, dataType, link, linkVar }, index) => (
                    <Table.Cell key={`${id}_${field}_${index}`}>
                      {link && linkVar ? (
                        <Link to={link + application[linkVar]}>
                          {formatCellText(application[field], { dataType, formatting: {} })}
                        </Link>
                      ) : (
                        formatCellText(application[field], { dataType, formatting: {} })
                      )}
                    </Table.Cell>
                  ))}
                </Table.Row>
              )
            })}
          </Table.Body>
        </Table>
      </div>
    </>
  )
}

export default ApplicationLinks
