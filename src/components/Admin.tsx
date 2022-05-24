import React from 'react'
import { Link, Route, Switch } from 'react-router-dom'
import { Header } from 'semantic-ui-react'
import { Loading, NoMatch } from '.'
import Snapshots from '../containers/Dev/Snapshots'
import { useLanguageProvider } from '../contexts/Localisation'
import TemplateWrapper from '../containers/TemplateBuilder/template/TemplateWrapper'
import Templates from '../containers/TemplateBuilder/Templates'
import { useUserState } from '../contexts/UserState'
import { LookupTableRoutes } from '../LookupTable'
import { useRouter } from '../utils/hooks/useRouter'
import { AdminLocalisations, AdminDataViews, AdminPermissions, AdminPlugins } from './AdminOther'

const Admin: React.FC = () => {
  const { strings } = useLanguageProvider()
  const {
    match: { path },
  } = useRouter()
  const {
    userState: { isAdmin, isLoading },
  } = useUserState()

  if (isLoading) return <Loading />

  if (!isAdmin) return <NoMatch />

  const adminOption = [
    {
      route: 'templates',
      header: strings.MENU_ITEM_ADMIN_TEMPLATES,
      Element: () => <Templates />,
    },
    {
      route: 'lookup-tables',
      header: strings.MENU_ITEM_ADMIN_LOOKUP_TABLES,
      Element: () => <LookupTableRoutes />,
    },
    {
      route: 'data',
      header: strings.MENU_ITEM_ADMIN_DATA_VIEW_CONFIG,
      Element: () => <AdminDataViews />,
    },
    {
      route: 'permissions',
      header: strings.MENU_ITEM_ADMIN_PERMISSIONS,
      Element: () => <AdminPermissions />,
    },
    // {
    //   route: 'plugins',
    //   header: 'Plugins',
    //   Element: () => <AdminPlugins />,
    // },
    {
      route: 'localisations',
      header: strings.MENU_ITEM_ADMIN_LOCALISATION,
      Element: () => <AdminLocalisations />,
    },
    {
      route: 'snapshots',
      header: 'Snapshots',
      Element: () => <Snapshots />,
    },
  ]

  return (
    <Switch>
      <Route path={`${path}/template/:templateId`}>
        <TemplateWrapper />
      </Route>
      {adminOption.map(({ route, Element }) => (
        <Route key={route} path={`${path}/${route}`}>
          <Element />
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
