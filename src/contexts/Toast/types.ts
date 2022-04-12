import { SemanticICONS } from 'semantic-ui-react'

export type ToastStyle =
  | 'basic'
  | 'info'
  | 'warning'
  | 'success'
  | 'positive'
  | 'negative'
  | 'error'

export enum Position {
  bottomLeft = 'bottom-left',
  bottomMiddle = 'bottom-middle',
  bottomRight = 'bottom-right',
  topLeft = 'top-left',
  topMiddle = 'top-middle',
  topRight = 'top-right',
}

export const { bottomLeft, bottomMiddle, bottomRight, topLeft, topMiddle, topRight } = Position

export interface ToastProps {
  title: string
  text: string
  style: ToastStyle
  timeout: number
  clickable: boolean
  showCloseIcon: boolean // also makes it close-able
  onClick?: () => void
  position: Position
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
