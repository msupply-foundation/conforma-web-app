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
// export const ToastBlock = ({ toasts, setToasts }: ToastBlockProps) => {
//   const removeToast = (uid: string) => {
//     console.log(
//       'Current',
//       toasts.map((t) => t.uid)
//     )
//     setToasts(toasts.filter((toast) => toast.uid !== uid))
//   }

//   return (
//     <div id="toast-block">
//       {toasts.map((toast) => (
//         <Toast toast={toast} removeToast={() => removeToast(toast.uid)} key={toast.uid} />
//       ))}
//     </div>
//   )
// }
