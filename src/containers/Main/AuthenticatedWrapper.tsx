import React from 'react'
import SiteLayout from './SiteLayout'
import { useRouter } from '../../utils/hooks/useRouter'
import isLoggedIn from '../../utils/helpers/loginCheck'
import NonRegisteredLogin from '../User/NonRegisteredLogin'
import { Redirect } from 'react-router'

const AuthenticatedContent: React.FC = () => {
  const { location } = useRouter()

  const sessionId = getSessionIdFromUrl()

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
}

export default AuthenticatedContent

// This is a nasty hack that we need due to the fact that ReactRouter doesn't
// have "query" values available when this component is loaded from another. So
// we fetch and parse it ourselves directly from window.location.search instead.
// We should upgrade to ReactRouter 6 at some point and hopefully this will be
// sorted.
export const getSessionIdFromUrl = () => {
  const sessionIdRegex = /^\?(sessionId)=(.+)$/
  const matches = window.location.search.match(sessionIdRegex)
  if (!matches) return null
  if (matches[1] === 'sessionId') return matches[2]
}
