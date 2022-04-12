import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  Dispatch,
  SetStateAction,
} from 'react'
import config from '../../config'
import strings from '../../utils/defaultLanguageStrings'
import { Message, SemanticICONS, Transition } from 'semantic-ui-react'
import styleConstants from '../../utils/data/styleConstants'
import {
  ToastProps,
  MessageState,
  MessageStyle,
  Position,
  Offset,
  MessageStyleProps,
} from './types'
import { ToastBlock } from './ToastElements'

const { HEADER_OFFSET, BOTTOM_OFFSET } = styleConstants

const TOAST_VERTICAL_MARGIN = '20px'
const TOAST_HORIZONTAL_MARGIN = '20px'

const defaultMessageState = {
  header: 'Testing',
  content: 'Here is the text',
  floating: true,
  success: false,
  positive: false,
  info: false,
  negative: false,
  error: false,
  warning: false,
}

type ToastReturn = [any, (state?: ToastProps) => void]
type TimeoutType = ReturnType<typeof setTimeout>

interface ToastProviderValue {
  showToast: (state: ToastProps) => void
  setToastSettings: (state: ToastProps) => void
}

const ToastProviderContext = createContext<ToastProviderValue>({
  showToast: () => {},
  setToastSettings: () => {},
})

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [newToastSettings, setNewToastSettings] = useState<ToastProps>({})
  const [currentToasts, setCurrentToasts] = useState<MessageState[]>([
    {
      header: 'Test',
      content: 'Nothing',
      icon: 'info',
      success: true,
      positive: false,
      info: false,
      negative: false,
      error: false,
      warning: false,
      floating: false,
    },
    {
      header: 'Test2',
      content: 'Nothing',
      icon: 'info',
      success: false,
      positive: false,
      info: false,
      negative: true,
      error: false,
      warning: false,
      floating: false,
    },
  ])

  const showToast = (state: ToastProps) => {
    // Add a Message component to current toasts
    const newStyle = state.style ? getMessageStyleProps(state.style) : {}
    const newState: MessageState = {
      ...defaultMessageState,
      header: state.title || 'Test', // || messageState.header,
      content: state.text || 'Contents', // messageState.content,
      ...newStyle,
    }

    // if (state.showCloseIcon) newState.onDismiss = () => setShowToast(false)
    // else delete newState.onDismiss

    // Clickable unless explicitly set to false
    // if (state.clickable === false || props.clickable === false) delete newState.onClick
    // else newState.onClick = () => setShowToast(false)
    setCurrentToasts([...currentToasts, newState])
  }

  const setToastSettings = (state: ToastProps) => {
    setNewToastSettings(state)
  }
  return (
    <ToastProviderContext.Provider value={{ showToast, setToastSettings }}>
      <ToastBlock toasts={currentToasts} setToasts={setCurrentToasts} />
      {children}
    </ToastProviderContext.Provider>
  )
}

export const useToast = (toastSettings?: ToastProps | undefined) => {
  const { showToast, setToastSettings } = useContext(ToastProviderContext)

  useEffect(() => {
    if (toastSettings) setToastSettings(toastSettings)
  }, [])

  return { showToast, setToastSettings }
}

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
