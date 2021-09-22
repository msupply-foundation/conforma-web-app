import React from 'react'
import SiteLayout from './SiteLayout'
import { useRouter } from '../../utils/hooks/useRouter'
import isLoggedIn from '../../utils/helpers/loginCheck'
import NonRegisteredLogin from '../User/NonRegisteredLogin'
import { Redirect } from 'react-router'

const AuthenticatedContent: React.FC = () => {
  const {
    location: { pathname, search },
    query: { sessionId },
  } = useRouter()
  if (isLoggedIn()) return <SiteLayout />
  // If there is a sessionId in the URL, then need to login as nonRegistered
  // before continuing
  if (sessionId) return <NonRegisteredLogin option="redirect" redirect={pathname + search} />
  return <Redirect to={{ pathname: '/login', state: { from: location.pathname } }} />
}

export default AuthenticatedContent
