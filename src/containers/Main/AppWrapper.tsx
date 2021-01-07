import React from 'react'
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom'
import { hot } from 'react-hot-loader'
import { Footer } from '../../components'
import SiteLayout from './SiteLayout'
import UserArea from '../User/UserArea'
import Login from '../User/Login'
import { UserProvider } from '../../contexts/UserState'
import isLoggedIn from '../../utils/helpers/loginCheck'
import UserRegister from '../User/UserRegister'

const AppWrapper: React.FC = () => {
  return (
    <Router>
      <UserProvider>
        <Switch>
          <Route exact path="/login">
            <Login />
          </Route>
          <Route exact path="/register">
            <UserRegister />
          </Route>
          <Route>
            <AuthenticatedContent />
          </Route>
        </Switch>
      </UserProvider>
    </Router>
  )
}

const AuthenticatedContent: React.FC = () => {
  if (isLoggedIn()) {
    return (
      <>
        <UserArea />
        <SiteLayout />
        <Footer />
      </>
    )
  } else return <Redirect to={{ pathname: '/login', state: { from: location.pathname } }} />
}

declare const module: any
export default hot(module)(AppWrapper)
