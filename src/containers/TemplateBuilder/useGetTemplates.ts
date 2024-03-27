import { DateTime } from 'luxon'
import { useState, useEffect } from 'react'
import { TemplateStatus, useGetAllTemplatesQuery } from '../../utils/generated/graphql'

export interface VersionObject {
  versionId: string
  timestamp: string
  number: number
  parentVersionId: string | null
  comment: string | null
}

export type Template = {
  name: string
  status: TemplateStatus
  id: number
  code: string
  priority: number | null
  category: string
  categoryPriority: number | null
  versionId: string
  versionComment: string | null
  versionTimestamp: DateTime
  parentVersionId: string | null
  versionHistory: VersionObject[]
  applicationCount: number
}
export type Templates = {
  main: Template
  totalApplicationCount: number
  numberOfVersions: number
  others: Template[]
}[]

const useGetTemplates = () => {
  const [templates, setTemplates] = useState<Templates>([])

  const { data, error, refetch } = useGetAllTemplatesQuery({ fetchPolicy: 'network-only' })

  useEffect(() => {
    if (data && !error) {
      const templates: Templates = []

      const templateNodes = data?.templates?.nodes || []
      templateNodes.forEach((template) => {
        if (
          !template?.code ||
          !template.name ||
          !template.status ||
          !template?.versionId ||
          !template?.versionTimestamp
        ) {
          console.log('failed to load template', template)
          return
        }

        const {
          code,
          name,
          status,
          id,
          versionId,
          parentVersionId = null,
          versionTimestamp,
          versionComment = null,
          versionHistory = [],
          priority = null,
          templateCategory,
          applications,
        } = template
        const holder = templates.find(({ main }) => main.code === code)

        const current = {
          name,
          status,
          id,
          code,
          priority,
          category: templateCategory?.title || '',
          categoryPriority: templateCategory?.priority ?? null,
          versionId,
          parentVersionId,
          versionComment,
          versionHistory,
          versionTimestamp: DateTime.fromISO(versionTimestamp),
          applicationCount: applications.totalCount || 0,
        }

        if (!holder)
          return templates.push({
            main: current,
            totalApplicationCount: current.applicationCount,
            numberOfVersions: 1,
            others: [current],
          })
        const { main, others } = holder

        if (
          status === TemplateStatus.Available ||
          (main.status !== TemplateStatus.Available &&
            main.versionTimestamp < current.versionTimestamp)
        )
          holder.main = current
        others.push(current)

        holder.totalApplicationCount += current.applicationCount
        holder.numberOfVersions = others.length
      })

      // Don't include the "main" version in the "others", and order by most
      // recent
      templates.forEach((template) => {
        template.others = template.others.filter(({ id }) => id !== template.main.id).reverse()
      })

      setTemplates(templates)
    }
  }, [data])

  return {
    error,
    templates,
    refetch,
  }
}

export default useGetTemplates
