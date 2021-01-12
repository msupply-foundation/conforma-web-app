import React from 'react'
import { Footer } from '../../components'
import SiteLayout from './SiteLayout'
import UserArea from '../User/UserArea'
import { Container } from 'semantic-ui-react'
import isLoggedIn from '../../utils/helpers/loginCheck'
import { Redirect } from 'react-router'

const AuthenticatedContent: React.FC = () => {
  return isLoggedIn() ? (
    <Container>
      <UserArea />
      <SiteLayout />
      <Footer />
    </Container>
  ) : (
    <Redirect to={{ pathname: '/login', state: { from: location.pathname } }} />
  )
}

export default AuthenticatedContent
