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
              ['Register', '/application/new?type=UserRegistration'],
              ['Company Registration', '/application/new?type=CompRego1'],
              ['Review Test form', '/application/new?type=ReviewTest'],
              ['Feature Showcase form', '/application/new?type=TestRego'],
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
              <Route exact path="/application/new">
                <ApplicationProvider>
                  <ApplicationCreate />
                </ApplicationProvider>
              </Route>
              <Route exact path="/application/:serialNumber">
                <ApplicationProvider>
                  <ApplicationPageWrapper />
                </ApplicationProvider>
              </Route>
              <Route exact path="/application/:serialNumber/:sectionCode/Page:page">
                <ApplicationProvider>
                  <ApplicationPageWrapper />
                </ApplicationProvider>
              </Route>
              <Route exact path="/application/:serialNumber/summary">
                <ApplicationOverview />
              </Route>
              <Route exact path="/application/:serialNumber/review">
                <ReviewOverview />
              </Route>
              <Route exact path="/application/:serialNumber/review/:reviewId">
                <ReviewPageWrapper />
              </Route>
              <Route exact path="/application/:serialNumber/consolidation/">
                <NoMatch />
              </Route>
              <Route exact path="/application/:serialNumber/consolidation/:consolidationId">
                <NoMatch />
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
          </Segment>
        </Grid.Column>
      </Grid>
    </Router>
  )
}

export default SiteLayout
