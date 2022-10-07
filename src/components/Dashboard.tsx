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
  const [loadedFiltersCount, setLoadedFiltersCount] = useState(0)
  const [totalMatchFilter, setTotalMatchFilter] = useState<{ [key: number]: number }>(
    filters.reduce((totalPerFilter, filter) => ({ ...totalPerFilter, [filter.id]: 0 }), {})
  )

  const { loading, applications } = useListApplications({
    type: templateType,
    perPage: '1000',
    sortBy: 'last-active-date',
  })

  useEffect(() => {
    if (applications) {
      filters.forEach(({ id, query, userRole }) => {
        if (typeof query === 'object') {
          const queryObj = query as { [key: string]: string }
          const filteredApplications = Object.entries(applications).filter(([_, application]) => {
            // Filter currently dilimited to single check!
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
        setLoadedFiltersCount((currentCount: number) => currentCount + 1)
      })
    }
  }, [applications])

  const userRole = (filter: Filter) =>
    filter.userRole === PermissionPolicyType.Apply ? USER_ROLES.APPLICANT : USER_ROLES.REVIEWER

  const constructLink = (filter: Filter) =>
    `/applications?type=${templateType}&user-role=${userRole(filter)}&${Object.entries(filter.query)
      .map(([key, value]) => `${key}=${value}`)
      .join('&')}`

  if (!loading && applications.length === 0) return null
  if (loadedFiltersCount < filters.length) return <LoadingSmall />

  return (
    <>
      {filters.map(
        (filter) =>
          totalMatchFilter[filter.id] > 0 && (
            <div className="filter" key={`filter_${filter.id}`}>
              <Link to={constructLink(filter)}>{`${filter.title} (${
                totalMatchFilter[filter.id]
              })`}</Link>
            </div>
          )
      )}
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
