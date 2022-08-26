import { Dispatch } from 'react'
import config from '../../config'
import { UserActions } from '../../contexts/UserState'
import { getRequest } from './fetchMethods'
import getServerUrl from './endpoints/endpointUrlBuilder'
import { usePrefs } from '../../contexts/SystemPrefs'

interface SetUserInfoProps {
  dispatch: Dispatch<UserActions>
}

const fetchUserInfo = ({ dispatch }: SetUserInfoProps, logout: Function) => {
  const { preferences } = usePrefs()

  const managementPrefName =
    preferences?.systemManagerPermissionName || config.defaultSystemManagerPermissionName

  getRequest(getServerUrl('userInfo'))
    .then(({ templatePermissions, permissionNames, JWT, user, success, orgList, isAdmin }) => {
      if (!success) logout()
      localStorage.setItem(config.localStorageJWTKey, JWT)
      // Set userinfo to context after receiving it from endpoint
      if (user && templatePermissions) {
        dispatch({
          type: 'setCurrentUser',
          newUser: user,
          newPermissions: templatePermissions || {},
          newPermissionNames: permissionNames || [],
          newOrgList: orgList || [],
          newIsAdmin: !!isAdmin,
          newIsManager: permissionNames.includes(managementPrefName),
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
