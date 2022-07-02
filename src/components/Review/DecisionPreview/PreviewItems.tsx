import React, { useState } from 'react'
import { Icon, Accordion, Image } from 'semantic-ui-react'
import { useLanguageProvider } from '../../../contexts/Localisation'
import MarkdownBlock from '../../../utils/helpers/semanticReactMarkdown'
import { ActionQueueStatus } from '../../../utils/generated/graphql'
import config from '../../../config'

const fileEndpoint = `${config.serverREST}/public/file?uid=`

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
  const { strings } = useLanguageProvider()
  const [open, setOpen] = useState(false)
  return (
    <Accordion className="item notification-preview" style={{}}>
      <Accordion.Title active={open} onClick={() => setOpen(!open)}>
        <Icon name="dropdown" />
        {strings.REVIEW_PREVIEW_NOTIFICATION} <strong>{item.displayString}</strong>
      </Accordion.Title>
      <Accordion.Content active={open} className="content">
        <MarkdownBlock text={item.text} />
      </Accordion.Content>
    </Accordion>
  )
}

const DocumentPreview = ({ item }: { item: DocumentPreviewData }) => {
  return (
    <div className="item document-preview">
      <Image src={fileEndpoint + item.fileId + '&thumbnail=true'} style={{ maxHeight: 50 }} />
      <p>
        <a href={fileEndpoint + item.fileId} target="_blank">
          {item.displayString}
        </a>
      </p>
    </div>
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
  const { strings } = useLanguageProvider()
  return (
    <div className="item error-item">
      <p>
        <span style={{ color: 'red' }}>{strings.REVIEW_PREVIEW_ERROR}</span>{' '}
        <em>{item.errorLog}</em>
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
