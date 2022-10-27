import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Header, Button, Icon, Label } from 'semantic-ui-react'
import { useUserState } from '../contexts/UserState'
import { useLanguageProvider } from '../contexts/Localisation'
import { USER_ROLES } from '../utils/data'
import { PermissionPolicyType, Filter, UiLocation } from '../utils/generated/graphql'
import useListApplications from '../utils/hooks/useListApplications'
import useListTemplates from '../utils/hooks/useListTemplates'
import usePageTitle from '../utils/hooks/usePageTitle'
import { TemplateDetails, TemplateInList } from '../utils/types'
import LoadingSmall from './LoadingSmall'
import { constructOrObjectFilters } from '../utils/helpers/utilityFunctions'

const Dashboard: React.FC = () => {
  const { strings } = useLanguageProvider()
  const {
    userState: { templatePermissions, isNonRegistered },
    logout,
  } = useUserState()
  const {
    templatesData: { templatesByCategory },
  } = useListTemplates(templatePermissions, false)
  if (isNonRegistered) {
    logout()
    return null
  }

  usePageTitle(strings.PAGE_TITLE_HOME)

  return (
    <div id="dashboard">
      <Header as="h2" content={strings.MENU_ITEM_DASHBOARD} />
      {templatesByCategory
        .filter(({ templateCategory: { uiLocation } }) => uiLocation.includes(UiLocation.Dashboard))
        .map(({ templates, templateCategory: { icon: categoryIcon, title: categoryTitle } }) => (
          <div key={categoryTitle} className="template-category">
            <div className="title">
              {categoryIcon && <Icon size="large" color="grey" name={categoryIcon} />}
              <Header as="h4">{categoryTitle}</Header>
            </div>
            <div className="templates">
              {templates.map((template) => (
                <TemplateComponent key={template.code} template={template} />
              ))}
            </div>
          </div>
        ))}
    </div>
  )
}

const TemplateComponent: React.FC<{ template: TemplateInList }> = ({ template }) => {
  const { strings } = useLanguageProvider()
  const { name, code, hasApplyPermission, filters, permissions, totalApplications } = template

  const userRole =
    permissions.filter((type) => type === PermissionPolicyType.Apply).length > 0
      ? USER_ROLES.APPLICANT
      : USER_ROLES.REVIEWER

  return (
    <div className="template">
      <div className="content">
        <div className="filters">
          <Label className="strong-label clickable">
            <a href={`/applications?type=${code}&user-role=${userRole}`}>
              {template?.namePlural || `${name} ${strings.LABEL_APPLICATIONS}`}
            </a>
            <Icon name="chevron right" />
          </Label>
          <PanelComponent key={`${template?.id}_filters`} template={template} filters={filters} />
        </div>
        {totalApplications === 0 && hasApplyPermission && <StartNewTemplate template={template} />}
      </div>
      <div>
        {totalApplications > 0 && hasApplyPermission && (
          <Button as={Link} to={`/application/new?type=${code}`} inverted color="blue">
            <Icon name="plus" size="tiny" color="blue" />
            {strings.BUTTON_DASHBOARD_NEW}
          </Button>
        )}
      </div>
    </div>
  )
}

const PanelComponent: React.FC<{
  template: TemplateDetails
  filters: Filter[]
}> = ({ template, filters }) => {
  const templateType = template.code
  const [totalMatchFilter, setTotalMatchFilter] = useState<{ [key: number]: number }>(
    filters.reduce((totalPerFilter, filter) => ({ ...totalPerFilter, [filter.id]: 0 }), {})
  )

  const filterObjectArray = filters.reduce((arrayFilters: { [key: string]: string }[], element) => {
    if (element.query !== null) {
      const queryObj = element.query
      arrayFilters.push(queryObj)
    }
    return arrayFilters
  }, [])

  const graphQLFilterObject = {
    templateCode: { equalToInsensitive: templateType },
    ...constructOrObjectFilters(filterObjectArray),
  }

  const { loading, applications } = useListApplications(
    {}, // Passing empty as graphQLFilterObject is already constructed
    graphQLFilterObject
  )

  useEffect(() => {
    if (applications) {
      filters.forEach(({ id, query }) => {
        if (query !== null) {
          const queryObj = query
          const filteredApplications = Object.entries(applications).filter(([_, application]) => {
            // Each filter is currently limited to a single check!
            const key = Object.keys(queryObj)[0]
            const value = Object.values(queryObj)[0]
            switch (key) {
              case 'outcome':
                return application.outcome === value
              case 'status':
                return application.status === value
              case 'reviewerAction':
                return application.reviewerAction === value
              case 'assignerAction':
                return application.assignerAction === value
              default:
                return false
            }
          })
          totalMatchFilter[id] = filteredApplications.length
        }
        setTotalMatchFilter(totalMatchFilter)
      })
    }
  }, [applications])

  const userRole = (filter: Filter) =>
    filter.userRole === PermissionPolicyType.Apply ? USER_ROLES.APPLICANT : USER_ROLES.REVIEWER

  const constructLink = (filter: Filter) =>
    `/applications?type=${templateType}&user-role=${userRole(filter)}&${Object.entries(filter.query)
      .map(([key, value]) => `${key}=${value}`)
      .join('&')}`

  if (loading) return <LoadingSmall />
  if (applications.length === 0) return null

  return (
    <>
      {filters.map((filter) => {
        console.log(
          'filter',
          filter,
          'totalMatch',
          totalMatchFilter,
          'matching',
          totalMatchFilter[filter.id]
        )

        return totalMatchFilter[filter.id] > 0 ? (
          <Link to={constructLink(filter)}>{`${filter.title} (${
            totalMatchFilter[filter.id]
          })`}</Link>
        ) : null
      })}
    </>
  )
}

const StartNewTemplate: React.FC<{ template: TemplateInList }> = ({ template: { name, code } }) => {
  const { strings } = useLanguageProvider()
  return (
    <div className="no-applications">
      <Label className="simple-label" content={strings.LABEL_DASHBOARD_NO_APPLICATIONS} />
      <Link to={`/application/new?type=${code}`}>
        {strings.LABEL_DASHBOARD_START_NEW.replace('%1', name)}
      </Link>
    </div>
  )
}

export default Dashboard
