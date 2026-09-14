/**
 * Keeps the server-side session in step with what the user is actually doing,
 * so that it ends once they have been inactive for "logoutAfterInactivity".
 *
 * Only the browser can measure inactivity: the server sees requests, and
 * someone typing into a long form makes none. The session therefore has to be
 * held open from here, and the whole difficulty is doing that without holding
 * it open for longer than the user was really present -- a session that
 * outlives its own inactivity window is the thing this exists to prevent.
 *
 * The answer is to heartbeat on the *transitions* rather than on a schedule.
 * The last heartbeat before a user disappears is the one sent when they go
 * idle, one idle threshold after their final interaction, so the session lands
 * at "last interaction + threshold + window" -- an overshoot of seconds,
 * whatever the window length. Nothing needs to tell the server when the user
 * went idle, because the timing of the request says it.
 *
 * A heartbeat goes out when:
 *
 * - the user goes idle -- the important one, since it fixes the deadline
 * - the user comes back -- extends, or discovers the session died while away
 * - half a window has passed and they are still working -- so a long working
 *   session cannot lapse. Half, so a failed attempt has room to be retried.
 * - the deadline we expect has passed (the "backstop" below)
 *
 * Logging out is not this module's job. The session ends on the server, and the
 * app finds out from the 401 that a heartbeat comes back with -- which is also
 * the only thing that can expire the auth cookies, since they are HttpOnly and
 * script cannot touch them. The same 401 covers the endings no timer could
 * predict: an admin revoking a session, a snapshot restore, a logout on another
 * device.
 *
 * The backstop is what asks the question when nobody is interacting. Without it
 * an idle tab would sit looking logged in until the "session-expired" websocket
 * message arrived, which would make that message load-bearing rather than a
 * prompt. It deliberately fires a margin AFTER the expected end: arriving early
 * would find the session alive, and a live session extends on any request that
 * reaches it, which is exactly the overshoot being avoided.
 *
 * Two things are shared through localStorage rather than held in memory,
 * because they have to survive a reload and be seen by every tab: the login
 * flag, whose removal is how a tab learns another one logged out, and the end
 * of the session, so tabs agree on one deadline instead of each chasing its own
 * stale copy. Neither is sensitive -- the tokens themselves stay invisible to
 * JavaScript in HttpOnly cookies.
 *
 * The deadline is the server's, so it is only as good as this machine's clock
 * agreeing with the server's. A clock running behind simply makes the backstop
 * late, which is harmless; one running far enough ahead would have it ask while
 * the session is still alive, and be answered with an extension. That is what
 * the "asked early" handling below is for.
 */

import IdleTracker from 'idle-tracker'
import config from '../../config'
import { isUnauthenticated } from '../../utils/helpers/fetchMethods'

const DEBUG_LOGGING = false

/*
What counts as "gone idle", and so how far past the user's last interaction the
session can be extended. Short, because it is pure overshoot -- but not so short
that a pause for thought registers as leaving.
*/
const IDLE_THRESHOLD = 10_000 // ms

/*
The shortest gap between heartbeats. Someone reading a question pauses either
side of the threshold repeatedly, and without this each crossing would be two
requests. The cost of having it is that a going-idle heartbeat can be suppressed
by a recent one, so the true overshoot bound is IDLE_THRESHOLD plus this.
*/
const MIN_HEARTBEAT_GAP = 30_000 // ms

/*
How long after the expected end to ask. Late is safe and early is not: by the
time the session has actually expired, nothing on the server will renew it, so
the request can only come back 401. Wide enough to absorb a browser waking a
throttled timer late, or the clock being nudged.
*/
const BACKSTOP_MARGIN = 30_000 // ms

// A failed heartbeat says nothing about the session, so it is retried rather
// than acted on. Matches the websocket's own reconnect policy.
const HEARTBEAT_RETRY_DELAY = 5_000 // ms
const MAX_HEARTBEAT_RETRIES = 6

/*
setTimeout takes a 32-bit delay, and anything longer wraps and fires
immediately. Long waits are therefore re-armed in chunks, which has the
happier side effect of re-reading the clock along the way -- a laptop that
slept through its deadline notices on the next chunk.
*/
const MAX_TIMEOUT_CHUNK = 3_600_000 // ms

/*
Events that mean a person is present. Deliberately not idle-tracker's default
list, which also includes "visibilitychange", "resize", "scroll" and "change" --
locking the screen, opening devtools, or the app scrolling an element into view
would all register as activity, and here activity buys a whole fresh window.
*/
const INTERACTION_EVENTS = [
  'keydown',
  'mousedown',
  'mouseup',
  'mousemove',
  'touchstart',
  'touchend',
  'wheel',
]

// Recording the same mousemove a thousand times tells us nothing extra
const INTERACTION_THROTTLE = 1_000 // ms

const LOCAL_STORAGE_SESSION_END_KEY = 'sessionEndsAt'
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
  // Resolves to when the session now expires, in unix seconds, and rejects with
  // a RequestError carrying 401 once there is no session behind the cookies
  onHeartbeat: () => Promise<number | undefined>
  onSessionEnded: () => void
}

/*
Records when the server says the session will end. Exported because login and
"/user-info" report the same deadline, which seeds the backstop for a tab that
is restored and then never touched -- it would otherwise have nothing to work
from until the user did something.

Only ever moves the deadline forward, mirroring the GREATEST the server extends
with, so a response overtaken by a later one cannot drag it back and have the
backstop ask while the session is still alive.
*/
export const setSessionEnd = (expirySeconds: number) => {
  if (!Number.isFinite(expirySeconds) || expirySeconds <= 0) return
  const endsAt = expirySeconds * 1000
  try {
    const stored = Number(localStorage.getItem(LOCAL_STORAGE_SESSION_END_KEY))
    if (Number.isFinite(stored) && stored >= endsAt) return
    localStorage.setItem(LOCAL_STORAGE_SESSION_END_KEY, String(endsAt))
  } catch {
    // Local storage can be unavailable outright (Safari private browsing), and
    // then the backstop simply isn't armed from a shared value
  }
}

const getSessionEnd = (): number | null => {
  try {
    const stored = localStorage.getItem(LOCAL_STORAGE_SESSION_END_KEY)
    if (stored === null) return null
    const endsAt = Number(stored)
    return Number.isFinite(endsAt) ? endsAt : null
  } catch {
    return null
  }
}

export class SessionActivityTimer {
  private onHeartbeat: () => Promise<number | undefined>
  private onSessionEnded: () => void

  // A window of 0 means auto-logout is disabled, and the server puts the
  // session's expiry decades out to match. Nothing needs keeping alive and
  // nothing is going to expire, so only the transitions still heartbeat -- they
  // are what would notice a session revoked some other way.
  private autoLogoutDisabled: boolean
  private activePeriod: number // ms -- half a window
  private minHeartbeatGap: number // ms

  private idleTracker: IdleTracker | null = null
  private running = false
  // Set once the session is over, or a deliberate logout has begun. A late
  // response then has nothing left to act on.
  private finished = false

  // Null until a real event is seen, so that merely loading the page -- a
  // browser restoring twenty tabs, or the reload every logout performs --
  // cannot pass for someone being here
  private lastInteractionAt: number | null = null
  private lastHeartbeatAt = 0
  private heartbeatInFlight = false
  private failures = 0

  private activeTimer = 0
  private backstopTimer = 0
  private retryTimer = 0

  // Whether the heartbeat in flight was the backstop's, and whether the last
  // one that was found the session still there -- meaning we asked too early
  private backstopPending = false
  private askedEarly = false

  constructor({ sessionTimeout, onHeartbeat, onSessionEnded }: TimerProps) {
    this.onHeartbeat = onHeartbeat
    this.onSessionEnded = onSessionEnded

    // A missing or nonsensical preference must not reach a timer: setTimeout(NaN)
    // fires immediately, which would be a request loop rather than a slow one
    const windowMs =
      Number.isFinite(sessionTimeout) && sessionTimeout > 0 ? sessionTimeout * 60_000 : 0
    this.autoLogoutDisabled = windowMs === 0
    this.activePeriod = Math.max(windowMs / 2, IDLE_THRESHOLD)
    this.minHeartbeatGap = Math.min(MIN_HEARTBEAT_GAP, windowMs / 4)
  }

  public start = () => {
    if (this.running) return
    log('Starting session activity timer')
    this.running = true
    this.finished = false
    this.lastInteractionAt = null

    // Built here rather than in the constructor because idle-tracker keeps its
    // idle flag across an end(), and would report a restarted tracker as idle
    // until the next interaction. A fresh one also avoids its start() leaving
    // the previous run's listeners attached.
    this.idleTracker = new IdleTracker({
      timeout: IDLE_THRESHOLD,
      events: INTERACTION_EVENTS,
      onIdleCallback: this.onIdleChange,
    })
    this.idleTracker.start()

    INTERACTION_EVENTS.forEach((eventName) =>
      document.addEventListener(eventName, this.noteInteraction, { passive: true })
    )
    window.addEventListener('storage', this.onStorage)
    document.addEventListener('visibilitychange', this.onBecameVisible)
    window.addEventListener('focus', this.onBecameVisible)
    window.addEventListener('pageshow', this.onBecameVisible)

    this.scheduleActiveHeartbeat()
    this.armBackstop()
  }

  public end = () => {
    log('Stopping session activity timer')
    this.running = false
    this.finished = true

    window.clearTimeout(this.activeTimer)
    window.clearTimeout(this.backstopTimer)
    window.clearTimeout(this.retryTimer)
    this.activeTimer = 0
    this.backstopTimer = 0
    this.retryTimer = 0

    this.idleTracker?.end()
    this.idleTracker = null

    INTERACTION_EVENTS.forEach((eventName) =>
      document.removeEventListener(eventName, this.noteInteraction)
    )
    window.removeEventListener('storage', this.onStorage)
    document.removeEventListener('visibilitychange', this.onBecameVisible)
    window.removeEventListener('focus', this.onBecameVisible)
    window.removeEventListener('pageshow', this.onBecameVisible)
  }

  /**
   * Ask the server whether the session is still there. The websocket calls this
   * when the server reports a session has ended: making the request is what
   * produces the 401 that ends it here, so a message that turns out to be wrong
   * costs a request rather than the user's session.
   */
  public heartbeat = () => this.send()

  /**
   * Called before a deliberate logout, so that the 401 it produces isn't
   * reported back to the user as having been logged out for inactivity.
   */
  public beginLogout = () => {
    this.finished = true
  }

  // -- Triggers --

  private noteInteraction = () => {
    const now = Date.now()
    if (this.lastInteractionAt !== null && now - this.lastInteractionAt < INTERACTION_THROTTLE)
      return
    this.lastInteractionAt = now
    // Someone is here again, so the deadline is about to be re-established from
    // a fresh response and the backstop is worth arming once more
    this.askedEarly = false
  }

  private onIdleChange = ({ idle }: { idle: boolean }) => {
    if (this.finished) return

    if (idle) {
      // The heartbeat that fixes where the session ends. Skipped if nobody has
      // touched this tab, because then there is no presence to record.
      if (this.lastInteractionAt === null) return
      log('User went idle -- heartbeat')
      this.requestHeartbeat()
      return
    }

    this.lastInteractionAt = Date.now()
    log('User came back -- heartbeat')
    this.requestHeartbeat()
  }

  private scheduleActiveHeartbeat = () => {
    window.clearTimeout(this.activeTimer)
    this.activeTimer = 0
    if (this.finished || this.autoLogoutDisabled) return
    this.activeTimer = window.setTimeout(
      this.onActiveTick,
      Math.min(this.activePeriod, MAX_TIMEOUT_CHUNK)
    )
  }

  private onActiveTick = () => {
    this.scheduleActiveHeartbeat()
    if (this.lastInteractionAt === null || this.idleTracker?.isIdle()) return
    log('Still working -- heartbeat')
    this.requestHeartbeat()
  }

  private armBackstop = () => {
    window.clearTimeout(this.backstopTimer)
    this.backstopTimer = 0
    if (this.finished || this.autoLogoutDisabled) return

    // A hidden tab's timers are throttled or frozen, so it cannot be relied on
    // to ask at the right moment -- and a logout nobody is looking at is not a
    // prompt one anyway. It asks when it is looked at again instead, which also
    // spares a background tab discarding an unsubmitted form on a timer.
    if (document.visibilityState !== 'visible') return

    // The last one found the session still alive, so this machine's clock is
    // ahead of the server's by more than the margin. Asking again on the next
    // deadline would extend the session again, and go on doing so for as long
    // as the tab is open, so it waits for the user to come back -- or for the
    // websocket, which needs no clock at all.
    if (this.askedEarly) return

    const endsAt = getSessionEnd()
    if (endsAt === null) return

    const delay = Math.max(0, endsAt + BACKSTOP_MARGIN - Date.now())
    log(`Session expected to end ${asTime(endsAt)}`)
    this.backstopTimer = window.setTimeout(
      delay > MAX_TIMEOUT_CHUNK ? this.armBackstop : () => this.send(true),
      Math.min(delay, MAX_TIMEOUT_CHUNK)
    )
  }

  private onBecameVisible = () => {
    if (this.finished || document.visibilityState !== 'visible') {
      window.clearTimeout(this.backstopTimer)
      this.backstopTimer = 0
      return
    }
    // Re-reads the clock, so a tab whose deadline passed while it was hidden or
    // asleep asks straight away rather than on a timer that never ran
    this.armBackstop()
  }

  // -- Sending --

  private requestHeartbeat = () => {
    if (Date.now() - this.lastHeartbeatAt < this.minHeartbeatGap) {
      log('Heartbeat suppressed -- one went recently')
      return
    }
    this.send()
  }

  private send = async (fromBackstop = false) => {
    if (this.finished || this.heartbeatInFlight) return
    this.heartbeatInFlight = true
    // Set only once the send is actually going ahead: a backstop turned away at
    // the guard above must not leave the flag standing for the next heartbeat,
    // which would read a perfectly timely answer as having been asked early
    this.backstopPending = fromBackstop
    window.clearTimeout(this.retryTimer)
    this.retryTimer = 0

    try {
      const sessionExpiry = await this.onHeartbeat()
      this.lastHeartbeatAt = Date.now()
      this.failures = 0
      // Answered rather than refused, so the session was still there. If the
      // backstop is what asked, it asked before the session had ended.
      if (this.backstopPending) this.askedEarly = true
      if (typeof sessionExpiry === 'number') setSessionEnd(sessionExpiry)
      this.armBackstop()
    } catch (err) {
      if (isUnauthenticated(err)) {
        // The session is gone, and this response is what expired the cookies
        if (this.finished) return
        log('Session has ended')
        this.end()
        this.onSessionEnded()
        return
      }
      // A request that didn't arrive says nothing about the session, so the
      // user stays logged in and it is tried again
      console.error('Problem sending heartbeat:', err)
      this.failures += 1
      if (this.failures <= MAX_HEARTBEAT_RETRIES)
        this.retryTimer = window.setTimeout(this.send, HEARTBEAT_RETRY_DELAY)
    } finally {
      this.heartbeatInFlight = false
      this.backstopPending = false
    }
  }

  // -- Shared state --

  private onStorage = (event: StorageEvent) => {
    if (this.finished) return

    // Checked before anything else is read: the Apollo cache is persisted to
    // local storage too, and every write of it lands here in every other tab
    if (event.key !== null && event.key !== LOCAL_STORAGE_LOGIN_KEY) {
      if (event.key === LOCAL_STORAGE_SESSION_END_KEY) this.armBackstop()
      return
    }

    // A null key is the whole of local storage being cleared, which needs the
    // flag read directly rather than taken from the event
    const loggedOutElsewhere =
      event.key === null ? !localStorage.getItem(LOCAL_STORAGE_LOGIN_KEY) : event.newValue === null
    if (!loggedOutElsewhere) return

    log('Another tab logged out')
    this.end()
    this.onSessionEnded()
  }
}
