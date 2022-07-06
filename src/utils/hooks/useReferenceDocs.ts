import { useEffect, useState } from 'react'
import { useGetRefDocsQuery } from '../generated/graphql'

interface RefDoc {
  uniqueId: string
  description: string
}

export const useReferenceDocs = () => {
  const [referenceDocs, setReferenceDocs] = useState<RefDoc[]>([])
  const { data, loading, error } = useGetRefDocsQuery()

  useEffect(() => {
    if (!data || error) return

    if (data.files?.nodes) setReferenceDocs(data.files?.nodes as RefDoc[])
  }, [data, loading, error])

  return { referenceDocs, loading, error }
}
