import React from 'react'
import { Link, Route, Switch } from 'react-router-dom'
import { Header } from 'semantic-ui-react'
import { Loading, NoMatch } from '..'
import { useLanguageProvider } from '../../contexts/Localisation'
import { useUserState } from '../../contexts/UserState'
import { LookupTableRoutes } from '../../LookupTable'
import { useRouter } from '../../utils/hooks/useRouter'
import { AdminPreferences } from './AdminPreferences'
import { AdminDataViews } from './AdminDataViews/AdminDataViews'
// import { AdminDataViews, AdminPermissions, AdminPlugins } from './AdminOther'

const Templates = React.lazy(() => import('../../containers/TemplateBuilder/Templates'))
const TemplateWrapper = React.lazy(
  () => import('../../containers/TemplateBuilder/template/TemplateWrapper')
)
const Snapshots = React.lazy(() => import('../../containers/Dev/Snapshots'))
const AdminLocalisations = React.lazy(() => import('./AdminLocalisations'))

const Admin: React.FC = () => {
  const { t } = useLanguageProvider()
  const {
    match: { path },
  } = useRouter()
  const {
    userState: { currentUser, isLoading },
  } = useUserState()

  if (isLoading) return <Loading />

  if (!currentUser?.isAdmin) return <NoMatch />

  const adminOption = [
    {
      route: 'templates',
      header: t('MENU_ITEM_ADMIN_TEMPLATES'),
      Element: <Templates />,
    },
    {
      route: 'lookup-tables',
      header: t('MENU_ITEM_ADMIN_LOOKUP_TABLES'),
      Element: <LookupTableRoutes />,
    },
    {
      route: 'data-views',
      header: t('MENU_ITEM_ADMIN_DATA_VIEW_CONFIG'),
      Element: <AdminDataViews />,
    },
    {
      route: 'localisations',
      header: t('MENU_ITEM_ADMIN_LOCALISATION'),
      Element: <AdminLocalisations />,
    },
    {
      route: 'preferences',
      header: t('MENU_ITEM_ADMIN_PREFS'),
      Element: <AdminPreferences />,
    },
    {
      route: 'snapshots',
      header: 'Snapshots',
      Element: <Snapshots />,
    },
  ]

  return (
    <Switch>
      <Route path={`${path}/template/:templateId`}>
        <TemplateWrapper />
      </Route>
      {adminOption.map(({ route, Element }) => (
        <Route key={route} path={`${path}/${route}`}>
          {Element}
        </Route>
      ))}

      <Route exact path={`${path}`}>
        <div id="admin-display">
          <Header as="h4">Admin</Header>
          <div className="admin-options-container">
            {adminOption.map(({ route, header }) => (
              <Link className="clickable" key={route} to={`${path}/${route}`}>
                <div className="admin-option">
                  <Header as="h3" className="clickable">
                    {header}
                  </Header>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </Route>
      <Route>
        <NoMatch />
      </Route>
    </Switch>
  )
}

export default Admin
