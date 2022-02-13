import React, { useState } from 'react'
import { Dropdown, Button, Form, Checkbox } from 'semantic-ui-react'

import useToast, { MessageStyle, Position } from '../utils/hooks/useToast'

const ToastDemo: React.FC<any> = () => {
  const [title, setTitle] = useState('Message Title')
  const [text, setText] = useState('Message Text')
  const [position, setPosition] = useState<Position>('bottom-left')
  const [clickable, setClickable] = useState(true)
  const [showCloseIcon, setShowCloseIcon] = useState(false)
  const [style, setStyle] = useState<MessageStyle>('basic')
  const [timeDelay, setTimeDelay] = useState<number>(5000)
  const [toastComponent, showToast] = useToast()

  // 'bottom-left'
  // | 'bottom-middle'
  // | 'bottom-right'
  // | 'top-left'
  // | 'top-middle'
  // | 'top-right'
  const positionOptions = [
    { text: 'Bottom left', value: 'bottom-left' },
    { text: 'Bottom middle', value: 'bottom-middle' },
  ]

  const styleOptions = ['basic', 'info', 'warning', 'positive', 'success', 'negative', 'error'].map(
    (x) => ({ text: x, value: x })
  )
  return (
    <div style={{ maxWidth: 400 }}>
      {toastComponent}
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
          onChange={(_, { value }) => setStyle(value as MessageStyle)}
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
          min={500}
          value={timeDelay}
          step={500}
          onChange={(e) => setTimeDelay(Number(e.target.value))}
        />
        <Button
          primary
          content="Toast it!"
          onClick={() =>
            showToast({
              title,
              text,
              position,
              clickable,
              showCloseIcon,
              style,
              timeout: timeDelay,
            })
          }
        />
      </Form>
    </div>
  )
}

export default ToastDemo
