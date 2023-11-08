import React, { createContext, useContext, useEffect, useState, useRef } from 'react'
import { Message, Transition } from 'semantic-ui-react'
import { ToastProps, MessageProps, Position, bottomLeft } from './types'
import { getStyleProps } from './helpers'
import { nanoid } from 'nanoid'

const TRANSITION_DURATION = 350 // ms

const setTimeout = window.setTimeout // To ensure return type is number
interface ToastProviderValue {
  showToast: (...state: Partial<ToastProps>[]) => void
  updateDefaults: (state: Partial<ToastProps>) => void
  clearAllToasts: () => void
  toasts: ToastProps[]
}

type ToastState = ToastProps & { close: () => void }

const ToastProviderContext = createContext<ToastProviderValue>({
  showToast: () => {},
  updateDefaults: () => {},
  clearAllToasts: () => {},
  toasts: [],
})

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toastDefaults, setToastDefaults] = useState<ToastProps>({
    title: '',
    text: '',
    style: 'basic',
    timeout: 5000,
    clickable: true,
    showCloseIcon: true,
    position: bottomLeft,
    uid: '',
  })
  const [toasts, setToasts] = useState<ToastState[]>([])

  const updateDefaults = (newDefaults: Partial<ToastProps>) => {
    setToastDefaults((prevDefaults) => ({ ...prevDefaults, ...newDefaults }))
  }

  const showToast = (newToast: Partial<ToastProps> = {}) => {
    setToasts((prevState) => [
      ...prevState,
      { ...toastDefaults, ...newToast, uid: nanoid(8), close: () => {} },
    ])
  }

  const removeToast = (uid: string) => {
    setToasts((prevState) => prevState.filter((toast) => toast.uid !== uid))
  }

  const clearAllToasts = () => toasts.forEach((toast) => toast.close())

  return (
    <ToastProviderContext.Provider
      value={{
        showToast,
        clearAllToasts,
        updateDefaults,
        toasts,
      }}
    >
      <div id="toast-container">
        {Object.entries(Position).map(([key, positionClass]) => (
          <div className={`block ${positionClass}`} key={key}>
            {toasts
              .filter((toast) => toast.position === Position[key as keyof typeof Position])
              .map((toast) => (
                <Toast toast={toast} removeToast={() => removeToast(toast.uid)} key={toast.uid} />
              ))}
          </div>
        ))}
      </div>
      {children}
    </ToastProviderContext.Provider>
  )
}

export const useToast = (toastSettings: Partial<ToastProps> = {}) => {
  const { showToast, clearAllToasts, updateDefaults, toasts } = useContext(ToastProviderContext)
  useEffect(() => {
    updateDefaults(toastSettings)
  }, [])

  return { showToast, clearAllToasts, toasts }
}

export const Toast = ({ toast, removeToast }: { toast: ToastState; removeToast: () => void }) => {
  const [visible, setVisible] = useState(false)
  const timerId = useRef<number>(0)
  const { timeout } = toast

  useEffect(() => {
    // Small time-out so component changes from invisible to visible, which
    // allows the Transition component to apply nice fade-in effect.
    setTimeout(() => setVisible(true), 50)
    if (timeout !== 0)
      timerId.current = setTimeout(() => {
        setVisible(false)
        setTimeout(() => removeToast(), TRANSITION_DURATION + 50)
      }, timeout)
  }, [])

  const closeToast = () => {
    setVisible(false)
    clearTimeout(timerId.current)
    setTimeout(() => {
      removeToast()
    }, TRANSITION_DURATION + 50)
  }

  toast.close = closeToast // Mutate state directly

  const messageState: MessageProps = {
    header: toast.title,
    content: toast.text,
    onDismiss: toast.showCloseIcon ? closeToast : undefined,
    onClick: toast?.onClick ? toast.onClick : toast.clickable ? closeToast : undefined,
    floating: true,
    ...getStyleProps(toast.style),
  }

  return (
    <div className="toast-wrapper">
      <Transition visible={visible} animation="scale" duration={TRANSITION_DURATION}>
        <Message className="toast-message" {...messageState} />
      </Transition>
    </div>
  )
}
