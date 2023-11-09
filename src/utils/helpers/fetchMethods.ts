// Generic GET/POST methods for re-use throughout app
import config from '../../config'

export async function postRequest({
  jsonBody = {},
  otherBody,
  url,
  headers = {},
}: {
  jsonBody?: object
  otherBody?: any
  url: string
  headers?: object
}) {
  const JWT = localStorage.getItem(config.localStorageJWTKey || '')
  const authHeader = JWT ? { Authorization: 'Bearer ' + JWT } : undefined
  const body = otherBody || JSON.stringify(jsonBody)

  try {
    const response = await fetch(url, {
      method: 'POST',
      cache: 'no-cache',
      headers: {
        // 'Content-Type': 'application/json'
        ...authHeader,
        ...headers,
      },
      body,
    })
    return response.json()
  } catch (err) {
    console.log(err)
    throw err
  }
}

export async function getRequest(endpointUrl: string, headers: object = {}) {
  const JWT = localStorage.getItem(config.localStorageJWTKey || '')
  const authHeader = JWT ? { Authorization: 'Bearer ' + JWT } : undefined

  try {
    const response = await fetch(endpointUrl, {
      method: 'GET',
      // cache: 'no-cache',
      headers: {
        'Content-Type': 'application/json',
        ...authHeader,
        ...headers,
      },
    })
    return response.json()
  } catch (err) {
    console.log(err)
    throw err
  }
}
