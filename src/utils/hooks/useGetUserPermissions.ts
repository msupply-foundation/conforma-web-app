import { useEffect, useState } from 'react'
import { TemplatePermissions, FullUserPermissions, User } from '../../utils/types'
import config from '../../config.json'

const userPermissionsUrl = `${config.serverREST}/userPermissions`
const LOCAL_STORAGE_JWT_KEY = 'persistJWT'
const createAuthorisationHeader = (JWT: string) => ({
  Authorization: `Bearer ${JWT}`,
})

const useGetUserPermissions = () => {
  const [templatePermissions, setTemplatePermissions] = useState<TemplatePermissions | null>(null)
  const [username, setUsername] = useState('')
  const [user, setUser] = useState<User>()

  useEffect(() => {
    const JWT: string = localStorage.getItem(LOCAL_STORAGE_JWT_KEY) || ''
    const user: User = JSON.parse(localStorage.getItem('user') || '')

    fetch(userPermissionsUrl, { headers: createAuthorisationHeader(JWT) })
      .then((res: any) => res.json())
      .then(({ username, templatePermissions, JWT }: FullUserPermissions) => {
        setUsername(username)
        setUser(user)
        setTemplatePermissions(templatePermissions)

        localStorage.setItem(LOCAL_STORAGE_JWT_KEY, JWT)
      })
      .catch((error) => {
        // TODO handle this properly
        console.log(error)
      })
  }, [])

  return { username, user, templatePermissions }
}

export default useGetUserPermissions
