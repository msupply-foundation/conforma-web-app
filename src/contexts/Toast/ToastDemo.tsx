import React, { useState } from 'react'
import { Dropdown, Button, Form, Checkbox } from 'semantic-ui-react'

import { useToast, ToastStyle, Position } from '.'
import usePageTitle from '../../utils/hooks/usePageTitle'

export const ToastDemo: React.FC<any> = () => {
  const [title, setTitle] = useState('Message Title')
  const [text, setText] = useState('Message Text')
  const [position, setPosition] = useState<Position>(Position.bottomLeft)
  const [clickable, setClickable] = useState(true)
  const [showCloseIcon, setShowCloseIcon] = useState(false)
  const [style, setStyle] = useState<ToastStyle>('basic')
  const [timeDelay, setTimeDelay] = useState<number>(4000)
  // const [offset, setOffset] = useState({ x: 0, y: 0 })
  const { showToast, clearAllToasts, toasts } = useToast({ title: 'Hello', style: 'positive' })

  usePageTitle('Toast Demo')

  const positionOptions = [
    'bottom-left',
    'bottom-middle',
    'bottom-right',
    'top-left',
    'top-middle',
    'top-right',
  ].map((pos) => ({ text: pos, value: pos }))

  const styleOptions = ['basic', 'info', 'warning', 'positive', 'success', 'negative', 'error'].map(
    (style) => ({ text: style, value: style })
  )

  return (
    <div className="flex-column-center" style={{ marginTop: 30 }}>
      <div style={{ maxWidth: 400 }}>
        <Form className="flex-column" style={{ gap: 10 }}>
          <Form.Input
            label="Message Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Form.Input label="Message Text" value={text} onChange={(e) => setText(e.target.value)} />
          <Dropdown
            fluid
            selection
            label="Style"
            value={style}
            options={styleOptions}
            onChange={(_, { value }) => setStyle(value as ToastStyle)}
          />
          <Dropdown
            fluid
            selection
            label="Position"
            value={position}
            options={positionOptions}
            onChange={(_, { value }) => setPosition(value as Position)}
          />
          <div className="flex-row" style={{ gap: 10 }}>
            <Checkbox
              label="Clickable?"
              checked={clickable}
              onChange={() => setClickable(!clickable)}
            />
            <Checkbox
              label="Show Close Icon?"
              checked={showCloseIcon}
              onChange={() => setShowCloseIcon(!showCloseIcon)}
            />
          </div>
          <Form.Input
            label="Timeout"
            type="number"
            min={0}
            value={timeDelay}
            step={500}
            onChange={(e) => setTimeDelay(Number(e.target.value))}
          />
          <Button
            primary
            content="Toast it!"
            onClick={() => {
              const toastData: any = {
                title,
                text,
                position,
                clickable,
                showCloseIcon,
                style,
                timeout: timeDelay,
                // onClick: () => console.log('CLICKED'),
              }
              // if (Math.random() > 0.5) toastData.title = title
              showToast(toastData)
            }}
          />
          <Button
            secondary={toasts.length > 0}
            content="Clear all toasts"
            disabled={toasts.length === 0}
            onClick={clearAllToasts}
          />
        </Form>
      </div>
    </div>
  )
}

export default ToastDemo
