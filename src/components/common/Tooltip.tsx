import React from 'react'
import { Icon, Popup, SemanticCOLORS, SemanticICONS } from 'semantic-ui-react'
import MarkdownBlock from '../../utils/helpers/semanticReactMarkdown'

interface TooltipProps {
  message: string
  triggerEvent?: 'click' | 'hover'
  icon?: SemanticICONS
  color?: SemanticCOLORS
  minWidth?: number
  maxWidth?: number
  style?: object
  popupStyle?: object
  iconStyle?: object
  className?: string
}

export const Tooltip: React.FC<TooltipProps> = ({
  message,
  triggerEvent = 'click',
  icon = 'help circle',
  color = 'grey',
  minWidth = 300,
  maxWidth = 550,
  style,
  popupStyle = style,
  iconStyle,
  className = 'tooltip',
}) => {
  return (
    <Popup
      className={className}
      style={{
        minWidth,
        maxWidth,
        ...popupStyle,
      }}
      content={<MarkdownBlock text={message} />}
      on={triggerEvent}
      pinned
      offset={[-12]}
      trigger={<Icon name={icon} color={color} className="tooltip-trigger" style={iconStyle} />}
    />
  )
}
