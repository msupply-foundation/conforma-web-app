import { useEffect, useState } from 'react'
import { File } from '../generated/graphql'
import getServerUrl from '../helpers/endpoints/endpointUrlBuilder'
import { getRequest } from '../helpers/fetchMethods'

export type FileData = Pick<
  File,
  | 'uniqueId'
  | 'description'
  | 'filePath'
  | 'originalFilename'
  | 'thumbnailPath'
  | 'timestamp'
  | 'isExternalReferenceDoc'
  | 'isInternalReferenceDoc'
  | 'isOutputDoc'
>

interface FileListProps {
  applicationId?: number
  outputOnly?: boolean
  external?: boolean
  internal?: boolean
}

export const useDocumentFiles = (options: FileListProps) => {
  const [docs, setDocs] = useState<FileData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>()

  useEffect(() => {
    setLoading(true)
    getRequest(getServerUrl('files', options))
      .then((docs) => setDocs(docs))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  const extReferenceDocs = docs.filter((doc) => doc.isExternalReferenceDoc)
  const intReferenceDocs = docs.filter((doc) => doc.isInternalReferenceDoc)

  return { docs, extReferenceDocs, intReferenceDocs, loading, error }
}
