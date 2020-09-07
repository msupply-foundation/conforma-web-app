import React from "react"
import { hot } from 'react-hot-loader'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import { Container, Segment } from 'semantic-ui-react'

import ApplicationsList from './ApplicationList'
import AppMenu from './AppMenu'
import Footer from './Footer'
import Form from './Form'
import Home from './Home'
import NoMatch from './NoMatch'
import Register from './Register'

const App: React.FC = () => {
  return (
    <Segment.Group inverted>
        <Segment.Group horizontal>
            <Router>
                <Segment inverted>
                    <AppMenu
                            items={[
                                ['Home', '/'],
                                ['Form', '/form'],
                                ['Register', '/register'],
                                ['Applications List', '/applications']
                            ]}
                        />
                </Segment>
                <Segment inverted>
                    <Container fluid>
                            <Switch>
                                <Route path='/' exact component={Home} />
                                <Route path='/form' component={Form} />
                                <Route path='/register' component={Register} />
                                <Route path='/applications' component={ApplicationsList} />
                                <Route component={NoMatch} />
                            </Switch>
                    </Container>
                </Segment>
            </Router>
        </Segment.Group>
        <Segment inverted>
            <Footer />
        </Segment>
    </Segment.Group>

    )
}

declare const module: any;
export default hot(module)(App)