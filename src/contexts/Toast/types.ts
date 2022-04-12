import { SemanticICONS } from 'semantic-ui-react'

export type ToastStyle =
  | 'basic'
  | 'info'
  | 'warning'
  | 'success'
  | 'positive'
  | 'negative'
  | 'error'

export type Position =
  | 'bottom-left'
  | 'bottom-middle'
  | 'bottom-right'
  | 'top-left'
  | 'top-middle'
  | 'top-right'

export type Offset = { x: number | string; y: number | string }

export type TimeoutType = ReturnType<typeof setTimeout>

export interface ToastProps {
  title: string
  text: string
  style: ToastStyle
  timeout: number
  clickable: boolean
  showCloseIcon: boolean // also makes it close-able
  position: Position
  offset: Offset
  uid: string
}

export interface MessageStyleProps {
  icon?: SemanticICONS
  success: boolean
  positive: boolean
  info: boolean
  negative: boolean
  error: boolean
  warning: boolean
  position?: Position
}

export interface MessageProps extends MessageStyleProps {
  header: string
  content: string
  onDismiss?: () => void
  onClick?: () => void
  floating: boolean
}
