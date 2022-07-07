import { useEffect, useState } from 'react'
import { useGetRefDocsQuery } from '../generated/graphql'
import { User } from '../types'

interface RefDoc {
  uniqueId: string
  description: string
  isInternalReferenceDoc: boolean
  isExternalReferenceDoc: boolean
}

export const useReferenceDocs = (currentUser: User | null, isAdmin: boolean) => {
  const [intReferenceDocs, setIntReferenceDocs] = useState<RefDoc[]>([])
  const [extReferenceDocs, setExtReferenceDocs] = useState<RefDoc[]>([])
  const { data, loading, error } = useGetRefDocsQuery()

  useEffect(() => {
    setExtReferenceDocs([])
    setIntReferenceDocs([])
    if (!currentUser) {
      return
    }
    if (!data || error) return

    if (data.files?.nodes) {
      if (shouldSeeInternalDocs(currentUser, isAdmin))
        setIntReferenceDocs(
          (data.files?.nodes as RefDoc[]).filter((doc) => doc.isInternalReferenceDoc)
        )
      if (shouldSeeExternalDocs(currentUser, isAdmin))
        setExtReferenceDocs(
          (data.files?.nodes as RefDoc[]).filter((doc) => doc.isExternalReferenceDoc)
        )
    }
  }, [data, loading, error, currentUser])

  return { intReferenceDocs, extReferenceDocs, loading, error }
}

const shouldSeeInternalDocs = (user: User, isAdmin: boolean): boolean => {
  if (isAdmin) return true
  if (!user?.organisation) return false
  return user.organisation.isSystemOrg
}

const shouldSeeExternalDocs = (user: User, isAdmin: boolean): boolean => {
  if (isAdmin) return true
  if (!user?.organisation) return true
  return !user.organisation.isSystemOrg
}
