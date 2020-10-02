import React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import { Grid, Segment } from 'semantic-ui-react'
import {
  Account,
  AdminPermissions,
  AdminUsers,
  ApplicationList,
  ApplicationNew,
  Approval,
  Admin,
  AppMenu,
  Config,
  Home,
  Login,
  Notification,
  NotificationsList,
  NoMatch,
  Product,
  ProductList,
  Register,
  Organisation,
  OrgMemberEdit,
  TemplateList,
  TemplateNew,
  Template,
} from '../../components'
import ApplicationPage from '../Application/ApplicationPage'
import { NavigationProvider } from './NavigationState'

const SiteLayout: React.FC = () => {
  return (
    <Router>
      <NavigationProvider>
        <Grid>
          <Grid.Column width={4}>
            <AppMenu
              items={[
                ['Home', '/'],
                ['Applications List', '/applications'],
              ]}
            />
          </Grid.Column>
          <Grid.Column stretched width={12}>
            <Segment>
              <Switch>
                <Route exact path="/">
                  <Home />
                </Route>
                <Route exact path="/register">
                  <Register />
                </Route>
                <Route exact path="/login">
                  <Login />
                </Route>
                <Route exact path="/applications">
                  <ApplicationList />
                </Route>
                <Route exact path="/applications/new">
                  <ApplicationNew />
                </Route>
                <Route exact path="/applications/:appId">
                  <ApplicationPage />
                </Route>
                <Route exact path="/applications/:appId/:sectionName/page:page">
                  <ApplicationPage />
                </Route>
                <Route exact path="/applications/:appId/summary">
                  <ApplicationPage summary={true} />
                </Route>
                <Route exact path="/applications/:appId/approval">
                  <Approval />
                </Route>
                <Route exact path="/admin">
                  <Admin />
                </Route>
                <Route exact path="/admin/templates">
                  <TemplateList />
                </Route>
                <Route exact path="/admin/templates/new">
                  <TemplateNew />
                </Route>
                <Route exact path="/admin/templates/:templateId/:step">
                  <Template />
                </Route>
                <Route exact path="/admin/users">
                  <AdminUsers />
                </Route>
                <Route exact path="/admin/permissions">
                  <AdminPermissions />
                </Route>
                <Route exact path="/admin/config">
                  <Config />
                </Route>
                <Route exact path="/account">
                  <Account />
                </Route>
                <Route exact path="/organisations/:orgName">
                  <Organisation />
                </Route>
                <Route exact path="/organisations/:orgName/members">
                  <OrgMemberEdit />
                </Route>
                <Route exact path="/notifications">
                  <NotificationsList />
                </Route>
                <Route exact path="/notifications/:notificationId">
                  <Notification />
                </Route>
                <Route exact path="/products">
                  <ProductList />
                </Route>
                <Route exact path="/products/:productId">
                  <Product />
                </Route>
                <Route>
                  <NoMatch />
                </Route>
              </Switch>
            </Segment>
          </Grid.Column>
        </Grid>
      </NavigationProvider>
    </Router>
  )
}

export default SiteLayout
