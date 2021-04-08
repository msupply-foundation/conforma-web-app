import React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import {
  Account,
  AdminPermissions,
  AdminUsers,
  Approval,
  Admin,
  Config,
  Home,
  Login,
  Notification,
  NotificationsList,
  NoMatch,
  Product,
  ProductList,
  Organisation,
  OrgMemberEdit,
  TemplateList,
  TemplateNew,
  Template,
} from '../../components'
import { ApplicationCreateNEW, ApplicationWrapper } from '../Application'
import { ApplicationProvider } from '../../contexts/ApplicationState'
import UserArea from '../User/UserArea'
import ListWrapper from '../List/ListWrapper'
import { FormElementUpdateTrackerProvider } from '../../contexts/FormElementUpdateTrackerState'

const SiteLayout: React.FC = () => {
  return (
    <Router>
      <UserArea />
      <Switch>
        <Route exact path="/dashboard">
          <Home />
        </Route>
        <Route exact path="/login">
          <Login />
        </Route>
        <Route exact path="/applications">
          <ListWrapper />
        </Route>
        <Route path="/application/new">
          <ApplicationProvider>
            <ApplicationCreateNEW />
          </ApplicationProvider>
        </Route>
        <Route path="/application/:serialNumber">
          <FormElementUpdateTrackerProvider>
            <ApplicationWrapper />
          </FormElementUpdateTrackerProvider>
        </Route>
        <Route exact path="/application/:serialNumber/approval">
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
    </Router>
  )
}

export default SiteLayout
