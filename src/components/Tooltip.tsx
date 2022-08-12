import React from 'react'
import { Icon, Popup } from 'semantic-ui-react'
import MarkdownBlock from '../utils/helpers/semanticReactMarkdown'

interface TooltipProps {
  message: string
}

const Tooltip: React.FC<TooltipProps> = ({ message }) => {
  return (
    <Popup
      content={<MarkdownBlock text={message} />}
      on="click"
      pinned
      trigger={<Icon name="help" />}
    />
  )
}

export default Tooltip
