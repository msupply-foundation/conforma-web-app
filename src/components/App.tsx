import React from 'react'
import { hot } from 'react-hot-loader'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import { Grid, Segment } from 'semantic-ui-react'
import ApplicationsList from './ApplicationList'
import ApplicationNew from './ApplicationNew'
import AppMenu from './AppMenu'
import Footer from './Footer'
import Home from './Home'
import Login from './Login'
import NoMatch from './NoMatch'

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
