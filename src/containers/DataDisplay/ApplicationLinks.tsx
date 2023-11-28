import React from 'react'
import { useLanguageProvider } from '../../contexts/Localisation'
import { Header, Table } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import { ApplicationDisplayField, LinkedApplication } from '../../utils/types'
import { formatCellText } from './helpers'
import { useViewport } from '../../contexts/ViewportState'
import { TableCellMobileLabelWrapper } from '../../utils/tables/TableCellMobileLabelWrapper'

// These can be modified if we want more/different columns in linked application
// list
const useDisplayFields = () => {
  const { t } = useLanguageProvider()
  const displayFields: ApplicationDisplayField[] = [
    {
      field: 'name',
      displayName: t('APP_LINK_NAME'),
      dataType: 'string',
      link: '/application/',
      linkVar: 'serial',
    },
    {
      field: 'serial',
      displayName: t('APP_LINK_SERIAL'),
      dataType: 'string',
      link: '/application/',
      linkVar: 'serial',
    },
    {
      field: 'templateName',
      displayName: t('APP_LINK_TYPE'),
      dataType: 'string',
      link: '/applications?type=',
      linkVar: 'templateCode',
    },
    {
      field: 'dateCompleted',
      displayName: t('APP_LINK_COMPLETED'),
      dataType: 'Date',
      link: null,
    },
  ]
  return displayFields
}

const ApplicationLinks: React.FC<{ linkedApplications: LinkedApplication[] }> = ({
  linkedApplications,
}) => {
  const { t } = useLanguageProvider()
  const displayFields = useDisplayFields()
  const { isMobile } = useViewport()
  return (
    <div id="linked-applications-container">
      <Header as="h4">{t('APP_LINK_LINKED_APPLICATIONS')}</Header>
      <Table stackable selectable>
        {!isMobile && (
          <Table.Header>
            <Table.Row>
              {displayFields.map(({ field, displayName }, index) => (
                <Table.HeaderCell key={`${field}_${index}`} colSpan={1}>
                  {displayName}
                </Table.HeaderCell>
              ))}
            </Table.Row>
          </Table.Header>
        )}
        <Table.Body>
          {linkedApplications.map((application) => {
            const { id, templateCode } = application
            return (
              <Table.Row key={`${templateCode}_${id}`}>
                {displayFields.map(({ field, dataType, link, linkVar, displayName }, index) => (
                  <Table.Cell key={`${id}_${field}_${index}`}>
                    <TableCellMobileLabelWrapper minLabelWidth={110} label={displayName}>
                      {link && linkVar ? (
                        <Link to={link + application[linkVar]}>
                          {formatCellText(application[field], { dataType, formatting: {} })}
                        </Link>
                      ) : (
                        formatCellText(application[field], { dataType, formatting: {} })
                      )}
                    </TableCellMobileLabelWrapper>
                  </Table.Cell>
                ))}
              </Table.Row>
            )
          })}
        </Table.Body>
      </Table>
    </div>
  )
}

export default ApplicationLinks
