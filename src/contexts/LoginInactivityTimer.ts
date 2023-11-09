import IdleTracker from 'idle-tracker'

const LOCAL_STORAGE_KEY = 'expiryTime'

const IDLE_DETECT_TIME = 3000 // ms

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
    console.log('Idle state changed, Idle:', event.idle)
    switch (event.idle) {
      case true:
        console.log('Cueing logout')
        clearTimeout(this.logoutTimer)
        this.cueLogout()
        break
      case false:
        console.log('Clearing timer and expiry')
        clearTimeout(this.logoutTimer)
        setExpiry(null)
    }
  }

  private cueLogout = () => {
    console.log(new Date(), 'Cueing logout:', this.idleTimeout)
    setExpiry(this.idleTimeout)
    this.logoutTimer = window.setTimeout(this.atExpiryTime, this.idleTimeout * 60_000)
  }

  private atExpiryTime = () => {
    console.log('Checking expiry')
    const expiryTime = getExpiry()
    const now = Date.now()

    if (expiryTime === 0) {
      console.log('Expiry deleted, still active, start timer from beginning')
      this.logoutTimer = window.setTimeout(this.atExpiryTime, this.idleTimeout * 60_000)
      return
    }

    if (expiryTime > now) {
      // Reset timer to expiry time
      console.log('Resetting logout to new expiry:', new Date(expiryTime))
      clearTimeout(this.logoutTimer)
      this.logoutTimer = window.setTimeout(this.atExpiryTime, expiryTime - now)
      return
    }

    this.onLogout()
  }

  private onWindowUnload = () => setExpiry(this.idleTimeout)

  public start = () => {
    console.log('Starting timer', new Date())
    setExpiry(null)
    this.idleTimer.start()
    window.addEventListener('beforeunload', this.onWindowUnload)
  }

  public end = () => {
    console.log('Stopping timers', new Date())
    this.idleTimer.end()
    clearTimeout(this.logoutTimer)
    this.logoutTimer = 0
    window.removeEventListener('beforeunload', this.onWindowUnload)
  }
}

// Helpers
const setExpiry = (idleTime: number | null) => {
  if (idleTime === null) localStorage.removeItem(LOCAL_STORAGE_KEY)
  else localStorage.setItem(LOCAL_STORAGE_KEY, String(Date.now() + idleTime * 60_000 - 500))
}

const getExpiry = () => Number(localStorage.getItem(LOCAL_STORAGE_KEY) ?? 0)
