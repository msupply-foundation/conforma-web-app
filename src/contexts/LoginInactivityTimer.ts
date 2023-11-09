import IdleTracker from 'idle-tracker'

const LOCAL_STORAGE_KEY = 'expiryTime'

interface TimerProps {
  idleTime: number // minutes
  onLogout: () => void
}

type IdleTimerEvent = { idle: boolean; event?: Event } // from IdleTracker

export class LoginInactivityTimer {
  idleTime: number // minutes
  onLogout: () => void
  idleTimer: IdleTracker
  waitTillExpiryTimer: number
  keepAliveLooper: number
  previousExpiryTime: number

  constructor({ idleTime, onLogout }: TimerProps) {
    this.idleTime = idleTime
    this.waitTillExpiryTimer = 0
    this.keepAliveLooper = 0
    this.previousExpiryTime = 0
    this.idleTimer = new IdleTracker({
      timeout: idleTime * 60_000,
      onIdleCallback: this.handleIdleTimeout,
    })
    this.onLogout = onLogout
  }

  private handleIdleTimeout = (event: IdleTimerEvent) => {
    console.log('Handling idle timeout')
    switch (event.idle) {
      // When user becomes idle
      case true:
        console.log('Gone idle', new Date())
        const expiryTime = getExpiryTime()
        console.log('expiryTime', new Date(expiryTime))

        const now = Date.now()
        console.log('expiry', expiryTime)
        console.log('now', now)
        if (expiryTime < now) this.onLogout()
        else {
          console.log('Now waiting till', new Date(expiryTime))
          console.log('Thats', (expiryTime - now) / 1000)
          this.waitTillExpiryTimer = window.setTimeout(() => this.recheckExpiry(), expiryTime - now)
          this.previousExpiryTime = expiryTime
        }
        break
      // When user resumes from idle
      case false:
        console.log('Alive again', new Date())
        clearTimeout(this.waitTillExpiryTimer)
        break
    }
  }

  private recheckExpiry = () => {
    console.log('Rechecking expiry', new Date())
    const expiryTime = getExpiryTime()
    console.log('expiryTime', new Date(expiryTime))
    if (expiryTime === this.previousExpiryTime) {
      this.onLogout()
    } else {
      // Set timer and check again
      this.previousExpiryTime = expiryTime
      console.log('Now waiting till', new Date(expiryTime - Date.now()))
      console.log('Thats', (expiryTime - Date.now()) / 1000)
      window.setTimeout(() => this.recheckExpiry(), expiryTime - Date.now())
    }
  }

  private keepAlive = () => {
    if (!this.idleTimer.isIdle()) {
      console.log('Keep alive', new Date(), 'idle', this.idleTimer.isIdle())
      setExpiryTime(this.idleTime)
    }
  }

  public start = () => {
    console.log('Starting timer', new Date())
    this.idleTimer.start()
    this.keepAliveLooper = window.setInterval(() => this.keepAlive(), 10000)
  }

  public end = () => {
    console.log('Stopping timers', new Date())
    this.idleTimer.end()
    clearTimeout(this.waitTillExpiryTimer)
    clearTimeout(this.keepAliveLooper)
  }
}

// Helpers
const setExpiryTime = (idleTime: number) =>
  localStorage.setItem(LOCAL_STORAGE_KEY, String(Date.now() + idleTime * 60_000 - 500))

const getExpiryTime = () => Number(localStorage.getItem(LOCAL_STORAGE_KEY) ?? 0)
