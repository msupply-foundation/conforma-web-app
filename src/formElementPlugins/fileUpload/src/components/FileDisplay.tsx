import React from 'react'
import { Icon, Grid, List, Image, Message, Loader } from 'semantic-ui-react'
import { useLanguageProvider } from '../../../../contexts/Localisation'
import getServerUrl from '../../../../utils/helpers/endpoints/endpointUrlBuilder'
import { useDocumentModal } from '../../../../utils/hooks/useDocumentModal'
import { FileInfo } from '../ApplicationView'
import prefs from '../../config.json'
import './styles.css'

export interface FileDisplayProps {
  file: FileInfo
  onDelete?: (key: string) => void
  showDocumentModal: boolean
  cachedFile?: File
}

export const FileDisplay = ({
  file,
  onDelete,
  showDocumentModal,
  cachedFile,
}: FileDisplayProps) => {
  const { getPluginTranslator } = useLanguageProvider()
  const t = getPluginTranslator('fileUpload')
  const { key, loading, error, errorMessage, filename, fileData } = file

  const fileUrl = fileData ? getServerUrl('file', { fileId: fileData.uniqueId }) : ''
  const thumbnailUrl = fileData
    ? getServerUrl('file', { fileId: fileData.uniqueId, thumbnail: true })
    : ''

  const { DocumentModal, handleFile } = useDocumentModal({
    filename,
    fileUrl,
    showDocumentModal,
    cachedFile,
  })

  return (
    <List.Item className="file-item" style={{ position: 'relative', maxWidth: 150 }}>
      {DocumentModal}
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
                {t('FILE_UPLOADING')}
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
                onClick={handleFile}
                style={{ maxHeight: prefs.applicationViewThumbnailHeight }}
              />
            </Grid.Row>
            <Grid.Row centered style={{ boxShadow: 'none' }}>
              <p
                style={{ wordBreak: 'break-word' }}
                className="clickable link-style tiny-bit-smaller-text"
                onClick={() => handleFile()}
              >
                {filename}
              </p>
            </Grid.Row>
          </>
        )}
      </Grid>
      {onDelete && (
        <Icon
          link
          name="delete"
          circular
          fitted
          color="grey"
          onClick={() => (onDelete ? onDelete(key) : () => {})}
          className="file-delete-icon"
          style={{ position: 'absolute', right: 0, top: 0 }}
        />
      )}
    </List.Item>
  )
}
