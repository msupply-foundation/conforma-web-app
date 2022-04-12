import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
  SetStateAction,
} from 'react'
import config from '../../config'
import strings from '../../utils/defaultLanguageStrings'
import { Message, SemanticICONS, Transition } from 'semantic-ui-react'
import styleConstants from '../../utils/data/styleConstants'
import {
  ToastProps,
  MessageProps,
  ToastStyle,
  Position,
  Offset,
  MessageStyleProps,
  TimeoutType,
} from './types'
// import { Toast } from './ToastElements'
import { getStyleProps } from './helpers'
import { nanoid } from 'nanoid'

const { HEADER_OFFSET, BOTTOM_OFFSET } = styleConstants

const TOAST_VERTICAL_MARGIN = '20px'
const TOAST_HORIZONTAL_MARGIN = '20px'

interface ToastProviderValue {
  showToast: (state: Partial<ToastProps>) => void
  setToastSettings: (state: Partial<ToastProps>) => void
}

const ToastProviderContext = createContext<ToastProviderValue>({
  showToast: () => {},
  setToastSettings: () => {},
})

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [newToastSettings, setNewToastSettings] = useState<ToastProps>({
    title: '',
    text: '',
    style: 'basic',
    timeout: 5000,
    clickable: true,
    showCloseIcon: true,
    position: 'bottom-left',
    offset: { x: 0, y: 0 },
    uid: '',
  })
  const [currentToasts, setCurrentToasts] = useState<ToastProps[]>([])

  const setToastSettings = (newSettings: Partial<ToastProps>) => {
    setNewToastSettings((currSettings) => ({ ...currSettings, ...newSettings }))
  }

  const showToast = (newToast: Partial<ToastProps> = {}) => {
    setCurrentToasts((prevState) => [
      ...prevState,
      { ...newToastSettings, ...newToast, uid: nanoid(8) },
    ])
  }

  const removeToast = (uid: string) => {
    setCurrentToasts((prevState) => prevState.filter((toast) => toast.uid !== uid))
  }

  return (
    <ToastProviderContext.Provider
      value={{
        showToast,
        setToastSettings,
      }}
    >
      <div id="toast-block">
        {currentToasts.map((toast) => (
          <Toast toast={toast} removeToast={() => removeToast(toast.uid)} key={toast.uid} />
        ))}
      </div>
      {children}
    </ToastProviderContext.Provider>
  )
}

export const useToast = (toastSettings: Partial<ToastProps> = {}) => {
  const { showToast, setToastSettings } = useContext(ToastProviderContext)
  useEffect(() => {
    setToastSettings(toastSettings)
  }, [])

  return { showToast, setToastSettings }
}

export const Toast = ({ toast, removeToast }: { toast: ToastProps; removeToast: () => void }) => {
  const [visible, setVisible] = useState(false)
  const timerId = useRef<TimeoutType>(0)
  const { timeout } = toast

  useEffect(() => {
    console.log('Launching', toast.uid)
    setTimeout(() => setVisible(true), 50)
    timerId.current = setTimeout(() => {
      setVisible(false)
      setTimeout(() => removeToast(), 400)
    }, timeout)
  }, [])

  const closeToast = () => {
    setVisible(false)
    clearTimeout(timerId.current)
    setTimeout(() => {
      removeToast()
    }, 50)
  }

  const messageState: MessageProps = {
    header: toast.title,
    content: toast.text,
    onDismiss: toast.showCloseIcon ? closeToast : undefined,
    onClick: toast.clickable ? closeToast : undefined,
    floating: true,
    ...getStyleProps(toast.style),
  }

  return (
    <div className="toast-container">
      <Transition visible={visible} animation="scale" duration={350}>
        <Message
          className="toast-message"
          //   style={absolutePosition}
          {...messageState}
        />
      </Transition>
    </div>
  )
}