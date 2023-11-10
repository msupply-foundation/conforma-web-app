/**
 * A module to handle auto-logout after a certain amount of user idle time. The
 * complexity is due to the fact that we need this to work across multiple tabs
 * -- if a user has another Conforma tab open in the background, we don't want
 * that tab to log out if there's another tab still active, as that will clear
 * the auth credentials of the active tab too.
 *
 * To achieve this, we used a shared "expiry" value in localStorage. This is
 * loosely based on an idea presented in https://medium.com/tinyso/b6279663acf2
 *
 * The basic operation is:
 * - The "idleTracker" detects whenever a user goes idle for more than 3
 *   seconds, or returns from idle.
 * - On going idle, we set the expiry time in localStorage (based on input
 *   "idleTimeout") and start a timer that will log out at that time.
 * - If the user becomes active again, the expiry time is deleted from
 *   localStorage and the logout timer is cancelled.
 * - When the logout timer elapses, we read the expiry time from local storage:
 *   - If it's now later than the current time, that means another tab has been
 *     active in the meantime, so we restart our timer to logout at this new
 *     expiry time.
 *   - If the expiry time is no longer present, that means that another tab is
 *     *currently* active, so we restart our timer to logout after our
 *     "idleTimeout" (this cycle will repeat until an expiryTime is detected, or
 *     the current tab becomes active).
 *   - If the expiry time is less than/equal to the current time, we know no
 *     other tabs have been active, so we can log out.
 *
 * There is one more case to consider: if a user is active in one tab and closes
 * that tab before "idle" begins, there won't be any expiry time written to
 * local storage. And then when another (inactive) tab reaches the end of its
 * logout time, it will think another tab is still active and remain in that
 * cycle indefinitely (i.e. never log out. To handle this case, we add an event
 * listener to the window to capture tab/window closing and write the expiry
 * time to local storage on this event.
 */

import IdleTracker from 'idle-tracker'

const DEBUG_LOGGING = false

export const LOCAL_STORAGE_EXPIRY_KEY = 'expiryTime'
const IDLE_DETECT_TIME = 3000 // ms

const log = (text: any) => {
  if (DEBUG_LOGGING) {
    const d = new Date()
    console.log(`${d.toLocaleTimeString()}: ${text}`)
  }
}

interface TimerProps {
  idleTimeout: number // minutes
  onLogout: () => void
}

type IdleTimerEvent = { idle: boolean; event?: Event } // from IdleTracker

export class LoginInactivityTimer {
  idleTimeout: number // minutes
  onLogout: () => void
  idleTimer: IdleTracker
  logoutTimer: number

  constructor({ idleTimeout, onLogout }: TimerProps) {
    this.idleTimeout = idleTimeout
    this.idleTimer = new IdleTracker({
      timeout: IDLE_DETECT_TIME,
      onIdleCallback: this.handleIdleStateChange,
    })
    this.onLogout = onLogout
    this.logoutTimer = 0
  }

  private handleIdleStateChange = (event: IdleTimerEvent) => {
    log('Idle state changed, Idle:' + event.idle)
    switch (event.idle) {
      case true:
        clearTimeout(this.logoutTimer)
        this.cueLogout()
        break
      case false:
        log('Clearing timer and expiry')
        clearTimeout(this.logoutTimer)
        setExpiry(null)
    }
  }

  private cueLogout = () => {
    log('Cueing logout:' + this.idleTimeout + 'mins')
    setExpiry(this.idleTimeout)
    this.logoutTimer = window.setTimeout(this.atExpiryTime, this.idleTimeout * 60_000)
  }

  private atExpiryTime = () => {
    log('Checking expiry')
    const expiryTime = getExpiry()
    const now = Date.now()

    if (expiryTime === 0) {
      log('Expiry deleted, still active, restart timer')
      this.logoutTimer = window.setTimeout(this.atExpiryTime, this.idleTimeout * 60_000)
      return
    }

    if (expiryTime > now) {
      // Reset timer to expiry time
      log('Resetting logout to new expiry:' + new Date(expiryTime).toLocaleTimeString())
      clearTimeout(this.logoutTimer)
      this.logoutTimer = window.setTimeout(this.atExpiryTime, expiryTime - now)
      return
    }

    log('Logging out!')
    this.onLogout()
  }

  private onWindowUnload = () => setExpiry(this.idleTimeout)

  public start = () => {
    log('Starting idle timer' + new Date().toLocaleTimeString())
    setExpiry(null)
    this.idleTimer.start()
    window.addEventListener('beforeunload', this.onWindowUnload)
  }

  public end = () => {
    log('Stopping idle timer')
    this.idleTimer.end()
    clearTimeout(this.logoutTimer)
    this.logoutTimer = 0
    window.removeEventListener('beforeunload', this.onWindowUnload)
  }
}

// Helpers
const setExpiry = (idleTime: number | null) => {
  if (idleTime === null) localStorage.removeItem(LOCAL_STORAGE_EXPIRY_KEY)
  else localStorage.setItem(LOCAL_STORAGE_EXPIRY_KEY, String(Date.now() + idleTime * 60_000 - 500))
}

const getExpiry = () => Number(localStorage.getItem(LOCAL_STORAGE_EXPIRY_KEY) ?? 0)
