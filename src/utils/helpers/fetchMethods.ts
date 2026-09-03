// Generic GET/POST methods for re-use throughout app
//
// Authentication is handled entirely by the "access" cookie, which the browser
// attaches by itself -- every endpoint URL is built same-origin (see
// endpointUrlBuilder), and fetch sends cookies on same-origin requests by
// default. Deliberately no "Authorization" header: the server prefers a
// presented header over the cookie, so sending one would override the token the
// server renews for us.

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
    if (response.status !== 200) throw new Error(responseJSON.message)
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
    if (response.status !== 200) throw new Error(responseJSON.message)
    return responseJSON
  } catch (err) {
    console.log(err)
    throw err
  }
}
