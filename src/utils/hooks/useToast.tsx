import React, { useState } from 'react'
import { Message, SemanticICONS, Transition } from 'semantic-ui-react'
import styleConstants from '../data/styleConstants'

const { HEADER_OFFSET, BOTTOM_OFFSET } = styleConstants

const TOAST_VERTICAL_MARGIN = '20px'
const TOAST_HORIZONTAL_MARGIN = '20px'

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
  })
  const [absolutePosition, setAbsolutePosition] = useState(
    calculatePosition(props.position, props.offset, props.title, props.text, props.style)
  )
  const [timeoutId, setTimeoutId] = useState<TimeoutType>(0)

  const displayToast = (state: ToastProps) => {
    clearTimeout(timeoutId)
    const newStyle = state.style ? getMessageStyleProps(state.style) : {}
    const newState = {
      ...messageState,
      header: state.title || messageState.header,
      content: state.text || messageState.content,
      ...newStyle,
    }

    if (state.showCloseIcon || props.showCloseIcon) newState.onDismiss = () => setShowToast(false)
    else delete newState.onDismiss

    // Clickable unless explicitly set to false
    if (state.clickable === false || props.clickable === false) delete newState.onClick
    else newState.onClick = () => setShowToast(false)

    setAbsolutePosition(
      calculatePosition(
        state.position || props.position,
        state.offset || props.offset,
        state.title || props.title,
        state.text || props.text,
        state.style || props.style
      )
    )

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
          className="toast-message"
          style={absolutePosition}
          {...messageState}
          hidden={!showToast}
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

const calculatePosition = (
  position: Position = 'bottom-left',
  offset: Offset = { x: 0, y: 0 },
  title: string = '',
  text: string = '',
  style: MessageStyle = 'basic'
) => {
  const xOffset = typeof offset.x === 'number' ? `${offset.x}px` : offset.x
  const yOffset = typeof offset.y === 'number' ? `${offset.y}px` : offset.y

  const centerOffset = (title: string, text: string) => {
    // This is a crude method to try and figure out the width of the element
    // based on its text length. Other methods have not been successful. :(
    const AVG_PX_PER_CHAR_TEXT = 6.5
    const AVG_PX_PER_CHAR_TITLE = 7.2
    const LEFT_SPACE = 24
    const RIGHT_SPACE = 50
    const ICON_SPACE = style !== 'basic' ? 75 : 0
    const MAX_WIDTH = 350
    const titleWidth = title.length * AVG_PX_PER_CHAR_TITLE
    const textWidth = text.length * AVG_PX_PER_CHAR_TEXT
    const width = Math.max(titleWidth, textWidth) + LEFT_SPACE + RIGHT_SPACE + ICON_SPACE
    return -Math.min(width, MAX_WIDTH) / 2
  }

  switch (position) {
    case 'bottom-left':
      return {
        bottom: `calc(${BOTTOM_OFFSET}px + ${TOAST_VERTICAL_MARGIN} + ${yOffset})`,
        left: `calc(${TOAST_HORIZONTAL_MARGIN} + ${xOffset})`,
      }
    case 'bottom-middle':
      return {
        bottom: `calc(${BOTTOM_OFFSET}px + ${TOAST_VERTICAL_MARGIN} + ${yOffset})`,
        left: `calc(50% + ${centerOffset(title, text)}px + ${xOffset})`,
      }
    case 'bottom-right':
      return {
        bottom: `calc(${BOTTOM_OFFSET}px + ${TOAST_VERTICAL_MARGIN} + ${yOffset})`,
        right: `calc(${TOAST_HORIZONTAL_MARGIN} + ${xOffset})`,
      }
    case 'top-left':
      return {
        top: `calc(${HEADER_OFFSET}px + ${TOAST_VERTICAL_MARGIN} + ${yOffset})`,
        left: `calc(${TOAST_HORIZONTAL_MARGIN} + ${xOffset})`,
      }
    case 'top-middle':
      return {
        top: `calc(${HEADER_OFFSET}px + ${TOAST_VERTICAL_MARGIN} + ${yOffset})`,
        left: `calc(50% + ${centerOffset(title, text)}px + ${xOffset})`,
      }
    case 'top-right':
      return {
        top: `calc(${HEADER_OFFSET}px + ${TOAST_VERTICAL_MARGIN} + ${yOffset})`,
        right: `calc(${TOAST_HORIZONTAL_MARGIN} + ${xOffset})`,
      }
  }
}
