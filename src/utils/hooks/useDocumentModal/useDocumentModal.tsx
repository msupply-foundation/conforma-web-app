import { lazy, Suspense, useState } from 'react'
import 'react-pdf/dist/Page/TextLayer.css'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import { downloadFile } from '../../helpers/utilityFunctions'
import { usePrefs } from '../../../contexts/SystemPrefs'
import { Loading } from '../../../components'

interface DocumentModalProps {
  filename: string
  fileUrl: string
  showDocumentModal?: boolean
  cachedFile?: File
  preventDownload?: boolean
}

type FileType = 'pdf' | 'image' | 'other'

const DocumentModalComponent = lazy(() => import('./DocumentModal'))

export const useDocumentModal = ({
  filename,
  fileUrl,
  showDocumentModal: showDocModalProp,
  cachedFile,
  preventDownload,
}: DocumentModalProps) => {
  const [open, setOpen] = useState(false)
  const { preferences } = usePrefs()

  const showDocumentModal = showDocModalProp ?? preferences.showDocumentModal

  // Method for File displays to handle opening the selected file. Considers the
  // "showDocumentModal" preference and the file type to determine what to do.
  const handleFile = () => {
    // Display in Modal
    if (showDocumentModal) setOpen(true)
    else {
      // Force download
      if (getFileType(filename) === 'other') downloadFile(fileUrl, filename)
      // Open in new tab
      else window.open(fileUrl, '_blank')
    }
  }

  const DocumentModal = showDocumentModal ? (
    <Suspense fallback={<Loading />}>
      <DocumentModalComponent
        filename={filename}
        fileUrl={fileUrl}
        fileType={getFileType(filename)}
        open={open}
        onClose={() => setOpen(false)}
        preventDownload={preventDownload ?? false}
        cachedFile={cachedFile}
      />
    </Suspense>
  ) : null

  return { DocumentModal, handleFile }
}

const getFileType = (filename: string): FileType => {
  const matches = filename.match(/^.*\.(.+)$/) as RegExpMatchArray
  if (!matches) return 'other'
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
