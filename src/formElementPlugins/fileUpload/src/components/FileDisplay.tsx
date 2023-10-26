import React, { useState } from 'react'
import { Icon, Grid, List, Image, Message, Loader } from 'semantic-ui-react'
import { PdfModal } from '../../../../components/common/DocumentModal/DocumentModal'
import getServerUrl from '../../../../utils/helpers/endpoints/endpointUrlBuilder'
import { FileInfo } from '../ApplicationView'
import prefs from '../../config.json'
import './styles.css'

export interface FileDisplayProps {
  file: FileInfo
  onDelete: (key: string) => void
}

export const FileDisplay = ({ file, onDelete }: FileDisplayProps) => {
  const { key, loading, error, errorMessage, filename, fileData } = file
  const [open, setOpen] = useState(false)

  return (
    <List.Item className="file-item" style={{ position: 'relative', maxWidth: 150 }}>
      <PdfModal
        name={filename}
        file={getServerUrl('file', { fileId: fileData ? fileData.uniqueId : '' })}
        open={open}
        setOpen={setOpen}
      />

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
            <Grid.Row
              centered
              style={{ boxShadow: 'none' }}
              verticalAlign="top"
              onClick={() => setOpen(true)}
            >
              {/* <a href={getServerUrl('file', { fileId: fileData.uniqueId })} target="_blank"> */}
              <Image
                src={getServerUrl('file', { fileId: fileData.uniqueId, thumbnail: true })}
                style={{ maxHeight: prefs.applicationViewThumbnailHeight }}
              />
              {/* </a> */}
            </Grid.Row>
            <Grid.Row centered style={{ boxShadow: 'none' }}>
              <p style={{ wordBreak: 'break-word' }}>
                <a href={getServerUrl('file', { fileId: fileData.uniqueId })} target="_blank">
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
        className="file-delete-icon"
        style={{ position: 'absolute', right: 0, top: 0 }}
      />
    </List.Item>
  )
}
