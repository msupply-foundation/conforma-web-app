import React, { useState } from 'react'
import { Icon, Grid, List, Image, Message, Loader, Input } from 'semantic-ui-react'
import getServerUrl from '../../../../utils/helpers/endpoints/endpointUrlBuilder'
import { useLanguageProvider } from '../../../../contexts/Localisation'
import { FileDisplayProps } from './FileDisplay'
import prefs from '../../config.json'
import { DocumentModal } from '../../../../components/common/DocumentModal/DocumentModal'

interface FileDisplayDescriptionProps extends FileDisplayProps {
  description?: string
  updateDescription: (uniqueId: string, value: string, key: string) => void
}

export const FileDisplayWithDescription = ({
  file,
  onDelete,
  updateDescription,
  shouldUseDocumentModal,
}: FileDisplayDescriptionProps) => {
  const { getPluginTranslator } = useLanguageProvider()
  const t = getPluginTranslator('fileUpload')
  const { loading, error, errorMessage, filename, fileData, key } = file
  const [open, setOpen] = useState(false)
  const [description, setDescription] = useState<string>(fileData?.description ?? '')

  const fileUrl = fileData ? getServerUrl('file', { fileId: fileData.uniqueId }) : ''
  const thumbnailUrl = fileData
    ? getServerUrl('file', { fileId: fileData.uniqueId, thumbnail: true })
    : ''

  const docOpen = () => {
    if (shouldUseDocumentModal) setOpen(true)
    else window.open(fileUrl, '_blank')
  }

  return (
    <List.Item>
      <div style={{ display: 'flex', gap: 20, alignItems: 'center', paddingRight: 20 }}>
        {shouldUseDocumentModal && (
          <DocumentModal filename={filename} url={fileUrl} open={open} setOpen={setOpen} />
        )}
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
                  className="clickable link-style slightly-smaller-text"
                  onClick={docOpen}
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
            onClick={() => onDelete(key)}
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
