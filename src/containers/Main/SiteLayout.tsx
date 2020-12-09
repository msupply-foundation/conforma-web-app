import React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import { Grid, Segment } from 'semantic-ui-react'
import {
  Account,
  AdminPermissions,
  AdminUsers,
  AppMenu,
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
import { ApplicationCreate, ApplicationList, ApplicationPageWrapper } from '../Application'
import { ReviewOverview, ReviewPageWrapper } from '../Review'
import UserRegister from '../User/UserRegister'
import { ApplicationProvider } from '../../contexts/ApplicationState'
import ApplicationOverview from '../Application/ApplicationOverview'

const SiteLayout: React.FC = () => {
  return (
    <Router>
      <Grid>
        <Grid.Column width={4}>
          <AppMenu
            items={[
              ['Home', '/'],
              ['Applications List', '/applications'],
              ['Register', '/applications/new?type=UserRegistration'],
              ['Company Registration', '/applications/new?type=CompRego1'],
              ['Review Test form', '/applications/new?type=ReviewTest'],
              ['Feature Showcase form', '/applications/new?type=TestRego'],
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
              <Route exact path="/example">
                <UserRegister />
              </Route>
              <Route exact path="/applications">
                <ApplicationList />
              </Route>
              <Route exact path="/applications/new">
                <ApplicationProvider>
                  <ApplicationCreate />
                </ApplicationProvider>
              </Route>
              <Route exact path="/applications/:serialNumber">
                <ApplicationPageWrapper />
              </Route>
              <Route exact path="/applications/:serialNumber/:sectionCode/Page:page">
                <ApplicationPageWrapper />
              </Route>
              <Route exact path="/review/:serialNumber/">
                <ReviewOverview />
              </Route>
              <Route exact path="/review/:serialNumber/:reviewId">
                <ReviewPageWrapper />
              </Route>
              <Route exact path="/applications/:serialNumber/summary">
                <ApplicationOverview />
              </Route>
              <Route exact path="/applications/:serialNumber/approval">
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
    </Router>
  )
}

export default SiteLayout
