import { postRequest } from './fetchMethods'
import getServerUrl from './endpoints/endpointUrlBuilder'

// Long enough that a slow connection still completes, short enough that a dead
// one doesn't hold the timer's single-flight guard open indefinitely
const HEARTBEAT_TIMEOUT = 20 // seconds

/**
 * Tells the server the user is still here, which extends the session, and
 * reports when it will now expire -- unix seconds, the same shape login and
 * "/user-info" report it in.
 *
 * Errors are left to propagate: the caller has to tell a 401, meaning the
 * session has gone, from a request that merely failed to arrive.
 */
const sendHeartbeat = async (): Promise<number | undefined> => {
  const { sessionExpiry } = await postRequest({
    url: getServerUrl('heartbeat'),
    headers: { 'Content-Type': 'application/json' },
    timeout: HEARTBEAT_TIMEOUT,
  })
  return typeof sessionExpiry === 'number' ? sessionExpiry : undefined
}

export default sendHeartbeat
