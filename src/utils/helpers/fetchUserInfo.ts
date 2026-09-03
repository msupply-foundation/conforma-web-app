import { Dispatch } from 'react'
import { UserActions } from '../../contexts/UserState'
import { getRequest } from './fetchMethods'
import getServerUrl from './endpoints/endpointUrlBuilder'

interface SetUserInfoProps {
  dispatch: Dispatch<UserActions>
}

// Authenticated by the access cookie, which the browser sends automatically. It
// is also the designated "still here" call: the server extends the session's
// expiry whenever it is hit, and replaces the access cookie if it has run out.
// So a failure means there is no live session, and the user must log in again.
const fetchUserInfo = ({ dispatch }: SetUserInfoProps, logout: Function) => {
  getRequest(getServerUrl('userInfo'))
    .then(({ templatePermissions, user, success, orgList }) => {
      if (!success) {
        logout()
        return
      }
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
      // TODO handle this properly
      console.log(error)
      console.error('Problem fetching user info')
      logout()
    })
}

export default fetchUserInfo
