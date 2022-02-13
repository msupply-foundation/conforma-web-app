import { off } from 'process'
import React, { useState } from 'react'
import { Message, SemanticICONS, Transition } from 'semantic-ui-react'

export type MessageStyle =
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

type Offset = { x: number | string; y: number | string }

interface ToastProps {
  title?: string
  text?: string
  style?: MessageStyle
  timeout?: number
  clickable?: boolean
  showCloseIcon?: boolean // also makes it close-able
  position?: Position
  offset?: Offset
}

type ToastReturn = [any, (state?: ToastProps) => void]
type TimeoutType = ReturnType<typeof setTimeout>

interface MessageStyleProps {
  icon?: SemanticICONS
  success: boolean
  positive: boolean
  info: boolean
  negative: boolean
  error: boolean
  warning: boolean
  position?: Position
}

interface MessageState extends MessageStyleProps {
  header: string
  content: string
  onDismiss?: () => void
  onClick?: () => void
  floating: boolean
}

const useToast = (props: ToastProps = {}): ToastReturn => {
  const [showToast, setShowToast] = useState(false)
  const [messageState, setMessageState] = useState<MessageState>({
    header: props.title || '',
    content: props.text || '',
    floating: true,
    ...getMessageStyleProps(props.style),
    position: props.position || 'bottom-left',
  })
  const [offset, setOffset] = useState(calculateOffset(props.offset))
  const [timeoutId, setTimeoutId] = useState<TimeoutType>(0)

  console.log('offset', props.offset, offset)

  const displayToast = (state: ToastProps) => {
    clearTimeout(timeoutId)
    const newStyle = state.style ? getMessageStyleProps(state.style) : {}
    const newState = {
      ...messageState,
      header: state.title || messageState.header,
      content: state.text || messageState.content,
      ...newStyle,
      position: state.position || messageState.position,
    }

    if (state.showCloseIcon || props.showCloseIcon) newState.onDismiss = () => setShowToast(false)
    else delete newState.onDismiss

    // Clickable unless explicitly set to false
    if (state.clickable === false || props.clickable === false) delete newState.onClick
    else newState.onClick = () => setShowToast(false)

    setOffset(calculateOffset(state.offset || props.offset))

    setMessageState(newState)
    setShowToast(true)
    setTimeoutId(
      setTimeout(() => {
        setShowToast(false)
      }, state.timeout ?? props.timeout ?? 3000)
    )
  }

  return [
    <div className="toast-container">
      <Transition visible={showToast} animation="scale" duration={350}>
        <Message
          className={'toast-message ' + messageState.position}
          {...messageState}
          style={offset}
        />
      </Transition>
    </div>,
    (state = {}) => displayToast(state),
  ]
}

export default useToast

const getMessageStyleProps = (style: MessageStyle = 'basic'): MessageStyleProps => {
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

const calculateOffset = (offset: Offset | undefined) => {
  if (!offset) return {}
  const x = typeof offset.x === 'number' ? `${offset.x}px` : offset.x
  const y = typeof offset.y === 'number' ? `${offset.y}px` : offset.y
  return { transform: `translate(${x}, ${y})` }
}
