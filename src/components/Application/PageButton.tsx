import React from 'react'
import { Button } from 'semantic-ui-react'

type ButtonDirection = 'left' | 'right'

interface PageButtonProps {
  title: string
  type: ButtonDirection
  onClicked: () => void
}

const PageButton: React.FC<PageButtonProps> = (props) => {
  const { title, type, onClicked } = props
  return (
    <Button
      labelPosition={type}
      icon={type === 'right' ? 'right arrow' : 'left arrow'}
      content={title}
      onClick={() => onClicked()}
    />
  )
}

export default PageButton
