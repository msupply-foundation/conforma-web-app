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
import { ToastProps, MessageProps, ToastStyle, Position, Offset, MessageStyleProps } from './types'
import { ToastBlock } from './ToastElements'
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

  const showToast = (newToast: Partial<ToastProps> = {}) => {
    setCurrentToasts([...currentToasts, { ...newToastSettings, ...newToast, uid: nanoid(8) }])
  }

  const setToastSettings = (newSettings: Partial<ToastProps>) => {
    setNewToastSettings((currSettings) => ({ ...currSettings, ...newSettings }))
  }

  return (
    <ToastProviderContext.Provider
      value={{
        showToast,
        setToastSettings,
      }}
    >
      <ToastBlock
        toasts={currentToasts.map((toast) => ({ ...newToastSettings, ...toast }))}
        setToasts={setCurrentToasts}
      />
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
