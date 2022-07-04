import React, { useState } from 'react'
import { Button, Icon, Grid, List, Image, Message, Segment, Loader, Input } from 'semantic-ui-react'
import { FileResponseData, FileInfo } from '../ApplicationView'
import { FileDisplayProps } from './FileDisplay'
import prefs from '../../config.json'

interface FileDisplayDescriptionProps extends FileDisplayProps {
  description?: string
  updateDescription: (uniqueId: string, value: string, key: string) => void
}

export const FileDisplayWithDescription = ({
  file,
  onDelete,
  downloadUrl,
  updateDescription,
}: FileDisplayDescriptionProps) => {
  const { loading, error, errorMessage, filename, fileData, key } = file
  const [description, setDescription] = useState<string>(fileData?.description ?? '')
  return (
    <List.Item>
      {fileData && (
        <div style={{ display: 'flex', gap: 20, alignItems: 'center', paddingRight: 20 }}>
          <Grid
            verticalAlign="top"
            celled
            className="file-item"
            style={{ position: 'relative', boxShadow: 'none', maxWidth: '30%' }}
          >
            {error && (
              <>
                <Grid.Row
                  centered
                  style={{ boxShadow: 'none', height: 120, padding: 10 }}
                  verticalAlign="middle"
                >
                  <Message negative compact>
                    <p>{errorMessage}</p>
                  </Message>
                </Grid.Row>
                <Grid.Row centered style={{ boxShadow: 'none' }}>
                  <p style={{ wordBreak: 'break-word' }}>{filename}</p>
                </Grid.Row>
              </>
            )}
            {loading && (
              <>
                <Grid.Row
                  centered
                  style={{ boxShadow: 'none', height: 120 }}
                  verticalAlign="middle"
                >
                  <Loader active size="medium">
                    Uploading
                  </Loader>
                </Grid.Row>
                <Grid.Row centered style={{ boxShadow: 'none' }}>
                  <p style={{ wordBreak: 'break-word' }}>{filename}</p>
                </Grid.Row>
              </>
            )}
            {fileData && (
              <>
                <Grid.Row centered style={{ boxShadow: 'none' }} verticalAlign="top">
                  <a href={downloadUrl + fileData.fileUrl} target="_blank">
                    <Image
                      src={downloadUrl + fileData.thumbnailUrl}
                      style={{ maxHeight: prefs.applicationViewThumbnailHeight }}
                    />
                  </a>
                </Grid.Row>
                <Grid.Row centered style={{ boxShadow: 'none' }}>
                  <p style={{ wordBreak: 'break-word', fontSize: '90%' }}>
                    <a href={downloadUrl + fileData.fileUrl} target="_blank">
                      {filename}
                    </a>
                  </p>
                </Grid.Row>
              </>
            )}
            <Icon
              link
              name="delete"
              circular
              fitted
              color="grey"
              onClick={() => onDelete(key)}
              className="delete-icon"
              style={{ position: 'absolute', right: 0, top: 0 }}
            />
          </Grid>
          {fileData && (
            <Input
              fluid
              placeholder={'Add description'}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onBlur={(e: any) => updateDescription(fileData.uniqueId, e.target.value, key)}
            />
          )}
        </div>
      )}
    </List.Item>
  )
}
