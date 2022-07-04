import React from 'react'
import { Icon, Grid, List, Image, Message, Loader } from 'semantic-ui-react'
import { FileInfo } from '../ApplicationView'
import prefs from '../../config.json'
import './styles.css'

export interface FileDisplayProps {
  file: FileInfo
  onDelete: (key: string) => void
  downloadUrl: string
}

export const FileDisplay = ({ file, onDelete, downloadUrl }: FileDisplayProps) => {
  const { key, loading, error, errorMessage, filename, fileData } = file
  return (
    <List.Item className="file-item" style={{ position: 'relative', maxWidth: 150 }}>
      <Grid verticalAlign="top" celled style={{ boxShadow: 'none' }}>
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
            <Grid.Row centered style={{ boxShadow: 'none', height: 120 }} verticalAlign="middle">
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
              <p style={{ wordBreak: 'break-word' }}>
                <a href={downloadUrl + fileData.fileUrl} target="_blank">
                  {filename}
                </a>
              </p>
            </Grid.Row>
          </>
        )}
      </Grid>
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
    </List.Item>
  )
}
