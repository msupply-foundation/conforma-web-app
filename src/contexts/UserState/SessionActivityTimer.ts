/**
 * Logs the user out once they've been inactive for "logoutAfterInactivity", and
 * until then stops their server-side session lapsing underneath them.
 *
 * Two separate deadlines are involved, and the module only makes sense if
 * they're kept apart:
 *
 * 1. The IDLE deadline -- last user interaction + logoutAfterInactivity. This
 *    is what "logout after inactivity" means, so it's the one that decides when
 *    to log out. Only the browser can know it, because interaction means mouse
 *    and keyboard activity, not requests.
 *
 * 2. The SESSION deadline -- when the server will drop the session row. The
 *    server reports it as "sessionExpiry" on the login and "/user-info"
 *    responses. It decides when to ping, and nothing else.
 *
 * They're separate because they move for different reasons. The server only
 * extends a session when it mints an access token, so ordinary requests
 * carrying a valid token don't touch deadline 2 -- meaning a user typing into a
 * long form pushes deadline 1 forward continuously while deadline 2 runs down,
 * and would be logged out mid-edit. So whenever deadline 2 gets close and the
 * user is still inside deadline 1, we call "/user-info", the one route that
 * extends the session unconditionally. For a user who stays active that works
 * out to roughly one request per session window.
 *
 * Note the ping is NOT conditional on the user interacting at that instant.
 * Someone reading the page for two minutes is "idle" by the 5-second threshold
 * but nowhere near their inactivity deadline, and their session must not be
 * allowed to lapse.
 *
 * The user is never left holding a dead session whose requests return nothing,
 * because deadline 2 is only ever *reached* after deadline 1 has already logged
 * them out: the keep-alive fires a margin before deadline 2, and it fires
 * whenever the user is still inside deadline 1. Note this is not an ordering of
 * the two values -- deadline 1 is pushed forward on every interaction, so it
 * routinely sits later than deadline 2 between keep-alives.
 *
 * Both deadlines live in localStorage rather than React state, for three
 * reasons: this is a plain class, outside React; the values have to survive a
 * page reload; and above all they have to be shared between tabs, or a
 * background tab would log out on its own stale idea of when the user last did
 * something, taking the active tab's cookies with it. (Loosely based on an idea
 * presented in https://medium.com/tinyso/b6279663acf2.) Neither value is
 * sensitive -- the access token itself stays invisible to JavaScript, in an
 * HttpOnly cookie.
 *
 * The basic operation is:
 * - The "idleTracker" records the current "idle" state -- "idle" meaning user
 *   has had no interaction (keyboard, mouse, etc) with the app for 5 seconds.
 * - A "checkActivity" timer runs every 5 seconds:
 *   - If the login flag has gone from local storage, another tab has logged
 *     out, so this one follows it.
 *   - If the user is currently *active*, push the idle deadline forward. Any
 *     tab may do this, and every tab reads it.
 *   - If the idle deadline has passed, log out.
 *   - If the session deadline is within "margin", call "/user-info".
 *
 * A session can also end for reasons no timer can see -- revoked by an admin,
 * logged out from another device, a snapshot restore. Those arrive as a
 * "session-expired" websocket message, handled in ServerStatusListener, with a
 * 401 on any request as the backstop.
 */

import IdleTracker from 'idle-tracker'
import config from '../../config'

const DEBUG_LOGGING = false

// How long user needs to have been inactive before being considered "idle"
const IDLE_DETECT_TIME = 5000 // ms

// How often to re-check both deadlines and act accordingly
const ACTIVITY_CHECK_INTERVAL = 5000 // ms

// How far ahead of the session deadline to keep it alive. Wide enough that a
// ping failing for a reason unrelated to auth (network blip, server restart)
// is retried on later checks before the session actually ends.
const KEEP_ALIVE_MARGIN = 60_000 // ms

const LOCAL_STORAGE_IDLE_EXPIRY_KEY = 'idleExpiry'
const LOCAL_STORAGE_SESSION_EXPIRY_KEY = 'sessionExpiry'
const LOCAL_STORAGE_LOGIN_KEY = config.localStorageLoginKey

const log = (text: any) => {
  if (DEBUG_LOGGING) {
    const d = new Date()
    console.log(`${d.toLocaleTimeString()}: ${text}`)
  }
}

const asTime = (ms: number) => new Date(ms).toLocaleTimeString()

interface TimerProps {
  sessionTimeout: number // minutes -- the server's "logoutAfterInactivity"
  onKeepAlive: () => Promise<unknown>
  onSessionEnded: () => void
}

export class SessionActivityTimer {
  sessionTimeout: number // minutes
  autoLogoutDisabled: boolean
  margin: number // ms
  onKeepAlive: () => Promise<unknown>
  onSessionEnded: () => void
  idleTracker: IdleTracker
  activityCheckTimer: number
  keepAliveInFlight: boolean

  constructor({ sessionTimeout, onKeepAlive, onSessionEnded }: TimerProps) {
    this.sessionTimeout = sessionTimeout
    // A "logoutAfterInactivity" of 0 means auto-logout is disabled, and the
    // server sets the session deadline decades out to match, so neither
    // deadline ever comes due. The timer still runs, so a logout in another tab
    // is still noticed.
    this.autoLogoutDisabled = sessionTimeout === 0
    // A very short window would otherwise sit permanently inside the margin,
    // pinging on every check
    this.margin = Math.min(KEEP_ALIVE_MARGIN, (sessionTimeout * 60_000) / 2)
    this.onKeepAlive = onKeepAlive
    this.onSessionEnded = onSessionEnded
    this.idleTracker = new IdleTracker({ timeout: IDLE_DETECT_TIME })
    this.activityCheckTimer = 0
    this.keepAliveInFlight = false
  }

  private checkActivity = async () => {
    if (!localStorage.getItem(LOCAL_STORAGE_LOGIN_KEY)) {
      // This means another tab must have already logged out since the last
      // check
      log('Not logged in -- logging out!')
      this.onSessionEnded()
      return
    }

    // Whichever tab the user is interacting with pushes the shared idle
    // deadline forward, so the others don't log out from under it
    if (!this.idleTracker.isIdle()) setIdleExpiry(this.sessionTimeout)

    const idleExpiry = getIdleExpiry()
    if (!this.autoLogoutDisabled && Date.now() > idleExpiry) {
      log(
        'Inactive since ' + asTime(idleExpiry - this.sessionTimeout * 60_000) + ' -- logging out!'
      )
      this.onSessionEnded()
      return
    }

    // The user is still inside their window, so the session must not lapse --
    // deliberately regardless of whether they happen to be interacting now
    const sessionExpiry = getSessionExpiry()
    if (sessionExpiry && Date.now() < sessionExpiry - this.margin) {
      log(
        `Session ends ${asTime(sessionExpiry)}, keep-alive due ` +
          `${asTime(sessionExpiry - this.margin)}` +
          (this.autoLogoutDisabled ? '' : `, logout ${asTime(idleExpiry)} if idle from now`)
      )
      return
    }

    // A ping can outlast the check interval, and a second would only race the
    // first
    if (this.keepAliveInFlight) return

    log(
      sessionExpiry ? 'Session nearly expired -- keeping it alive' : 'Establishing session expiry'
    )
    this.keepAliveInFlight = true
    try {
      await this.onKeepAlive()
    } catch (err) {
      // Caught here so the timer doesn't depend on the callback handling its
      // own failures. It runs on an interval, so an escaping rejection would be
      // unhandled and invisible. The next check retries, and the margin leaves
      // room for several attempts before the session actually ends.
      console.error('Problem keeping session alive:', err)
    } finally {
      this.keepAliveInFlight = false
    }
  }

  public start = () => {
    if (this.activityCheckTimer !== 0) return
    log('Starting activity timer')
    setIdleExpiry(this.sessionTimeout)
    this.idleTracker.start()
    this.activityCheckTimer = window.setInterval(this.checkActivity, ACTIVITY_CHECK_INTERVAL)
  }

  public end = () => {
    log('Stopping activity timer')
    this.idleTracker.end()
    clearInterval(this.activityCheckTimer)
    this.activityCheckTimer = 0
  }
}

// Helpers

// When the user will be logged out if they do nothing from now on
const setIdleExpiry = (sessionTimeout: number) =>
  localStorage.setItem(LOCAL_STORAGE_IDLE_EXPIRY_KEY, String(Date.now() + sessionTimeout * 60_000))

// A missing value must not read as "long past", or the first check would log the
// user straight out. "start" seeds it, and any active tab resets it.
const getIdleExpiry = () => Number(localStorage.getItem(LOCAL_STORAGE_IDLE_EXPIRY_KEY)) || Infinity

// The server reports its deadline in unix seconds; everything here is in ms
export const setSessionExpiry = (expirySeconds: number) =>
  localStorage.setItem(LOCAL_STORAGE_SESSION_EXPIRY_KEY, String(expirySeconds * 1000))

// A missing value reads as 0, i.e. "due now", so the next check establishes a
// real deadline with a keep-alive
const getSessionExpiry = () => Number(localStorage.getItem(LOCAL_STORAGE_SESSION_EXPIRY_KEY))
