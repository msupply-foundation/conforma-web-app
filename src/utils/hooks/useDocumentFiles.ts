import { useEffect, useState } from 'react'
import { useUserState } from '../../contexts/UserState'
import { File } from '../generated/graphql'
import getServerUrl from '../helpers/endpoints/endpointUrlBuilder'
import { getRequest } from '../helpers/fetchMethods'
import { User } from '../types'

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
  const {
    userState: { currentUser },
  } = useUserState()

  useEffect(() => {
    setLoading(true)
    getRequest(getServerUrl('files', options))
      .then((docs) => setDocs(docs))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  const intReferenceDocs = shouldSeeMenuDocs(currentUser, 'internal')
    ? docs.filter((doc) => doc.isInternalReferenceDoc)
    : []
  const extReferenceDocs = shouldSeeMenuDocs(currentUser, 'external')
    ? docs.filter((doc) => doc.isExternalReferenceDoc)
    : []

  return { docs, intReferenceDocs, extReferenceDocs, loading, error }
}

// - Admin can see both "Help" & "Reference" menu
// - Internal users only see "Reference" menu
// - External users only see "Help" menu
const shouldSeeMenuDocs = (user: User | null, type: 'internal' | 'external') => {
  if (!user) return false
  if (user?.isAdmin) return true
  if (!user.organisation) return type === 'external'
  return type === 'internal' ? user.organisation.isSystemOrg : !user.organisation.isSystemOrg
}
