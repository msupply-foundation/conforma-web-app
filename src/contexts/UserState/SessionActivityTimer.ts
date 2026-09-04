/**
 * Keeps the server-side session in step with what the user is actually doing,
 * so that it ends when they have been inactive for "logoutAfterInactivity".
 *
 * Two separate deadlines are involved, and the module only makes sense if
 * they're kept apart:
 *
 * 1. The IDLE deadline -- last user interaction + logoutAfterInactivity. This
 *    is what "logout after inactivity" means. Only the browser can measure it,
 *    because interaction means mouse and keyboard activity, not requests.
 *
 * 2. The SESSION deadline -- when the server will drop the session row. The
 *    server reports it as "sessionExpiry" on the login and "/user-info"
 *    responses.
 *
 * They move for different reasons. The server only extends a session when it
 * mints an access token, so ordinary requests carrying a valid token don't
 * touch deadline 2 -- meaning a user typing into a long form pushes deadline 1
 * forward continuously while deadline 2 runs down, and would be logged out
 * mid-edit. So whenever deadline 2 gets close and the user is still inside
 * deadline 1, we call "/user-info", the one route that extends the session
 * unconditionally. For a user who stays active that works out to roughly one
 * request per session window.
 *
 * Note the ping is NOT conditional on the user interacting at that instant.
 * Someone reading the page for two minutes counts as idle by the short
 * threshold below, but is nowhere near their inactivity deadline, and their
 * session must not be allowed to lapse.
 *
 * Each ping reports deadline 1, and the server holds the session to it instead
 * of extending by a whole window (see the "notPast" cap on renewSession). That
 * is what stops deadline 2 drifting past deadline 1: pinging while the user is
 * inside their window means the last *request* runs ahead of the last
 * *interaction*, and an uncapped extension would leave the session alive long
 * after the user went idle -- with no browser still watching to notice, if the
 * tab has since been closed. Capped, deadline 2 converges on deadline 1 and the
 * session expires when it should whether this browser is running or not.
 *
 * So logging out is not this timer's job. The session ends on the server, and
 * the app finds out either from the "session-expired" websocket message
 * (handled in ServerStatusListener) or from a 401 -- which is also how it
 * learns about the endings no timer could predict, like an admin revoking a
 * session or a snapshot restore. Once the two deadlines have converged there is
 * nothing left to ask for, so pinging stops until deadline 2 actually passes;
 * the ping that then fails is the backstop for a websocket that never delivered.
 *
 * Both deadlines live in localStorage rather than React state, for three
 * reasons: this is a plain class, outside React; the values have to survive a
 * page reload; and above all they have to be shared between tabs, or a
 * background tab would report its own stale idea of when the user last did
 * something and cut the active tab's session short. (Loosely based on an idea
 * presented in https://medium.com/tinyso/b6279663acf2.) Neither value is
 * sensitive -- the access token itself stays invisible to JavaScript, in an
 * HttpOnly cookie.
 *
 * The basic operation is:
 * - The "idleTracker" records the current "idle" state -- "idle" meaning the
 *   user has had no interaction (keyboard, mouse, etc) with the app for one
 *   check interval.
 * - A "checkActivity" timer runs on that same interval:
 *   - If the login flag has gone from local storage, another tab has logged
 *     out, so this one follows it.
 *   - If the user is currently *active*, push the idle deadline forward. Any
 *     tab may do this, and every tab reads it.
 *   - If the session deadline is within "margin", call "/user-info", reporting
 *     the idle deadline -- unless the two have already converged and the
 *     session deadline is still ahead of us, in which case there is nothing to
 *     ask for.
 */

import IdleTracker from 'idle-tracker'
import config from '../../config'

const DEBUG_LOGGING = false

/*
How often the user's activity is looked at, and equally the quiet period that
counts as "idle" -- deliberately one value, because the two must not diverge.

"Idle" is a flag the tracker raises once this long has passed without an
interaction, and drops the moment one arrives, so each check can only observe
the window immediately behind it. Consecutive checks therefore have to cover
contiguous windows: check less often than the threshold and interaction
falling in the gaps is never seen, so the idle deadline stops being pushed
forward and an active user is logged out. Checking every 10s while treating 5s
of quiet as idle does exactly that to a user who interacts every 10s -- the
periods resonate, and no check ever lands soon enough after an interaction to
notice one.

Checking more often than the threshold would be safe, but buys nothing beyond
slightly prompter cross-tab logout, so there is no reason to keep two values
that could drift apart.
*/
const ACTIVITY_CHECK_INTERVAL = 10_000 // ms

// How far ahead of the session deadline to keep it alive. Wide enough that a
// ping failing for a reason unrelated to auth (network blip, server restart)
// is retried on later checks before the session actually ends.
const KEEP_ALIVE_MARGIN = 60_000 // ms

const LOCAL_STORAGE_IDLE_EXPIRY_KEY = 'idleExpiry'
const LOCAL_STORAGE_SESSION_EXPIRY_KEY = 'sessionExpiry'
const LOCAL_STORAGE_LOGIN_KEY = config.localStorageLoginKey

const log = (text: string) => {
  if (DEBUG_LOGGING) {
    const d = new Date()
    console.log(`${d.toLocaleTimeString()}: ${text}`)
  }
}

const asTime = (ms: number) => new Date(ms).toLocaleTimeString()

interface TimerProps {
  sessionTimeout: number // minutes -- the server's "logoutAfterInactivity"
  // "idleDeadline" is unix seconds, as the server reports expiry, and is
  // undefined when there is no deadline to hold the session to
  onKeepAlive: (idleDeadline?: number) => Promise<unknown>
  onSessionEnded: () => void
}

export class SessionActivityTimer {
  sessionTimeout: number // minutes
  autoLogoutDisabled: boolean
  margin: number // ms
  onKeepAlive: (idleDeadline?: number) => Promise<unknown>
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
    this.idleTracker = new IdleTracker({ timeout: ACTIVITY_CHECK_INTERVAL })
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

    // The session already lasts as long as the user has left, so pinging could
    // only ask for what it has -- until the deadline passes, when the ping is
    // what discovers the session has gone if the websocket didn't say so
    if (sessionExpiry && idleExpiry <= sessionExpiry && Date.now() < sessionExpiry) {
      log(`Session ends ${asTime(sessionExpiry)} with the user idle from ${asTime(idleExpiry)}`)
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
      // Auto-logout disabled means there is no deadline to hold the session to
      // -- reporting one would cut a deliberately indefinite session short. Nor
      // is there one to report before any tab has seeded it.
      const reportedDeadline =
        this.autoLogoutDisabled || !Number.isFinite(idleExpiry)
          ? undefined
          : Math.round(idleExpiry / 1000)
      await this.onKeepAlive(reportedDeadline)
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
