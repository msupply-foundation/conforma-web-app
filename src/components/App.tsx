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
import NoMatch from './NoMatch'

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
