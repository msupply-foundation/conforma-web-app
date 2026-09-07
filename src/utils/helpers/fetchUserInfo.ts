import { Dispatch } from 'react'
import { UserActions } from '../../contexts/UserState'
import { setSessionEnd } from '../../contexts/UserState/SessionActivityTimer'
import { getRequest, isUnauthenticated } from './fetchMethods'
import getServerUrl from './endpoints/endpointUrlBuilder'

interface SetUserInfoProps {
  dispatch: Dispatch<UserActions>
}

interface FetchUserInfoOptions {
  // A network failure (blip, server restart) says nothing about the session, so
  // a keep-alive ping keeps the user logged in and tries again on a later
  // check. On first load there is nothing to try again with, so any failure has
  // to send the user to the login screen.
  logoutOnRequestFailure?: boolean
}

// Authenticated by the access cookie, which the browser sends automatically.
// Fetches the current user's details, and replaces the access cookie if it has
// run out. Keeping the session alive is the heartbeat's job, not this one's.
const fetchUserInfo = (
  { dispatch }: SetUserInfoProps,
  logout: Function,
  { logoutOnRequestFailure = true }: FetchUserInfoOptions = {}
) =>
  getRequest(getServerUrl('userInfo'))
    .then(({ templatePermissions, user, success, orgList, sessionExpiry }) => {
      if (!success) {
        logout()
        return
      }
      // Gives the session timer a deadline to watch on a tab that is restored
      // and then never touched, which would otherwise have nothing to work from
      if (sessionExpiry) setSessionEnd(sessionExpiry)
      // Set userinfo to context after receiving it from endpoint
      if (user && templatePermissions) {
        dispatch({
          type: 'setCurrentUser',
          newUser: user,
          newPermissions: templatePermissions || {},
          newOrgList: orgList || [],
        })
      }

      dispatch({ type: 'setLoading', isLoading: false })
    })
    .catch((error) => {
      console.error('Problem fetching user info:', error)
      if (isUnauthenticated(error) || logoutOnRequestFailure) logout()
    })

export default fetchUserInfo
