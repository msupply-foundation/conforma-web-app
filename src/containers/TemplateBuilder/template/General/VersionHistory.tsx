import { Header, Button, Table } from 'semantic-ui-react'
import { useRouter } from '../../../../utils/hooks/useRouter'
import { useOperationState } from '../../shared/OperationContext'
import { useTemplateState } from '../TemplateWrapper'
import { DateTime } from 'luxon'
import { getVersionString, isTemplateUnlocked } from '../helpers'
import useConfirmationModal from '../../../../utils/hooks/useConfirmationModal'
import { useToast } from '../../../../contexts/Toast'

export const VersionHistory = () => {
  const { deleteTemplate, commitTemplate } = useOperationState()
  const { template, refetch } = useTemplateState()
  const { canEdit } = template
  const { replace } = useRouter()
  const { ConfirmModal: DeleteConfirm, showModal: confirmDelete } = useConfirmationModal({
    type: 'warning',
  })
  const { showToast } = useToast({ style: 'success' })

  return (
    <div className="template-builder-section">
      <div className="spacer-20" />
      <div className="spacer-20" />
      <Header className="no-margin-no-padding" as="h3">
        Version History
      </Header>
      <Table stackable>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell key="num" width={1}>
              No.
            </Table.HeaderCell>
            <Table.HeaderCell key="timestamp" width={5}>
              Timestamp
            </Table.HeaderCell>
            <Table.HeaderCell key="versionId" width={3}>
              Version ID
            </Table.HeaderCell>
            <Table.HeaderCell key="comment">Comment</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          <Table.Row>
            <Table.Cell>{template.versionHistory.length + 1}</Table.Cell>
            <Table.Cell>
              {template.versionTimestamp.toLocaleString(DateTime.DATETIME_MED)}
            </Table.Cell>
            <Table.Cell style={{ fontStyle: canEdit ? 'italic' : 'normal' }}>
              {getVersionString(template, false)}
            </Table.Cell>
            <Table.Cell>
              <div className="flex-row-space-between-center">
                {isTemplateUnlocked(template) ? (
                  <>
                    <em>Not yet committed or exported</em>
                    <Button
                      primary
                      inverted
                      size="small"
                      onClick={() => {
                        commitTemplate(template, refetch)
                      }}
                    >
                      Commit now
                    </Button>
                  </>
                ) : (
                  template.versionComment
                )}
              </div>
            </Table.Cell>
          </Table.Row>
          {template.versionHistory.map((version) => (
            <Table.Row key={version.versionId}>
              <Table.Cell>{version.number}</Table.Cell>
              <Table.Cell>
                {DateTime.fromISO(version.timestamp).toLocaleString(DateTime.DATETIME_MED)}
              </Table.Cell>
              <Table.Cell>{version.versionId}</Table.Cell>
              <Table.Cell>{version.comment}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
      <DeleteConfirm />
      {template.applicationCount === 0 && (
        <Button
          primary
          onClick={() =>
            confirmDelete({
              title: 'Delete template?',
              message: 'This will permanently remove this version of the template from the system',
              onConfirm: async () => {
                await deleteTemplate(template.id)
                replace('/admin/templates')
                showToast({
                  title: 'Template deleted',
                  text: `${template.code} - ${getVersionString(template)}`,
                })
              },
              awaitAction: true,
            })
          }
        >
          Delete this version
        </Button>
      )}
    </div>
  )
}
