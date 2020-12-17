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

  useEffect(() => {
    const JWT: string = localStorage.getItem(LOCAL_STORAGE_JWT_KEY) || ''

    fetch(userPermissionsUrl, { headers: createAuthorisationHeader(JWT) })
      .then((res: any) => res.json())
      .then(({ templatePermissions, JWT }: FullUserPermissions) => {
        setTemplatePermissions(templatePermissions)

        localStorage.setItem(LOCAL_STORAGE_JWT_KEY, JWT)
      })
      .catch((error) => {
        // TODO handle this properly
        console.log(error)
      })
  }, [])

  return { templatePermissions }
}

export default useGetUserPermissions
