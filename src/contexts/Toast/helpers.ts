import { ToastStyle, MessageStyleProps } from './types'

export const getStyleProps = (style: ToastStyle = 'basic'): MessageStyleProps => {
  const styleProps: MessageStyleProps = {
    success: false,
    positive: false,
    info: false,
    negative: false,
    error: false,
    warning: false,
  }
  switch (style) {
    case 'basic':
      break
    case 'info':
      styleProps.info = true
      styleProps.icon = 'info circle'
      break
    case 'success':
      styleProps.success = true
      styleProps.icon = 'check circle outline'
      break
    case 'positive':
      styleProps.positive = true
      styleProps.icon = 'check circle outline'
      break
    case 'negative':
      styleProps.negative = true
      styleProps.icon = 'warning circle'
      break
    case 'error':
      styleProps.error = true
      styleProps.icon = 'warning circle'
      break
    case 'warning':
      styleProps.warning = true
      styleProps.icon = 'warning sign'
      break
  }
  return styleProps
}
