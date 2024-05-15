// A websocket connection to listen for either:
// - server gone offline (connection breaks)
// - system placed in "Maintenance" mode by Admin
// In either case, the user will be re-directed to a placeholder "Under
//   Maintenance" site, as specified in Server preferences

import React, { useEffect, useState } from 'react'
import useWebSocket from 'react-use-websocket'
import { useUserState } from '../../contexts/UserState'
import { Position, useToast } from '../../contexts/Toast'
import isLoggedIn from '../../utils/helpers/loginCheck'
import getServerUrl from '../../utils/helpers/endpoints/endpointUrlBuilder'
import { usePrefs } from '../../contexts/SystemPrefs'

interface RedirectStatus {
  destination: string | null
  state: null | 'delayed' | 'immediate'
}
// "delayed" -- means redirect notification came while the user was already
// using the site, so we give them a little warning

// "immediate" -- means notification came on first load, so we redirect
// immediately before user even sees the site

export const ServerStatusListener: React.FC = ({ children }) => {
  const {
    userState: { currentUser },
  } = useUserState()
  const { maintenanceMode } = usePrefs()
  const [redirectStatus, setRedirectStatus] = useState<RedirectStatus>({
    destination: null,
    state: null,
  })
  const [serverDisconnected, setServerDisconnected] = useState(false)
  useWebSocket(getServerUrl('serverStatus'), {
    onOpen: () => {
      if (serverDisconnected) {
        setServerDisconnected(false)
        clearAllToasts()
        showToast({
          title: 'Server re-connected!',
          text: 'We apologise fo the interruption',
          style: 'success',
        })
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
      if (data.maintenanceMode === false) {
        showToast({
          title: 'Maintenance mode: OFF',
          text: 'Normal server functionality restored',
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
      if (maintenanceMode.redirect) window.location.href = maintenanceMode.redirect
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
            title: 'Maintenance mode enabled',
            text: "If you weren't the person who enabled this, you should stop what you're doing and log out until maintenance is complete",
            timeout: 10_000,
            style: 'warning',
          })
        }, 500)
      return
    }

    if (redirectStatus.state === 'immediate') {
      window.location.href = redirectStatus.destination as string
      return
    }

    showToast({
      title: 'Server unavailable',
      text: 'The server is now under maintenance. You will be re-directed to a holding page in 10 seconds',
      timeout: 9_000,
    })
    window.setTimeout(() => {
      window.location.href = redirectStatus.destination as string
    }, 10_000)
  }, [redirectStatus, currentUser])

  // This effect handles the server unexpectedly becoming unavailable
  useEffect(() => {
    if (serverDisconnected) {
      showToast({
        title: 'Server offline!',
        text: 'Conforma has lost connection with the server. We will attempt to re-connect, but you will be re-directed to a holding page in 30 seconds if not successful.',
        timeout: 60_000,
        style: 'error',
      })
    }
  }, [serverDisconnected])

  if (isLoggedIn() && !currentUser) return null

  return <>{children}</>
}
