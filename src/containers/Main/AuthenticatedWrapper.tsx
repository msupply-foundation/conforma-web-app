import React, { useEffect } from 'react'
import SiteLayout from './SiteLayout'
import { useRouter } from '../../utils/hooks/useRouter'
import isLoggedIn from '../../utils/helpers/loginCheck'
import NonRegisteredLogin from '../User/NonRegisteredLogin'
import { Redirect } from 'react-router'
import { Loading } from '../../components'

const AuthenticatedContent: React.FC = () => {
  const {
    location,
    query: { sessionId },
  } = useRouter()
  // Location is not fully loaded unless 'state' is present, TODO try upgrading react router
  // without this sessionId is missing when navigating via Click Here in forgot password verification
  // if ('state' in location) {
  console.log('Location state', location)
  console.log('sessionId', sessionId)
  let { pathname, search } = location
  // If there is a sessionId in the URL, then need to login as nonRegistered
  // before continuing
  if (sessionId && !isLoggedIn()) {
    console.log('SessionID and logged in')
    return <NonRegisteredLogin option="redirect" redirect={pathname + search} />
  }
  if (isLoggedIn()) {
    console.log('isLoggedIn, authenticated')
    return <SiteLayout />
  }
  console.log('REDIRECT to login')
  return <Redirect to={{ pathname: '/login', state: { from: location.pathname } }} />
  // }
  console.log('Default loading...')
  return <Loading />
}

export default AuthenticatedContent
