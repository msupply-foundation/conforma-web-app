import { useEffect, useState } from 'react'
import {
  Filter,
  PermissionPolicyType,
  Template,
  useGetTemplatesQuery,
} from '../../utils/generated/graphql'
import constants from '../constants'
import { TemplateCategoryDetails, TemplateInList, TemplatePermissions } from '../types'

type TemplatesByCategory = {
  templates: TemplateInList[]
  templateCategory: TemplateCategoryDetails
}[]

type TemplatesData = {
  templates: TemplateInList[]
  templatesByCategory: TemplatesByCategory
}

const useListTemplates = (templatePermissions: TemplatePermissions, isLoading: boolean) => {
  const [templatesData, setTemplatesData] = useState<TemplatesData>({
    templates: [],
    templatesByCategory: [],
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  const { data, error: apolloError } = useGetTemplatesQuery({
    skip: isLoading,
    fetchPolicy: 'network-only',
  })

  useEffect(() => {
    if (apolloError) {
      setError(apolloError.message)
      setLoading(false)
    }

    if (data?.templates?.nodes) {
      const filteredTemplates = (data?.templates?.nodes || []).filter(
        (template) => templatePermissions[String(template?.code)]
      ) as Template[]
      if (filteredTemplates.length === 0) return setLoading(false)

      const templates = filteredTemplates.map((template) =>
        convertFromTemplateToTemplateDetails(template, templatePermissions)
      )

      setTemplatesData({
        templates,
        templatesByCategory: getTemplatesByCategory(templates),
      })

      setLoading(false)
    }
  }, [data, apolloError, templatePermissions])

  return {
    error,
    loading,
    templatesData,
  }
}

const getTemplatesByCategory = (templates: TemplateInList[]) => {
  const templatesByCategoryObject: { [categoryTitle: string]: TemplateInList[] } = {}
  templates.forEach((template) => {
    const title = String(template?.templateCategory?.categoryTitle)
    if (!templatesByCategoryObject[title]) templatesByCategoryObject[title] = []
    templatesByCategoryObject[title].push(template)
  })

  return Object.values(templatesByCategoryObject).map((templates) => ({
    templates,
    templateCategory: templates[0].templateCategory as TemplateCategoryDetails,
  }))
}

const convertFromTemplateToTemplateDetails = (
  template: Template,
  templatePermissions: TemplatePermissions
) => {
  const { id, code, name } = template
  const permissions = templatePermissions[code] || []

  let categoryTitle: string = template?.templateCategory?.title || ''
  let categoryIcon: string
  if (!categoryTitle) {
    categoryIcon = constants.DEFAULT_TEMPLATE_CATEGORY_ICON
    categoryTitle = constants.DEFAULT_TEMPLATE_CATEGORY_TITLE
  } else {
    categoryIcon = template?.templateCategory?.icon || ''
  }

  const hasApplyPermission = permissions.includes(PermissionPolicyType.Apply)
  // This is already checked (permission.length > 0), but added to avoid confusion
  const hasNonApplyPermissions = !hasApplyPermission && permissions.length > 0

  const filters = extractFilters(template, permissions)

  const result: TemplateInList = {
    id,
    code,
    name: String(name),
    permissions,
    filters,
    hasApplyPermission,
    hasFilters: filters.length > 0,
    hasNonApplyPermissions,
    templateCategory: {
      categoryIcon,
      categoryTitle,
    },
  }

  return result
}

const extractFilters = (template: Template, permissions: PermissionPolicyType[]) => {
  const templateFilters = template?.templateFilterJoins?.nodes?.map(
    (templateFilterJoin) => templateFilterJoin?.filter
  )

  const userRoleFilters = templateFilters?.filter((templateFilter) =>
    permissions.find((permission) => permission === templateFilter?.userRole)
  )

  return (userRoleFilters || []) as Filter[]
}

export default useListTemplates
