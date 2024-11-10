import { useState } from 'react'
import { Icon, Accordion, Image } from 'semantic-ui-react'
import { useLanguageProvider } from '../../../contexts/Localisation'
import { useDocumentModal } from '../../../utils/hooks/useDocumentModal/useDocumentModal'
import MarkdownBlock from '../../../utils/helpers/semanticReactMarkdown'
import { ActionQueueStatus } from '../../../utils/generated/graphql'
import getServerUrl from '../../../utils/helpers/endpoints/endpointUrlBuilder'

interface ResultCommon {
  status: ActionQueueStatus
  displayString: string
  errorLog: string | null
}

interface NotificationPreviewData extends ResultCommon {
  type: 'NOTIFICATION'
  text: string
}

interface DocumentPreviewData extends ResultCommon {
  type: 'DOCUMENT'
  fileId: string
  filename: string
}

interface GenericPreviewData extends ResultCommon {
  type: 'OTHER'
  text: string
}

export type ActionResultPreviewData =
  | NotificationPreviewData
  | DocumentPreviewData
  | GenericPreviewData

const NotificationPreview = ({ item }: { item: NotificationPreviewData }) => {
  const { t } = useLanguageProvider()
  const [open, setOpen] = useState(false)
  return (
    <Accordion className="item notification-preview" style={{}}>
      <Accordion.Title active={open} onClick={() => setOpen(!open)}>
        <Icon name="dropdown" />
        {t('REVIEW_PREVIEW_NOTIFICATION')} <strong>{item.displayString}</strong>
      </Accordion.Title>
      <Accordion.Content active={open}>
        <MarkdownBlock text={item.text} />
      </Accordion.Content>
    </Accordion>
  )
}

const DocumentPreview = ({ item }: { item: DocumentPreviewData }) => {
  const { displayString, fileId, filename } = item
  const fileUrl = getServerUrl('file', { fileId })
  const thumbnailUrl = getServerUrl('file', { fileId, thumbnail: true })
  const { DocumentModal, handleFile } = useDocumentModal({
    filename,
    fileUrl,
    preventDownload: true,
  })

  return (
    <>
      {DocumentModal}
      <div className="item document-preview" onClick={handleFile}>
        <Image src={thumbnailUrl} className="clickable" style={{ maxHeight: 50 }} />
        <p className="clickable link-style">{displayString}</p>
      </div>
    </>
  )
}

const FallbackPreview = ({ item }: { item: GenericPreviewData }) => {
  return (
    <div className="item fallback-preview">
      <p>
        {item.displayString}
        <br />
        <pre>{item.text}</pre>
      </p>
    </div>
  )
}

const ErrorPreview = ({ item }: { item: ActionResultPreviewData }) => {
  const { t } = useLanguageProvider()
  return (
    <div className="item error-item">
      <p>
        <span style={{ color: 'red' }}>{t('REVIEW_PREVIEW_ERROR')}</span> <em>{item.errorLog}</em>
      </p>
    </div>
  )
}

export const getItemDisplayComponent = (item: ActionResultPreviewData, index: number) => {
  if (item.status === 'FAIL') return <ErrorPreview item={item} key={index} />
  if (item.type === 'NOTIFICATION') return <NotificationPreview item={item} key={index} />
  if (item.type === 'DOCUMENT') return <DocumentPreview item={item} key={index} />
  return <FallbackPreview item={item} key={index} />
}
