import { useState, useEffect, useRef } from 'react'
import IdleTracker from 'idle-tracker'

const useLoginTimers = (timeout: number) => {
  const [isIdle, setIsIdle] = useState(false)

  const idleTracker = useRef(
    new IdleTracker({
      timeout: 30_000,
      // preferences.logoutAfterInactivity * 60_000,
      //   onIdleCallback: handleIdleTimeout,
    })
  )
}
