import React from 'react'
import { Header, Icon, Label, Image, Grid, GridRow, GridColumn } from 'semantic-ui-react'
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
      {template.canEdit && (
        <Grid style={{ maxWidth: 800, marginBottom: 10 }}>
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
            }) => (
              <GridRow columns={4} verticalAlign="middle">
                <GridColumn width={1}>
                  {!missingFromDatabase ? (
                    <Image src={thumbnailUrl} className="clickable" style={{ maxHeight: 30 }} />
                  ) : (
                    <Icon name="exclamation triangle" />
                  )}
                </GridColumn>
                <GridColumn width={6} style={{ padding: 0 }}>
                  {!missingFromDatabase ? (
                    <a href={fileUrl} target="_blank" className="slightly-smaller-text">
                      {original_filename}
                    </a>
                  ) : (
                    `Missing from database: ${unique_id}`
                  )}
                </GridColumn>
                {!missingFromDatabase ? (
                  <>
                    <GridColumn width={2} textAlign="center" style={{ padding: 0 }}>
                      <Label
                        size="tiny"
                        content={usedInAction ? 'Used in Action' : 'Not used'}
                        color={usedInAction ? 'teal' : 'yellow'}
                      />
                    </GridColumn>
                    <GridColumn width={3} textAlign="center">
                      <div className="flex-row-start-center">
                        <Icon
                          name="linkify"
                          className={linkedInDatabase ? '' : 'invisible'}
                          style={{ transform: 'translateY(-4px)' }}
                        />
                        <a
                          className="smaller-text clickable"
                          onClick={() => {
                            handleClick(id, joinId, linkedInDatabase, usedInAction)
                          }}
                        >
                          {linkedInDatabase && !usedInAction && 'Unlink'}
                          {!linkedInDatabase && usedInAction && 'Link'}
                        </a>
                      </div>
                    </GridColumn>
                  </>
                ) : (
                  <GridColumn width={3}>Please fix...</GridColumn>
                )}
              </GridRow>
            )
          )}
          <p>Click here to add or update template files</p>
        </Grid>
      )}
    </>
  )
}
