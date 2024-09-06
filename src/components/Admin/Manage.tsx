import React, { Suspense } from 'react'
import { Link, Route, Switch } from 'react-router-dom'
import { Header } from 'semantic-ui-react'
import { Loading, NoMatch } from '..'
import { useLanguageProvider } from '../../contexts/Localisation'
import { useUserState } from '../../contexts/UserState'
import { LookupTableRoutes } from '../../LookupTable'
import { useRouter } from '../../utils/hooks/useRouter'

const AdminLocalisations = React.lazy(() => import('./AdminLocalisations'))
const TemplateWrapper = React.lazy(
  () => import('../../containers/TemplateBuilder/template/TemplateWrapper')
)

const Manage: React.FC = () => {
  const { t } = useLanguageProvider()
  const {
    match: { path },
  } = useRouter()
  const {
    userState: { currentUser, isLoading },
  } = useUserState()

  if (isLoading) return <Loading />

  if (!currentUser?.isManager) return <NoMatch />

  const manageOption = [
    {
      route: 'lookup-tables',
      header: t('MENU_ITEM_ADMIN_LOOKUP_TABLES'),
      Element: <LookupTableRoutes />,
    },
    {
      route: 'localisations',
      header: t('MENU_ITEM_ADMIN_LOCALISATION'),
      Element: (
        <Suspense fallback={<Loading />}>
          <AdminLocalisations />
        </Suspense>
      ),
    },
  ]

  return (
    <Switch>
      <Route path={`${path}/template/:templateId`}>
        <Suspense fallback={<Loading />}>
          <TemplateWrapper />
        </Suspense>
      </Route>
      {manageOption.map(({ route, Element }) => (
        <Route key={route} path={`${path}/${route}`}>
          {Element}
        </Route>
      ))}

      <Route exact path={`${path}`}>
        <div id="admin-display">
          <Header as="h4">Manage</Header>
          <div className="admin-options-container">
            {manageOption.map(({ route, header }) => (
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

export default Manage
