import { Dispatch } from 'react'
import config from '../../config.json'
import { UserActions } from '../../contexts/UserState'
const userInfoUrl = `${config.serverREST}/userInfo`
const LOCAL_STORAGE_JWT_KEY = 'persistJWT'
const createAuthorisationHeader = (JWT: string) => ({
  Authorization: `Bearer ${JWT}`,
})

interface SetUserInfoProps {
  dispatch: Dispatch<UserActions>
}

const fetchUserInfo = ({ dispatch }: SetUserInfoProps) => {
  const JWT: string = localStorage.getItem(LOCAL_STORAGE_JWT_KEY) || ''

  fetch(userInfoUrl, { headers: createAuthorisationHeader(JWT) })
    .then((res: any) => res.json())
    .then(({ templatePermissions, JWT, user }) => {
      localStorage.setItem(LOCAL_STORAGE_JWT_KEY, JWT)

      // Set userinfo to context after receiving it from endpoint
      if (user && templatePermissions) {
        dispatch({
          type: 'setCurrentUser',
          newUser: user,
          newPermissions: templatePermissions,
        })
      }
    })
    .catch((error) => {
      // TODO handle this properly
      console.log(error)
    })
}

export default fetchUserInfo
