import React, { useEffect, useState, useRef, Dispatch, SetStateAction } from 'react'
import config from '../../config'
import strings from '../../utils/defaultLanguageStrings'
import { Message, SemanticICONS, Transition } from 'semantic-ui-react'
import styleConstants from '../../utils/data/styleConstants'
import { getStyleProps } from './helpers'
import { nanoid } from 'nanoid'
import {
  ToastProps,
  MessageProps,
  TimeoutType,
  ToastStyle,
  Position,
  Offset,
  MessageStyleProps,
} from './types'

interface ToastBlockProps {
  toasts: ToastProps[]
  setToasts: Dispatch<SetStateAction<ToastProps[]>>
}
export const ToastBlock = ({ toasts, setToasts }: ToastBlockProps) => {
  const removeToast = (uid: string) => {
    console.log(
      'Current',
      toasts.map((t) => t.uid)
    )
    setToasts(toasts.filter((toast) => toast.uid !== uid))
  }
  useEffect(() => {
    console.log(
      'After removal',
      toasts.map((t) => t.uid)
    )
  }, [toasts])

  return (
    <div id="toast-block">
      {toasts.map((toast) => (
        <Toast toast={toast} removeToast={() => removeToast(toast.uid)} key={toast.uid} />
      ))}
    </div>
  )
}

const Toast = ({ toast, removeToast }: { toast: ToastProps; removeToast: () => void }) => {
  const [visible, setVisible] = useState(false)
  //   const [timeoutId, setTimeoutId] = useState<TimeoutType>(0)
  const { timeout } = toast

  //   console.log('timeoutId', timeoutId)

  useEffect(() => {
    console.log('Launching', toast.uid)
    setTimeout(() => setVisible(true), 50)
    setTimeout(() => setVisible(false), timeout)
    setTimeout(() => removeToast(), timeout + 400)
    // setTimeoutId()
  }, [])

  const closeToast = () => {
    setVisible(false)
    // clearTimeout(timeoutId)
    // setTimeout(() => {
    //   console.log('Removing', toast.uid)
    //   removeToast()
    // }, 400)
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
