import React from 'react'
import { Header, Icon, Label, Image, Message } from 'semantic-ui-react'
import { useTemplateState } from '../../TemplateWrapper'
import { useOperationState } from '../../../shared/OperationContext'
import { useFiles } from './useFiles'

export const FileSelector: React.FC<{}> = () => {
  const { template } = useTemplateState()
  const { updateTemplate } = useOperationState()
  const { fileDetails, refetch } = useFiles()

  const addLink = async (fileId: number) => {
    await updateTemplate(template, {
      templateFileJoinsUsingId: { create: [{ fileId }] },
    })
    refetch()
  }

  const unlink = async (joinId: number) => {
    await updateTemplate(template, {
      templateFileJoinsUsingId: { deleteById: [{ id: joinId }] },
    })
    refetch()
  }

  const handleClick = (
    fileId: number | undefined,
    joinId: number | undefined,
    linkedInDatabase: boolean,
    usedInAction: boolean
  ) => {
    if (!fileId) return
    if (linkedInDatabase && !usedInAction && joinId) unlink(joinId)
    else if (!linkedInDatabase && usedInAction) addLink(fileId)
  }

  return (
    <>
      <Header as="h3">Files</Header>
      {fileDetails.length > 0 && (
        <>
          {fileDetails.map(
            ({
              id,
              unique_id,
              thumbnailUrl,
              original_filename,
              fileUrl,
              usedInAction,
              linkedInDatabase,
              missingFromDatabase,
              joinId,
            }) =>
              !missingFromDatabase ? (
                <div className="flex-row-start-center" style={{ gap: 10, minHeight: 40 }}>
                  <Image
                    src={thumbnailUrl}
                    className="clickable"
                    style={{ maxWidth: '10%', maxHeight: 30 }}
                  />
                  <span className="slightly-smaller-text" style={{ width: 300 }}>
                    <a href={fileUrl} target="_blank">
                      {original_filename}
                    </a>
                  </span>
                  <div style={{ width: 100, textAlign: 'center' }}>
                    <Label
                      size="tiny"
                      content={usedInAction ? 'Used in Action' : 'Not used'}
                      color={usedInAction ? 'teal' : 'yellow'}
                    />
                  </div>
                  <div className="flex-row-start-center">
                    <Icon
                      name="linkify"
                      className={linkedInDatabase ? '' : 'invisible'}
                      style={{ transform: 'translateY(-4px)' }}
                    />
                    {template.canEdit && (
                      <a
                        className="smaller-text clickable"
                        onClick={() => {
                          handleClick(id, joinId, linkedInDatabase, usedInAction)
                        }}
                      >
                        {linkedInDatabase && !usedInAction && 'Unlink'}
                        {!linkedInDatabase && usedInAction && 'Link'}
                      </a>
                    )}
                  </div>
                </div>
              ) : (
                <Message negative size="tiny">
                  <Icon size="large" name="exclamation triangle" />
                  An action refers to a file that doesn't exist in the database:{' '}
                  <strong>{unique_id}</strong>. Please fix this as soon as possible
                </Message>
              )
          )}
        </>
      )}
      {template.canEdit && (
        <p className="tiny-bit-smaller-text">
          Click{' '}
          <a href="/" target="_blank">
            here
          </a>{' '}
          to add or update template files
        </p>
      )}
    </>
  )
}
