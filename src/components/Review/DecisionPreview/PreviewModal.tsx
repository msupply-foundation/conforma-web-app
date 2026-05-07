import { useState, useEffect } from 'react'
import { Modal, Message, Button, Loader, ModalProps } from 'semantic-ui-react'
import { useLanguageProvider } from '../../../contexts/Localisation'
import { postRequest } from '../../../utils/helpers/fetchMethods'
import { getItemDisplayComponent, ActionResultPreviewData } from './PreviewItems'
import getServerUrl from '../../../utils/helpers/endpoints/endpointUrlBuilder'

interface PreviewProps extends ModalProps {
  open: boolean
  setOpen: (open: boolean) => void
  decision?: string
  reviewId?: number
  applicationDataOverride: { [key: string]: any }
  preventDownload?: boolean
  // Used by the "Preview Action" form element plugin
  applicationId?: number
  headerText?: string
  previewText?: string
}

const PreviewModal = ({
  open,
  setOpen,
  decision,
  reviewId,
  applicationDataOverride,
  applicationId,
  headerText,
  previewText,
  preventDownload = true,
}: PreviewProps) => {
  const { t } = useLanguageProvider()
  const [data, setData] = useState<ActionResultPreviewData[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (!open) {
      setData(null)
      setError(false)
      return
    }
    setLoading(true)
    fetchPreviews({ reviewId, applicationId, applicationDataOverride }).then((result) => {
      if (result.error) setError(result.error)
      else setData(result.displayData)
      setLoading(false)
    })
  }, [open])

  return (
    // closeOnDimmerClick makes it harder to accidentally close Modal, as it
    // generates new Previews every time it's opened
    <Modal id="preview-modal" open={open} closeOnDimmerClick={false}>
      <Modal.Header>{headerText || t('REVIEW_DECISION_PREVIEW_HEADER')}</Modal.Header>
      <Modal.Content scrolling>
        {previewText || t('REVIEW_DECISION_PREVIEW_TEXT')} {decision && <strong>{decision}</strong>}
        {loading && (
          <Loader active size="huge">
            {t('REVIEW_DECISION_PREVIEW_FETCHING')}
          </Loader>
        )}
        {error && (
          <Message
            error
            icon="warning sign"
            header={t('REVIEW_DECISION_PREVIEW_ERROR_HEADER')}
            content={t('REVIEW_DECISION_PREVIEW_ERROR_TEXT')}
          />
        )}
        <div id="preview-items">
          {data &&
            (data.length > 0 ? (
              data.map((item, index) => getItemDisplayComponent(item, index, preventDownload))
            ) : (
              <Message info header={t('REVIEW_DECISION_NO_PREVIEWS_AVAILABLE')} />
            ))}
        </div>
      </Modal.Content>
      <Modal.Actions>
        <Button primary onClick={() => setOpen(false)}>
          {t('BUTTON_CLOSE')}
        </Button>
      </Modal.Actions>
    </Modal>
  )
}

export default PreviewModal

const fetchPreviews = async ({
  reviewId,
  applicationId,
  applicationDataOverride,
}: {
  reviewId?: number
  applicationId?: number
  applicationDataOverride: { [key: string]: any }
}) => {
  try {
    const result = await postRequest({
      url: getServerUrl('previewActions'),
      jsonBody: { reviewId, applicationId, applicationDataOverride },
      headers: { 'Content-Type': 'application/json' },
    })
    return result
  } catch (err) {
    return { error: (err as Error).message }
  }
}
