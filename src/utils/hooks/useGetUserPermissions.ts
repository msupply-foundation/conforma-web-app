import { useEffect, useState } from 'react'
import { TemplatePermissions, FullUserPermissions } from '../../utils/types'
import config from '../../config.json'

const userPermissionsUrl = `${config.serverREST}/userPermissions`
const LOCAL_STORAGE_JWT_KEY = 'persistJWT'
const createAuthorisationHeader = (JWT: string) => ({
  Authorization: `Bearer ${JWT}`,
})

const useGetUserPermissions = () => {
  const [templatePermissions, setTemplatePermissions] = useState<TemplatePermissions | null>(null)
  const [username, setUsername] = useState<string | null>('')

  useEffect(() => {
    const JWT: string = localStorage.getItem(LOCAL_STORAGE_JWT_KEY) || ''

    fetch(userPermissionsUrl, { headers: createAuthorisationHeader(JWT) })
      .then((res: any) => res.json())
      .then(({ username, templatePermissions, JWT }: FullUserPermissions) => {
        setUsername(username)
        setTemplatePermissions(templatePermissions)

        localStorage.setItem(LOCAL_STORAGE_JWT_KEY, JWT)
      })
      .catch((error) => {
        // TODO handle this properly
        console.log(error)
      })
  }, [])

  return { username, templatePermissions }
}

export default useGetUserPermissions
