import React, { useEffect, useState, Dispatch, SetStateAction } from 'react'
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

const Toast = ({ toast, removeToast }: { toast: MessageState; removeToast: any }) => {
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    setTimeout(() => setVisible(true), 200)
    setTimeout(() => setVisible(false), 4000)
  }, [])

  return (
    <div className="toast-container">
      <Transition visible={visible} animation="scale" duration={350}>
        <Message
          className="toast-message"
          onClick={() => setVisible(false)}
          // onClick={removeToast}
          //   style={absolutePosition}
          {...toast}
          //   hidden={!showToast}
        />
      </Transition>
    </div>
  )
}

export const ToastBlock = ({
  toasts,
  setToasts,
}: {
  toasts: MessageState[]
  setToasts: Dispatch<SetStateAction<MessageState[]>>
}) => {
  const removeToast = (index: number) => {
    console.log('Click', index)
    setToasts([...toasts.slice(0, index), ...toasts.slice(index + 1)])
  }

  console.log('Toasts', toasts)

  return (
    <div id="toast-block">
      <p>Toast stuff here</p>
      {toasts.map((toastState, index) => (
        <Toast toast={toastState} removeToast={() => removeToast(index)} key={index} />
      ))}
    </div>
  )
}
