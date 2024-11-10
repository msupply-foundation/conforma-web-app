import { useState } from 'react'
import { Icon, Grid, List, Image, Message, Loader, Input } from 'semantic-ui-react'
import getServerUrl from '../../../../utils/helpers/endpoints/endpointUrlBuilder'
import { useLanguageProvider } from '../../../../contexts/Localisation'
import { useDocumentModal } from '../../../../utils/hooks/useDocumentModal/useDocumentModal'
import { FileDisplayProps } from './FileDisplay'
import prefs from '../../config.json'

interface FileDisplayDescriptionProps extends FileDisplayProps {
  description?: string
  updateDescription: (uniqueId: string, value: string, key: string) => void
}

export const FileDisplayWithDescription = ({
  file,
  onDelete,
  updateDescription,
  showDocumentModal,
  cachedFile,
}: FileDisplayDescriptionProps) => {
  const { getPluginTranslator } = useLanguageProvider()
  const t = getPluginTranslator('fileUpload')
  const { loading, error, errorMessage, filename, fileData, key } = file
  const [description, setDescription] = useState<string>(fileData?.description ?? '')

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
    <List.Item>
      <div style={{ display: 'flex', gap: 20, alignItems: 'center', paddingRight: 20 }}>
        {DocumentModal}
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
                  className="clickable link-style slightly-smaller-text"
                  onClick={handleFile}
                >
                  {filename}
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
            onClick={() => (onDelete ? onDelete(key) : () => {})}
            className="file-delete-icon"
            style={{ position: 'absolute', right: 0, top: 0 }}
          />
        </Grid>
        {fileData && (
          <Input
            fluid
            placeholder={t('ADD_DESCRIPTION')}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            onBlur={(e: any) => updateDescription(fileData.uniqueId, e.target.value, key)}
          />
        )}
      </div>
    </List.Item>
  )
}
