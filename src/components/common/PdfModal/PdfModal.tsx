import React, { useState } from 'react'
import { Document, Page } from 'react-pdf/dist/esm/entry.webpack'
import { useWindowDimensions } from '../../../utils/hooks/useWindowDimensions'
import { Icon, Modal, ModalContent, Input } from 'semantic-ui-react'
import { useDebounceCallback } from '../../../utils/hooks/useDebouncedCallback'
import './styles.css'

interface PdfModalProps {
  name: string
  file: string
  open: boolean
  setOpen: (open: boolean) => void
}

export const PdfModal: React.FC<PdfModalProps> = ({ name, file, open, setOpen }: PdfModalProps) => {
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value)
    if (value > (numPages ?? 1) || value < 0) return
    setPageInput(value || 1) // 0 falls back to 1
    debouncePageNum(value || 1)
  }

  return (
    <Modal
      closeIcon
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      style={{ width: contentWidth }}
    >
      <Modal.Header>
        <div className="flex-row-space-between-center-wrap" style={{ width: '95%' }}>
          <span style={{ marginBottom: 15, maxWidth: 700 }}>{name}</span>
          <div className="flex-row-start-center" style={{ gap: 5 }}>
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
                onChange={handleChange}
                onFocus={(e: React.FocusEvent<HTMLInputElement>) => e.target.select()}
                style={{ width: 75 }}
              />
              <span className="slightly-smaller-text"> of {numPages}</span>
            </div>
            <a href={file} target="_blank">
              <Icon className="clickable" name="external alternate" />
            </a>
            <a href={file} download>
              <Icon className="clickable" name="download" />
            </a>
          </div>
        </div>
      </Modal.Header>
      <ModalContent style={{ maxHeight: '75vh', overflow: 'scroll' }}>
        <Document file={file} onLoadSuccess={onDocumentLoadSuccess}>
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
      </ModalContent>
    </Modal>
  )
}
