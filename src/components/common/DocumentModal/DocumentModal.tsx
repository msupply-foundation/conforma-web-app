import React, { useState } from 'react'
import { Document, Page } from 'react-pdf/dist/esm/entry.webpack'
import { useWindowDimensions } from '../../../utils/hooks/useWindowDimensions'
import { Icon, Modal, ModalContent, Input, Image } from 'semantic-ui-react'
import { useDebounceCallback } from '../../../utils/hooks/useDebouncedCallback'
import { downloadFile } from '../../../utils/helpers/utilityFunctions'
import { useLanguageProvider } from '../../../contexts/Localisation'
import Loading from '../../Loading'

interface DocumentModalProps {
  filename: string
  url: string
  open: boolean
  onClose: () => void
  cachedFile?: File
}

type FileType = 'pdf' | 'image' | 'other'

export const DocumentModal: React.FC<DocumentModalProps> = ({
  filename,
  url,
  open,
  onClose,
  cachedFile,
}: DocumentModalProps) => {
  const { t } = useLanguageProvider()
  const [numPages, setNumPages] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageInput, setPageInput] = useState(1)
  const dimensions = useWindowDimensions()
  const debouncePageNum = useDebounceCallback((val: number) => setCurrentPage(val), [], 150)

  const contentWidth = Math.min(dimensions.width * 0.9, 960)
  const pdfWidth = contentWidth * 0.9

  const onDocumentLoadSuccess = ({ numPages }: any) => {
    setNumPages(numPages)
  }

  const handlePageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value)
    if (value > (numPages ?? 1) || value < 0) return
    setPageInput(value || 1) // 0 falls back to 1
    debouncePageNum(value || 1)
  }

  const fileType = getFileType(filename)

  return (
    <Modal
      closeIcon
      open={open}
      onClose={() => onClose()}
      style={{
        width: fileType === 'pdf' ? contentWidth : 'unset',
        marginLeft: 15,
        marginRight: 15,
      }}
    >
      <Modal.Header>
        <div className="flex-row-space-between-center-wrap" style={{ width: '95%', gap: 10 }}>
          <span style={{ maxWidth: 500 }}>{filename}</span>
          <div className="flex-row-start-center" style={{ gap: 5 }}>
            {fileType === 'pdf' && (
              <div
                className="flex-row-start-center"
                style={{ gap: 10, fontSize: '1rem', fontWeight: 'normal', marginRight: 15 }}
              >
                <span className="slightly-smaller-text">Jump to page</span>
                <Input
                  size="small"
                  type="number"
                  min={1}
                  max={numPages}
                  value={pageInput}
                  onChange={handlePageChange}
                  onFocus={(e: React.FocusEvent<HTMLInputElement>) => e.target.select()}
                  style={{ width: 75 }}
                />
                <span className="slightly-smaller-text"> of {numPages}</span>
              </div>
            )}
            {fileType !== 'other' && (
              <>
                <a href={url} target="_blank">
                  <Icon className="clickable" name="external alternate" />
                </a>
                <Icon
                  className="clickable link-style"
                  name="download"
                  onClick={() => downloadFile(url, filename)}
                  style={{ height: 'inherit' }}
                />
              </>
            )}
          </div>
        </div>
      </Modal.Header>
      <ModalContent style={{ maxHeight: '75vh', overflow: 'auto' }}>
        {fileType === 'pdf' && (
          <Document
            file={cachedFile ?? url}
            onLoadSuccess={onDocumentLoadSuccess}
            loading={<Loading />}
          >
            {Array.from(new Array(numPages), (_, index) => (
              <>
                <Page
                  key={`page_${index + 1}`}
                  inputRef={(ref) => {
                    if (ref && currentPage === index + 1) {
                      ref.scrollIntoView()
                    }
                  }}
                  pageNumber={index + 1}
                  width={pdfWidth}
                />
                <div style={{ marginBottom: 30 }} />
              </>
            ))}
          </Document>
        )}
        {fileType === 'image' && (
          <div className="flex-row-center-center">
            <Image src={url} />
          </div>
        )}
        {fileType === 'other' && (
          <div className="flex-column-center-center" style={{ gap: 20 }}>
            <p>{t('DOCUMENT_VIEW_NO_PREVIEW')}</p>
            <Icon
              size="massive"
              className="clickable link-style"
              name="download"
              onClick={() => downloadFile(url, filename)}
            />
          </div>
        )}
      </ModalContent>
    </Modal>
  )
}

const getFileType = (filename: string): FileType => {
  const matches = filename.match(/^.*\.(.+)$/) as RegExpMatchArray
  const fileExt = matches[1].toLowerCase()

  switch (fileExt) {
    case 'pdf':
      return 'pdf'
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
    case 'webp':
    case 'svg':
      return 'image'
    default:
      return 'other'
  }
}

// Method for File displays to handle opening the selected file. Considers the
// "useDocumentModal" preference and the file type to determine what to do.
export const handleFile = (
  shouldUseDocumentModal: boolean,
  filename: string,
  fileUrl: string,
  modalOpenMethod: () => void
) => {
  // Display in Modal
  if (shouldUseDocumentModal) modalOpenMethod()
  else {
    // Force download
    if (getFileType(filename) === 'other') downloadFile(fileUrl, filename)
    // Open in new tab
    else window.open(fileUrl, '_blank')
  }
}