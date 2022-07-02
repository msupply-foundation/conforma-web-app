import React, { useState, useEffect } from 'react'
import { Modal, Message, Button, Loader, ModalProps } from 'semantic-ui-react'
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
  const [data, setData] = useState<ActionResultPreviewData[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (!open) {
      setData(null)
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
      <Modal.Header>Preview Decision Documentation</Modal.Header>
      <Modal.Content>
        Here is a preview of documents and correspondence that will be sent to the applicant as a
        result of the decision: <strong>{decision}</strong>
        {loading && (
          <Loader active size="huge">
            Fetching previews...
          </Loader>
        )}
        {error && (
          <Message
            error
            icon="warning sign"
            header="Something went wrong"
            content="There was a problem generating previews"
          />
        )}
        <div id="preview-items">
          {data &&
            (data.length > 0 ? (
              data.map((item, index) => getItemDisplayComponent(item, index))
            ) : (
              <Message info header="No previews available" />
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
