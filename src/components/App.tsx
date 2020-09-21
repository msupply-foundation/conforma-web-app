import React from 'react'
import { hot } from 'react-hot-loader'
import { BrowserRouter as Router, Switch, Route, useLocation } from 'react-router-dom'
import { Grid, Segment } from 'semantic-ui-react'
import ApplicationsList from './ApplicationList'
import ApplicationNew from './ApplicationNew'
import Application from './Application'
import Approval from './Approval'
import Admin from './Admin'
import AppMenu from './AppMenu'
import Footer from './Footer'
import Home from './Home'
import Login from './Login'
import TemplateList from './TemplateList'
import TemplateNew from './TemplateNew'
import Template from './Template'
import Account from './Account'
import { Organisation, OrgMemberEdit } from './Organisation'
import { AdminUsers, AdminPermissions, Config } from './AdminOther'
import { NotificationsList, Notification } from './Notification'
import NoMatch from './NoMatch'
import { ProductList, Product } from './Product'

/**
 * Custom Hook to make URL query parameters available in a
 * simple key-value object.
 * The object returned should be used for filtering what the database returns
 * @params { None } (gets current URL)
 * @returns { {URLqueryKey: URLqueryValue} } - the returned function
 */
export const useQueryParameters = () => {
  const queryParameters: { [key: string]: string } = {}
  const query = new URLSearchParams(useLocation().search)
  query.forEach((value, key) => (queryParameters[key] = value))
  return queryParameters
}

const App: React.FC = () => {
  return (
    <div>
      <Router>
        <Grid>
          <Grid.Column width={4}>
            <AppMenu
              items={[
                ['Home', '/'],
                ['Register', '/form'],
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
                <Route exact path="/login">
                  <Login />
                </Route>
                <Route path="/applications">
                  <ApplicationsList />
                </Route>
                <Route path="/application/new">
                  <ApplicationNew />
                </Route>
                <Route exact path="/application/:appId">
                  <Application />
                </Route>
                <Route exact path="/application/:appId/:sectionName/p:page">
                  <Application />
                </Route>
                <Route exact path="/application/:appId/summary">
                  <Application summary={true} />
                </Route>
                <Route exact path="/application/:appId/approval">
                  <Approval />
                </Route>
                <Route exact path="/admin">
                  <Admin />
                </Route>
                <Route exact path="/admin/templates">
                  <TemplateList />
                </Route>
                <Route exact path="/admin/template/new">
                  <TemplateNew />
                </Route>
                <Route exact path="/admin/template/:templateId/:step">
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
                <Route exact path="/organisation/:orgName">
                  <Organisation />
                </Route>
                <Route exact path="/organisation/:orgName/members">
                  <OrgMemberEdit />
                </Route>
                <Route exact path="/notifications">
                  <NotificationsList />
                </Route>
                <Route exact path="/notification/:notificationId">
                  <Notification />
                </Route>
                <Route exact path="/products">
                  <ProductList />
                </Route>
                <Route exact path="/product/:productId">
                  <Product />
                </Route>
                <Route component={NoMatch} />
              </Switch>
            </Segment>
          </Grid.Column>
        </Grid>
      </Router>
      <Footer />
    </div>
  )
}

declare const module: any
export default hot(module)(App)
