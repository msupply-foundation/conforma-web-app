import { useEffect, useState } from 'react'
import { SemanticICONS } from 'semantic-ui-react'
import {
  Filter,
  PermissionPolicyType,
  Template,
  useGetTemplatesQuery,
  UiLocation,
} from '../../utils/generated/graphql'
import { TemplateCategoryDetails, TemplateInList, TemplatePermissions } from '../types'

type TemplatesByCategory = {
  templates: TemplateInList[]
  templateCategory: TemplateCategoryDetails
}[]

type TemplatesData = {
  templates: TemplateInList[]
  templatesByCategory: TemplatesByCategory
}

const emptyTemplateData = {
  templates: [],
  templatesByCategory: [],
}

const useListTemplates = (templatePermissions: TemplatePermissions, isLoading: boolean) => {
  const [templatesData, setTemplatesData] = useState<TemplatesData>(emptyTemplateData)
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
      if (filteredTemplates.length === 0) {
        setTemplatesData(emptyTemplateData)
        return setLoading(false)
      }

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
    const title = String(template?.templateCategory?.title)
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
  const { id, code, name, namePlural, icon, version } = template
  const permissions = templatePermissions[code] || []

  const totalApplications = template?.applications.totalCount || 0

  const categoryTitle: string = template?.templateCategory?.title || ''
  const categoryIcon: SemanticICONS =
    (template?.templateCategory?.icon as SemanticICONS) || undefined
  const categoryUILocation: UiLocation[] =
    (template?.templateCategory?.uiLocation as UiLocation[]) || []
  const categoryIsSubmenu = template?.templateCategory?.isSubmenu || false

  const hasApplyPermission = permissions.includes(PermissionPolicyType.Apply)
  // This is already checked (permission.length > 0), but added to avoid confusion
  const hasNonApplyPermissions = !hasApplyPermission && permissions.length > 0

  const filters = extractFilters(template, permissions)

  const result: TemplateInList = {
    id,
    code,
    name: String(name),
    version: Number(version),
    namePlural: namePlural || undefined,
    icon,
    permissions,
    filters,
    hasApplyPermission,
    hasNonApplyPermissions,
    templateCategory: {
      icon: categoryIcon,
      title: categoryTitle,
      uiLocation: categoryUILocation,
      isSubmenu: categoryIsSubmenu,
    },
    totalApplications,
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
