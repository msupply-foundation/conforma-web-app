// Generic GET/POST methods for re-use throughout app
//
// Authentication is handled entirely by the "access" cookie, which the browser
// attaches by itself -- every endpoint URL is built same-origin (see
// endpointUrlBuilder), and fetch sends cookies on same-origin requests by
// default. Deliberately no "Authorization" header: the server prefers a
// presented header over the cookie, so sending one would override the token the
// server renews for us.

// Carries the HTTP status alongside the server's message, so callers can tell a
// 401 (no valid session -- the user must log in again) from a request that
// never arrived, and from a 403 (authenticated, but not permitted this
// resource) which says nothing about the session.
export class RequestError extends Error {
  status: number
  constructor(status: number, message?: string) {
    super(message)
    this.name = 'RequestError'
    this.status = status
  }
}

export const isUnauthenticated = (error: unknown) =>
  error instanceof RequestError && error.status === 401

export async function postRequest({
  jsonBody = {},
  otherBody,
  url,
  headers = {},
  timeout,
}: {
  jsonBody?: object
  otherBody?: any
  url: string
  headers?: object
  timeout?: number // seconds
}) {
  const body = otherBody || JSON.stringify(jsonBody)

  try {
    const response = await fetch(url, {
      method: 'POST',
      cache: 'no-cache',
      headers: {
        // 'Content-Type': 'application/json'
        ...headers,
      },
      body,
      signal: timeout ? AbortSignal.timeout(timeout * 1000) : undefined,
    })
    const responseJSON = await response.json()
    if (response.status !== 200) throw new RequestError(response.status, responseJSON.message)
    return responseJSON
  } catch (err) {
    console.log(err)
    throw err
  }
}

export async function getRequest(endpointUrl: string, headers: object = {}) {
  try {
    const response = await fetch(endpointUrl, {
      method: 'GET',
      // cache: 'no-cache',
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    })
    const responseJSON = await response.json()
    if (response.status !== 200) throw new RequestError(response.status, responseJSON.message)
    return responseJSON
  } catch (err) {
    console.log(err)
    throw err
  }
}
