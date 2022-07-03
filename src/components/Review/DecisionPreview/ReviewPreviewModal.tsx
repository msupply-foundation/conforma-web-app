import React, { useState, useEffect } from 'react'
import { Modal, Message, Button, Loader, ModalProps } from 'semantic-ui-react'
import { useLanguageProvider } from '../../../contexts/Localisation'
import { postRequest } from '../../../utils/helpers/fetchMethods'
import config from '../../../config'
import { getItemDisplayComponent, ActionResultPreviewData } from './PreviewItems'

interface PreviewProps extends ModalProps {
  open: boolean
  setOpen: (open: boolean) => void
  decision: string
  reviewId: number
  previewData: { [key: string]: any }
}

const previewEndpoint = `${config.serverREST}/preview-actions`

const ReviewPreviewModal: React.FC<PreviewProps> = ({
  open,
  setOpen,
  decision,
  reviewId,
  previewData,
}) => {
  const { strings } = useLanguageProvider()
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
    fetchPreviews(reviewId, previewData).then((result) => {
      if (result.error) setError(result.error)
      else setData(result.displayData)
      setLoading(false)
    })
  }, [open])

  return (
    <Modal id="preview-modal" open={open} closeOnDimmerClick={false}>
      <Modal.Header>{strings.REVIEW_DECISION_PREVIEW_HEADER}</Modal.Header>
      <Modal.Content>
        {strings.REVIEW_DECISION_PREVIEW_TEXT} <strong>{decision}</strong>
        {loading && (
          <Loader active size="huge">
            {strings.REVIEW_DECISION_PREVIEW_FETCHING}
          </Loader>
        )}
        {error && (
          <Message
            error
            icon="warning sign"
            header={strings.REVIEW_DECISION_PREVIEW_ERROR_HEADER}
            content={strings.REVIEW_DECISION_PREVIEW_ERROR_TEXT}
          />
        )}
        <div id="preview-items">
          {data &&
            (data.length > 0 ? (
              data.map((item, index) => getItemDisplayComponent(item, index))
            ) : (
              <Message info header={strings.REVIEW_DECISION_NO_PREVIEWS_AVAILABLE} />
            ))}
        </div>
      </Modal.Content>
      <Modal.Actions>
        <Button primary onClick={() => setOpen(false)}>
          Close
        </Button>
      </Modal.Actions>
    </Modal>
  )
}

export default ReviewPreviewModal

const fetchPreviews = async (reviewId: number, previewData: { [key: string]: any }) => {
  const JWT = localStorage.getItem(config.localStorageJWTKey)
  try {
    const result = await postRequest({
      url: previewEndpoint,
      jsonBody: { reviewId, previewData },
      headers: { Authorization: `Bearer ${JWT}`, 'Content-Type': 'application/json' },
    })
    return result
  } catch (err) {
    return { error: err.message }
  }
}
