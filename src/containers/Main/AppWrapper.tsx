import React from 'react'
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom'
import { hot } from 'react-hot-loader'
import { Footer, Login } from '../../components'
import SiteLayout from './SiteLayout'
import UserArea from '../User/UserArea'
import { UserProvider } from '../../contexts/UserState'
import isLoggedIn from '../../utils/helpers/loginCheck'

const AppWrapper: React.FC = () => {
  return (
    <Router>
      <UserProvider>
        {!isLoggedIn() && <Redirect to="/login" />}
        <Switch>
          <Route exact path="/login">
            <Login />
          </Route>
          <Route>
            <UserArea />
            <SiteLayout />
            <Footer />
          </Route>
        </Switch>
      </UserProvider>
    </Router>
  )
}

declare const module: any
export default hot(module)(AppWrapper)
