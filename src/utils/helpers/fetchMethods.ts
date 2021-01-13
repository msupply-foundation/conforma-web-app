// Generic GET/POST methods for re-use throughout app

export async function postRequest(body: object, endpointUrl: string, headers: object = {}) {
  try {
    const response = await fetch(endpointUrl, {
      method: 'POST',
      cache: 'no-cache',
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      body: JSON.stringify(body),
    })
    return response.json()
  } catch (err) {
    throw err
  }
}

export async function getRequest(body: object, endpointUrl: string) {
  // TO-DO: Generic GET request
}
