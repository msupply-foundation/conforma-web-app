import React from "react"
import { hot } from 'react-hot-loader'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import { Grid, Segment } from 'semantic-ui-react'

import ApplicationsList from './ApplicationList'
import AppMenu from './AppMenu'
import Footer from './Footer'
import Form from './Form'
import Home from './Home'
import NoMatch from './NoMatch'
import Register from './Register'

const App: React.FC = () => {
  return (
    <div>
        <Router>
            <Grid>
                <Grid.Column width={4}>
                    <AppMenu
                            items={[
                                ['Home', '/'],
                                ['Form', '/form'],
                                ['Register', '/register'],
                                ['Applications List', '/applications']
                            ]}
                        />
                </Grid.Column>
                <Grid.Column stretched width={12}>
                    <Segment>
                        <Switch>
                            <Route path='/' exact component={Home} />
                            <Route path='/form' component={Form} />
                            <Route path='/register' component={Register} />
                            <Route path='/applications' component={ApplicationsList} />
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

declare const module: any;
export default hot(module)(App)