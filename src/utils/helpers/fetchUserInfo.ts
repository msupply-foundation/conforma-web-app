import { Dispatch } from 'react'
import config from '../../config'
import { UserActions } from '../../contexts/UserState'
import { getRequest } from './fetchMethods'
import getServerUrl from './endpoints/endpointUrlBuilder'

interface SetUserInfoProps {
  dispatch: Dispatch<UserActions>
}

const fetchUserInfo = ({ dispatch }: SetUserInfoProps, logout: Function) => {
  getRequest(getServerUrl('userInfo'))
    .then(({ templatePermissions, JWT, user, success, orgList, isAdmin }) => {
      if (!success) logout()
      localStorage.setItem(config.localStorageJWTKey, JWT)
      // Set userinfo to context after receiving it from endpoint
      if (user && templatePermissions) {
        dispatch({
          type: 'setCurrentUser',
          newUser: user,
          newPermissions: templatePermissions || {},
          newOrgList: orgList || [],
          newIsAdmin: !!isAdmin,
        })
      }

      dispatch({ type: 'setLoading', isLoading: false })
    })
    .catch((error) => {
      // TODO handle this properly
      console.log(error)
    })
}

export default fetchUserInfo
