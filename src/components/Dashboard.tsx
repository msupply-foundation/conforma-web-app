import React, { useState, useEffect, Dispatch, SetStateAction } from 'react'
import { Link } from 'react-router-dom'
import { Header, Button, Icon, Label } from 'semantic-ui-react'
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

  return (
    <div id="dashboard">
      <Header as="h2" content={t('MENU_ITEM_DASHBOARD')} />
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
  const { t } = useLanguageProvider()
  const {
    userState: { currentUser },
  } = useUserState()
  const [loadedFiltersCount, setLoadedFiltersCount] = useState(0)

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
              {template?.namePlural || t('LABEL_APPLICATIONS', name)}
            </a>
            <Icon name="chevron right" />
          </Label>
          {filters.map((filter) => (
            <FilterComponent
              template={template}
              filter={filter}
              userId={currentUser?.userId ?? 0}
              setLoaded={setLoadedFiltersCount}
            />
          ))}
          {loadedFiltersCount !== filters.length && <LoadingSmall />}
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
  setLoaded: Dispatch<SetStateAction<number>>
}> = ({ template, filter, userId, setLoaded }) => {
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
    if (!loading) setLoaded((prev) => prev + 1)
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

export default Dashboard
