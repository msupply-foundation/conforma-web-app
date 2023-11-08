import React, { useState, useEffect, Dispatch, SetStateAction } from 'react'
import { Link } from 'react-router-dom'
import { Header, Button, Icon, Label, SemanticICONS } from 'semantic-ui-react'
import { useUserState } from '../contexts/UserState'
import { useLanguageProvider } from '../contexts/Localisation'
import { USER_ROLES } from '../utils/data'
import {
  PermissionPolicyType,
  Filter,
  UiLocation,
  useGetFilteredApplicationCountQuery,
  ApplicationListShapeFilter,
} from '../utils/generated/graphql'
import useListTemplates from '../utils/hooks/useListTemplates'
import usePageTitle from '../utils/hooks/usePageTitle'
import { TemplateInList } from '../utils/types'
import LoadingSmall from './LoadingSmall'
import { constructOrObjectFilters } from '../utils/helpers/utilityFunctions'

const Dashboard: React.FC = () => {
  const { t } = useLanguageProvider()
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

  usePageTitle(t('PAGE_TITLE_HOME'))

  // The login page auto-zooms the viewport when entering the form, which makes
  // the Dashboard page too zoomed-in on load. This just resets that.
  const viewport = document.querySelector('meta[name=viewport]')
  if (viewport)
    viewport.setAttribute('content', 'initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0')

  setTimeout(() => {
    if (viewport)
      viewport.setAttribute('content', 'initial-scale=1.0, minimum-scale=1.0, maximum-scale=10')
  }, 2000)

  const dashboardCategories = templatesByCategory.filter(({ templateCategory: { uiLocation } }) =>
    uiLocation.includes(UiLocation.Dashboard)
  )

  return (
    <div id="dashboard">
      <Header as="h2" content={t('MENU_ITEM_DASHBOARD')} />
      {dashboardCategories.map(({ templates, templateCategory: { icon, title, code } }) => (
        <CategoryComponent
          key={code}
          templates={templates}
          icon={icon as SemanticICONS}
          title={title}
        />
      ))}
    </div>
  )
}

const CategoryComponent: React.FC<{
  templates: TemplateInList[]
  icon: SemanticICONS
  title: string
}> = ({ templates, icon, title }) => {
  const [readyToDisplay, setReadyToDisplay] = useState(
    templates.some((t) => t.dashboardRestrictions === null)
  )

  return (
    <div key={title} className={`template-category${readyToDisplay ? '' : ' hidden-element'}`}>
      <div className="title">
        {icon && <Icon size="large" color="grey" name={icon} />}
        <Header as="h4">{title}</Header>
      </div>
      <div className="templates">
        {templates.map((template) => (
          <TemplateComponent key={template.code} template={template} setReady={setReadyToDisplay} />
        ))}
      </div>
    </div>
  )
}

const TemplateComponent: React.FC<{
  template: TemplateInList
  setReady: Dispatch<SetStateAction<boolean>>
}> = ({ template, setReady }) => {
  const { t } = useLanguageProvider()
  const {
    userState: { currentUser },
  } = useUserState()
  const [filterCounts, setFilterCounts] = useState<{ [key: string]: number }>({})

  const {
    name,
    code,
    hasApplyPermission,
    filters,
    permissions,
    totalApplications,
    dashboardRestrictions,
  } = template

  const userRole =
    permissions.filter((type) => type === PermissionPolicyType.Apply).length > 0
      ? USER_ROLES.APPLICANT
      : USER_ROLES.REVIEWER

  const shouldHide = dashboardRestrictions
    ? checkRestrictions(dashboardRestrictions, filterCounts)
    : false

  if (!shouldHide) setReady(true)

  return (
    <div className={`template${shouldHide ? ' hidden-element' : ''}`}>
      <div className="content">
        <div className="filters">
          <Label className="strong-label clickable">
            <a href={`/applications?type=${code}&user-role=${userRole}`}>
              {template?.namePlural || t('LABEL_APPLICATIONS', name)}
            </a>
            <Icon name="chevron right" />
          </Label>
          {filters.map((filter) => (
            <FilterComponent
              key={filter.code}
              template={template}
              filter={filter}
              userId={currentUser?.userId ?? 0}
              setReadyFilters={setFilterCounts}
            />
          ))}
          {Object.keys(filterCounts).length !== filters.length && <LoadingSmall />}
        </div>
        {totalApplications === 0 && hasApplyPermission && <StartNewTemplate template={template} />}
      </div>
      <div>
        {totalApplications > 0 && hasApplyPermission && (
          <Button as={Link} to={`/application/new?type=${code}`} inverted color="blue">
            <Icon name="plus" size="tiny" color="blue" />
            {t('BUTTON_DASHBOARD_NEW')}
          </Button>
        )}
      </div>
    </div>
  )
}

const FilterComponent: React.FC<{
  template: TemplateInList
  filter: Filter
  userId: number
  setReadyFilters: Dispatch<SetStateAction<{ [key: string]: number }>>
}> = ({ template, filter, userId, setReadyFilters }) => {
  const { t } = useLanguageProvider()

  const gqlFilter: ApplicationListShapeFilter = {
    templateCode: { equalTo: template.code },
    ...constructOrObjectFilters([filter.query]),
  }

  const { error, loading, data } = useGetFilteredApplicationCountQuery({
    variables: {
      filter: gqlFilter,
      userId,
    },
  })

  const appCount = data?.applicationList?.totalCount

  useEffect(() => {
    if (!loading && appCount !== undefined)
      setReadyFilters((prev) => ({ ...prev, [filter.code]: appCount }))
  }, [loading])

  if (error) return <span className="error-colour">{t('ERROR_LOADING_FILTER')}</span>

  if (loading || !appCount) return null

  return (
    <Link
      key={filter.id}
      to={constructLink(filter, template.code)}
    >{`${filter.title} (${appCount})`}</Link>
  )
}

const StartNewTemplate: React.FC<{ template: TemplateInList }> = ({ template: { name, code } }) => {
  const { t } = useLanguageProvider()
  return (
    <div className="no-applications">
      <Label className="simple-label" content={t('LABEL_DASHBOARD_NO_APPLICATIONS')} />
      <Link to={`/application/new?type=${code}`}>{t('LABEL_DASHBOARD_START_NEW', name)}</Link>
    </div>
  )
}

const userRole = (filter: Filter) =>
  filter.userRole === PermissionPolicyType.Apply ? USER_ROLES.APPLICANT : USER_ROLES.REVIEWER

const constructLink = (filter: Filter, templateType: string) =>
  `/applications?type=${templateType}&user-role=${userRole(filter)}&${Object.entries(filter.query)
    .map(([key, value]) => `${key}=${value}`)
    .join('&')}`

const checkRestrictions = (restrictions: string[], filterCounts: { [key: string]: number }) => {
  for (let restriction of restrictions) {
    if (!(restriction in filterCounts)) return true
    if (filterCounts[restriction] === 0) return true
  }

  return false
}

export default Dashboard
