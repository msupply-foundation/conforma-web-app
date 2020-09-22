import React from 'react'
import { hot } from 'react-hot-loader'
import { BrowserRouter as Router, Switch, Route, useLocation } from 'react-router-dom'
import { Grid, Segment } from 'semantic-ui-react'
import ApplicationsList from '../components/ApplicationList'
import ApplicationNew from '../components/ApplicationNew'
import Application from '../components/Application'
import Approval from '../components/Approval'
import Admin from '../components/Admin'
import AppMenu from '../components/AppMenu'
import Footer from '../components/Footer'
import Home from '../components/Home'
import Login from '../components/Login'
import TemplateList from '../components/TemplateList'
import TemplateNew from '../components/TemplateNew'
import Template from '../components/Template'
import Account from '../components/Account'
import { Organisation, OrgMemberEdit } from '../components/Organisation'
import { AdminUsers, AdminPermissions, Config } from '../components/AdminOther'
import { NotificationsList, Notification } from '../components/Notification'
import { ProductList, Product } from '../components/Product'
import NoMatch from '../components/NoMatch'
import UserArea from './User/UserArea'
import Register from '../components/Register'
import { UserProvider } from './User/UserState'

// queryParams is an object that gets the URL query params as key-value pairs
// This object should be used for filtering the getApplication query
export function useQueryParameters() {
  const queryParameters: { [key: string]: string } = {}
  const query = new URLSearchParams(useLocation().search)
  query.forEach((value, key) => (queryParameters[key] = value))
  return queryParameters
}

const App: React.FC = () => {
  return (
    <div>
      <UserProvider>
        <UserArea />
      </UserProvider>

      <Router>
        <Grid>
          <Grid.Column width={4}>
            <AppMenu
              items={[
                ['Home', '/'],
                ['Register', '/register'],
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
