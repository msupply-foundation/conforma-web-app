// A websocket connection to listen for either:
// - server gone offline (connection breaks)
// - system placed in "Maintenance" mode by Admin
// In either case, the user will be re-directed to a placeholder "Under
//   Maintenance" site, as specified in Server preferences

// Enable TESTING_MODE to see the same behaviour in Development as it would be
// in Production
const TESTING_MODE = false

import React, { useEffect, useRef, useState } from 'react'
import useWebSocket from 'react-use-websocket'
import { useUserState } from '../../contexts/UserState'
import { Position, useToast } from '../../contexts/Toast'
import isLoggedIn from '../../utils/helpers/loginCheck'
import getServerUrl from '../../utils/helpers/endpoints/endpointUrlBuilder'
import { usePrefs } from '../../contexts/SystemPrefs'
import { useLanguageProvider } from '../../contexts/Localisation'
import config from '../../config'

interface RedirectStatus {
  destination: string | null
  state: null | 'delayed' | 'immediate'
}
// "delayed" -- means redirect notification came while the user was already
// using the site, so we give them a little warning

// "immediate" -- means notification came on first load, so we redirect
// immediately before user even sees the site

const frontendVersion = config.version

export const ServerStatusListener: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { t } = useLanguageProvider()
  const {
    userState: { currentUser },
    onLogin,
    endSession,
  } = useUserState()
  const { maintenanceMode } = usePrefs()
  const [redirectStatus, setRedirectStatus] = useState<RedirectStatus>({
    destination: null,
    state: null,
  })
  const [serverDisconnected, setServerDisconnected] = useState(false)
  const { isProductionBuild } = config
  const timerId = useRef<number | undefined>()

  const productionBehaviour = isProductionBuild || TESTING_MODE

  // The handshake is the only point at which the server can read the auth
  // cookies, so it identifies a socket's session once, at connect. A socket
  // opened before login is therefore anonymous to it for as long as it stays
  // open, and gets no "session-expired" notification -- so logging in has to
  // establish a new one. Bumping a query parameter is what re-triggers the
  // hook's connection effect.
  //
  // Skipped when the page loaded already logged in, because that first
  // handshake carried the cookies itself.
  const [connectionGeneration, setConnectionGeneration] = useState(0)
  const socketHasSession = useRef(isLoggedIn())

  useEffect(() => {
    if (!currentUser || socketHasSession.current) return
    socketHasSession.current = true
    setConnectionGeneration((generation) => generation + 1)
  }, [currentUser])

  useWebSocket(getServerUrl('serverStatus'), {
    queryParams: { connection: connectionGeneration },
    onOpen: () => {
      if (serverDisconnected && productionBehaviour) {
        setServerDisconnected(false)
        clearAllToasts()
        showToast({
          title: t('SERVER_RECONNECTED'),
          text: t('SERVER_RECONNECTED_TEXT'),
          style: 'success',
        })
        // This will force logout if the session is no longer valid on the
        // server (e.g. its private key has changed)
        onLogin()
      }
    },
    onClose: (event) => {
      console.log('Close event', event)
      if (event.code === 1006) setServerDisconnected(true)
    },
    onError: (error) => {
      console.log('Error', error)
    },
    onMessage: (message) => {
      const data = JSON.parse(message.data)
      console.log('Message', data)
      if (typeof data !== 'object') return

      // The server sweeps expired sessions once a minute and tells whichever
      // sockets belonged to them. An idle client makes no requests, so this is
      // the only thing that would tell it promptly; without it the session is
      // discovered on the next request, which 401s.
      if (data.type === 'session-expired') {
        console.log('Session expired on server, logging out...')
        endSession()
        return
      }

      // Version check -- force reload if different to server version:
      if (productionBehaviour && data.version && data.version !== frontendVersion) {
        console.log('New version:', data.version)
        console.log('Reloading...')
        showToast({
          title: t('SERVER_VERSION_MISMATCH'),
          text: t('SERVER_VERSION_MISMATCH_TEXT'),
          style: 'warning',
        })
        setTimeout(() => location.reload(), 5_000)
      }

      // Maintenance Mode
      if (data.maintenanceMode === false) {
        window.clearTimeout(timerId.current)
        timerId.current = undefined
        showToast({
          title: t('SERVER_MAINTENANCE_OFF'),
          text: t('SERVER_MAINTENANCE_OFF_TEXT'),
          style: 'positive',
        })
        localStorage.removeItem('maintenanceMode')
      } else if (data.maintenanceMode) {
        setRedirectStatus({
          destination: data.redirect,
          state: data.force ? 'immediate' : 'delayed',
        })
        localStorage.setItem('maintenanceMode', 'ON')
      }
    },
    shouldReconnect: (event) => event.code === 1006,
    reconnectAttempts: 6,
    reconnectInterval: () => {
      console.log('Attempting to reconnect')
      return 5000
    },
    onReconnectStop: () => {
      console.log('Unable to reconnect, giving up...')
      if (maintenanceMode.redirect && productionBehaviour)
        window.location.href = maintenanceMode.redirect
    },
  })
  const { showToast, clearAllToasts } = useToast({ style: 'negative', position: Position.topLeft })

  // This effect handles the site intentionally being put into a "maintenance"
  // state (by an Admin)
  useEffect(() => {
    if ((isLoggedIn() && !currentUser) || !redirectStatus.state) return

    if (currentUser?.isAdmin) {
      if (redirectStatus.state === 'delayed')
        window.setTimeout(() => {
          showToast({
            title: t('SERVER_MAINTENANCE_ON'),
            text: t('SERVER_MAINTENANCE_ON_TEXT'),
            timeout: 10_000,
            style: 'warning',
          })
        }, 500)
      return
    }

    if (!productionBehaviour) return

    if (redirectStatus.state === 'immediate') {
      window.location.href = redirectStatus.destination as string
      return
    }

    showToast({
      title: t('SERVER_UNAVAILABLE'),
      text: t('SERVER_UNAVAILABLE_TEXT'),
      timeout: 9_000,
    })
    timerId.current = window.setTimeout(() => {
      window.location.href = redirectStatus.destination as string
    }, 10_000)
  }, [redirectStatus, currentUser])

  // This effect handles the server unexpectedly becoming unavailable
  useEffect(() => {
    if (serverDisconnected && productionBehaviour) {
      showToast({
        title: t('SERVER_OFFLINE'),
        text: t('SERVER_OFFLINE_TEXT'),
        timeout: 60_000,
        style: 'error',
      })
    }
  }, [serverDisconnected])

  if (isLoggedIn() && !currentUser) return null

  return <>{children}</>
}
