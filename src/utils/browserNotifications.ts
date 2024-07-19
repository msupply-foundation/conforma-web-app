// Guide:
// https://levelup.gitconnected.com/creating-browser-notification-in-javascript-79e91bfb76c8

export const BrowserNotifications = {
  checkPermission: async () => {
    if (Notification.permission !== 'granted') Notification.requestPermission()
  },
  notify: async (notification: {
    title: string
    body: string
    onClick?: () => void
    onFocus?: () => void
    showIfTabFocused?: boolean
  }) => {
    const { title, body, onClick, onFocus, showIfTabFocused = false } = notification
    if (Notification.permission === 'default') await Notification.requestPermission()
    if (Notification.permission !== 'granted') return

    const showNotification = (!showIfTabFocused && !document.hasFocus()) || showIfTabFocused

    if (onFocus && document.hasFocus()) {
      onFocus()
    }

    if (showNotification) {
      const notification = new Notification(title, { body })
      if (!document.hasFocus() && onFocus) {
        window.onfocus = () => {
          onFocus()
          window.onfocus = null
          notification.close()
        }
      }
      notification.onclick = () => {
        onClick && onClick()
        window.parent.focus()
        notification.close()
      }
    }
  },
}
