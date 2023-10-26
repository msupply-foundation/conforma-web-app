import React, { useState } from 'react'
import { Icon, Grid, List, Image, Message, Loader } from 'semantic-ui-react'
import { DocumentModal } from '../../../../components/common/DocumentModal/DocumentModal'
import getServerUrl from '../../../../utils/helpers/endpoints/endpointUrlBuilder'
import { FileInfo } from '../ApplicationView'
import prefs from '../../config.json'
import './styles.css'

export interface FileDisplayProps {
  file: FileInfo
  onDelete: (key: string) => void
  shouldUseDocumentModal: boolean
}

export const FileDisplay = ({ file, onDelete, shouldUseDocumentModal }: FileDisplayProps) => {
  const { key, loading, error, errorMessage, filename, fileData } = file
  const [open, setOpen] = useState(false)

  const fileUrl = fileData ? getServerUrl('file', { fileId: fileData.uniqueId }) : ''
  const thumbnailUrl = fileData
    ? getServerUrl('file', { fileId: fileData.uniqueId, thumbnail: true })
    : ''

  const docOpen = () => {
    if (shouldUseDocumentModal) setOpen(true)
    else window.open(fileUrl, '_blank')
  }

  return (
    <List.Item className="file-item" style={{ position: 'relative', maxWidth: 150 }}>
      {shouldUseDocumentModal && (
        <DocumentModal filename={filename} url={fileUrl} open={open} setOpen={setOpen} />
      )}
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
              <Image
                src={thumbnailUrl}
                className="clickable"
                onClick={docOpen}
                style={{ maxHeight: prefs.applicationViewThumbnailHeight }}
              />
            </Grid.Row>
            <Grid.Row centered style={{ boxShadow: 'none' }}>
              <p
                style={{ wordBreak: 'break-word' }}
                className="clickable link-style tiny-bit-smaller-text"
                onClick={docOpen}
              >
                {filename}
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
        className="file-delete-icon"
        style={{ position: 'absolute', right: 0, top: 0 }}
      />
    </List.Item>
  )
}
