import React from 'react'
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
  if (isLoggedIn()) return <SiteLayout />
  // If there is a sessionId in the URL, then need to login as nonRegistered
  // before continuing

  // Location is not fully loaded unless 'state' is present, TODO try upgrading react router
  // without this sessionId is missing when navigating via Click Here in forgot password verification
  if ('state' in location) {
    let { pathname, search } = location
    if (sessionId) return <NonRegisteredLogin option="redirect" redirect={pathname + search} />
    return <Redirect to={{ pathname: '/login', state: { from: location.pathname } }} />
  }

  return <Loading />
}

export default AuthenticatedContent
