/**
 * A module to handle auto-logout after a certain amount of user idle time. In
 * addition to basic idle detection and timer, additional complexity is involved
 * due to the fact that we need this to work across multiple tabs -- if a user
 * has another Conforma tab open in the background, we don't want that tab to
 * log out if there's another tab still active, as that will clear the auth
 * credentials of the active tab too.
 *
 * To achieve this, we used a shared "expiry" value in localStorage. This is
 * loosely based on an idea presented in https://medium.com/tinyso/b6279663acf2
 *
 * The basic operation is:
 * - The "idleTracker" records the current "idle" state -- "idle" meaning user
 *   has had no interaction (keyboard, mouse, etc) with the app for 5 seconds.
 * - A "checkIdleState" timer runs every 2.5 seconds:
 *   - If user is currently *active* (not idle), we write the expiry time (Now +
 *     input "idleTimeout" -- default 60 mins) to local storage. (This is the
 *     time that log out will occur if the user was to stay idle from now on.)
 *   - If user is *idle*, we read the saved expiry time from local storage (this
 *     value could have been set by any tab that had been active recently). If
 *     it's in the past, we log out. If it's still in the future, we do nothing.
 */

import IdleTracker from 'idle-tracker'
import config from '../config'

const DEBUG_LOGGING = false

// How long user needs to have been active before being considered "idle"
const IDLE_DETECT_TIME = 5000 // ms

// How often to check the saved expiry time and act accordingly (e.g. logout, or
// update expiry time)
const EXPIRY_CHECK_INTERVAL = 2500 // ms

export const LOCAL_STORAGE_EXPIRY_KEY = 'expiryTime'
const LOCAL_STORAGE_JWT_KEY = config.localStorageJWTKey

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

export class LoginInactivityTimer {
  idleTimeout: number // minutes
  onLogout: () => void
  idleTracker: IdleTracker
  idleCheckTimer: number

  constructor({ idleTimeout, onLogout }: TimerProps) {
    this.idleTimeout = idleTimeout
    this.idleTracker = new IdleTracker({ timeout: IDLE_DETECT_TIME })
    this.onLogout = onLogout
    this.idleCheckTimer = 0
  }

  private checkIdleState = () => {
    log('Checking idle state')

    if (!localStorage.getItem(LOCAL_STORAGE_JWT_KEY)) {
      // This means another tab must have already logged out since the last
      // check
      log('No JWT -- logging out!')
      this.onLogout()
      return
    }

    switch (this.idleTracker.isIdle()) {
      case true:
        log('We are IDLE')
        const expiryTime = getExpiry()
        const now = Date.now()
        if (now > expiryTime) {
          log('Expired -- logging out!')
          this.onLogout()
        } else log('Not expired, doing nothing')
        break

      case false:
        log(
          'We are ACTIVE, setting expiry time ' +
            new Date(Date.now() + this.idleTimeout * 60_000).toLocaleTimeString()
        )
        setExpiry(this.idleTimeout)
        break
    }
  }

  public start = () => {
    log('Starting idle timer')
    setExpiry(this.idleTimeout)
    this.idleTracker.start()
    this.idleCheckTimer = window.setInterval(this.checkIdleState, EXPIRY_CHECK_INTERVAL)
  }

  public end = () => {
    log('Stopping idle timer')
    this.idleTracker.end()
    clearInterval(this.idleCheckTimer)
  }
}

// Helpers
const setExpiry = (idleTime: number | null) => {
  if (idleTime === null) localStorage.removeItem(LOCAL_STORAGE_EXPIRY_KEY)
  else localStorage.setItem(LOCAL_STORAGE_EXPIRY_KEY, String(Date.now() + idleTime * 60_000))
}

const getExpiry = () => Number(localStorage.getItem(LOCAL_STORAGE_EXPIRY_KEY) ?? 0)
