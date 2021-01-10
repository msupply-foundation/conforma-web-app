import { useEffect, useState } from 'react'
import { Template, useGetTemplatesQuery } from '../../utils/generated/graphql'
import { TemplatesDetails, TemplatePermissions } from '../types'

const useListTemplates = (templatePermissions: TemplatePermissions, isLoading: boolean) => {
  const [filteredTemplates, setFilteredTemplates] = useState<TemplatesDetails>([])
  const [error, setError] = useState('')

  const { data, error: apolloError, loading } = useGetTemplatesQuery({ skip: isLoading })

  useEffect(() => {
    if (apolloError) setError(apolloError.message)

    if (data && data?.templates?.nodes) {
      const allTemplates = data?.templates?.nodes as Template[]
      console.log('all', allTemplates)

      const filteredTemplates: TemplatesDetails = []
      allTemplates.forEach(({ code, name }) => {
        console.log('code', code, Object.values(templatePermissions))

        const permissionFound = Object.values(templatePermissions).find((templatePermission) => {
          console.log(
            'templatePermission',
            templatePermission,
            Object.entries(templatePermission)[0]
          )

          const [key, permissions] = Object.entries(templatePermission)[0] // TODO: Store as single Object?
          return key === code
        })
        if (permissionFound)
          filteredTemplates.push({
            name: name as string,
            code,
            permission: Object.values(permissionFound)[0],
          })
      })
      setFilteredTemplates(filteredTemplates)
    }
  }, [data, apolloError])

  return {
    error,
    loading,
    filteredTemplates,
  }
}

export default useListTemplates
