import { Dispatch } from 'react'
import config from '../../config'
import { UserActions } from '../../contexts/UserState'
import { getRequest } from './fetchMethods'
import getServerUrl from './endpoints/endpointUrlBuilder'

interface SetUserInfoProps {
  dispatch: Dispatch<UserActions>
}

const fetchUserInfo = ({ dispatch }: SetUserInfoProps, logout: Function) => {
  if (!localStorage.getItem(config.localStorageJWTKey)) {
    console.error("Missing JWT token, can't fetch user info or refresh token")
    return
  }
  getRequest(getServerUrl('userInfo'))
    .then(({ templatePermissions, JWT, user, success, orgList }) => {
      if (!success) logout()
      localStorage.setItem(config.localStorageJWTKey, JWT)
      // Set userinfo to context after receiving it from endpoint
      console.log('Fetched okay!')
      if (user && templatePermissions) {
        console.log('Setting user...')
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
