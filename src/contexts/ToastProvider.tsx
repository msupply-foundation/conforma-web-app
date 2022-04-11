import React, { createContext, useContext, useEffect, useState } from 'react'
import config from '../config'
import strings from '../utils/defaultLanguageStrings'
import { Message, SemanticICONS, Transition } from 'semantic-ui-react'
import styleConstants from '../utils/data/styleConstants'

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

const ToastBlock = ({ state }: { state: MessageState[] }) => {
  return (
    <div id="toast-block">
      {state.map((toastState) => (
        <div className="toast-container">
          <Transition visible={true} animation="scale" duration={350}>
            <Message
              className="toast-message"
              //   style={absolutePosition}
              {...toastState}
              //   hidden={!showToast}
            />
          </Transition>
        </div>
      ))}
    </div>
  )
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [newToastSettings, setNewToastSettings] = useState<ToastProps>({})
  const [currentToasts, setCurrentToasts] = useState<MessageState[]>([])

  const showToast = (state: ToastProps) => {
    // Add a Message component to current toasts
  }

  const setToastSettings = (state: ToastProps) => {
    setNewToastSettings(state)
  }
  return (
    <ToastProviderContext.Provider value={{ showToast, setToastSettings }}>
      <ToastBlock state={currentToasts} />
      {children}
    </ToastProviderContext.Provider>
  )
}

export const useToast = (toastSettings: ToastProps | undefined) => {
  const { showToast, setToastSettings } = useContext(ToastProviderContext)

  useEffect(() => {
    if (toastSettings) setToastSettings(toastSettings)
  }, [])

  return { showToast, setToastSettings }
}
