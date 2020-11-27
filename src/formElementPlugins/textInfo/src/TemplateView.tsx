import React, { useState } from 'react'
import { Input } from 'semantic-ui-react'
import { TemplateViewProps } from '../../types'

const TemplateView: React.FC<TemplateViewProps> = ({ parameters, onUpdate }) => {
  const [text, setText] = useState(parameters.text)
  const [title, setTitle] = useState(parameters.title)

  const onChangeText = (_: any, { value }: any) => {
    setText(value)
    onUpdate({ text: value })
  }
  const onChangeTitle = (_: any, { value }: any) => {
    setTitle(value)
    onUpdate({ title: value })
  }
  return (
    <>
      <Input fluid label={'Title'} value={title} onChange={onChangeTitle} />
      <Input fluid label={'Text'} value={text} onChange={onChangeText} />
    </>
  )
}

export default TemplateView
