import { useEffect, useState } from 'react'
import { TemplatePermissions, FullUserInfo, User } from '../types'
import config from '../../config.json'
const userInfoUrl = `${config.serverREST}/userInfo`
const LOCAL_STORAGE_JWT_KEY = 'persistJWT'
const createAuthorisationHeader = (JWT: string) => ({
  Authorization: `Bearer ${JWT}`,
})

const useGetUserInfo = () => {
  const [templatePermissions, setTemplatePermissions] = useState<TemplatePermissions | null>(null)
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const JWT: string = localStorage.getItem(LOCAL_STORAGE_JWT_KEY) || ''

    fetch(userInfoUrl, { headers: createAuthorisationHeader(JWT) })
      .then((res: any) => res.json())
      .then(({ templatePermissions, JWT, user }: FullUserInfo) => {
        setTemplatePermissions(templatePermissions)
        setUser(user)
        localStorage.setItem(LOCAL_STORAGE_JWT_KEY, JWT)
      })
      .catch((error) => {
        // TODO handle this properly
        console.log(error)
      })
  }, [])

  return { user, templatePermissions }
}

export default useGetUserInfo
