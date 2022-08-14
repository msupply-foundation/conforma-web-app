import React from 'react'
import { Icon, Popup, SemanticCOLORS, SemanticICONS } from 'semantic-ui-react'
import MarkdownBlock from '../utils/helpers/semanticReactMarkdown'

interface TooltipProps {
  message: string
  type?: 'click' | 'hover'
  icon?: SemanticICONS
  color?: SemanticCOLORS
  minWidth?: number
  maxWidth?: number
  style?: object
}

const Tooltip: React.FC<TooltipProps> = ({
  message,
  type = 'click',
  icon = 'help circle',
  color = 'grey',
  minWidth = 300,
  maxWidth = 550,
  style,
}) => {
  return (
    <Popup
      style={{
        minWidth,
        maxWidth,
        ...style,
      }}
      content={<MarkdownBlock text={message} />}
      on={type}
      pinned
      offset={-12}
      trigger={<Icon name={icon} color={color} className="tooltip-trigger" />}
    />
  )
}

export default Tooltip
