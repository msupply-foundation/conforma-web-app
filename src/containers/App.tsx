import React from 'react'
import { hot } from 'react-hot-loader'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import { Grid, Segment } from 'semantic-ui-react'

import ApplicationsList from '../components/ApplicationList'
import AppMenu from '../components/AppMenu'
import Footer from '../components/Footer'
import Register from '../components/Register'
import Home from '../components/Home'
import NoMatch from '../components/NoMatch'
import UserArea from './User/UserArea'
import { UserProvider } from './User/UserState' 

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
                ['Register', '/form'],
                ['Applications List', '/applications'],
              ]}
            />
          </Grid.Column>
          <Grid.Column stretched width={12}>
            <Segment>
              <Switch>
                <Route path="/" exact component={Home} />
                <Route path="/form" component={Register} />
                <Route path="/applications" component={ApplicationsList} />
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
