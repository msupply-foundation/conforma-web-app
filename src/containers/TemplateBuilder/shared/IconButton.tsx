import React from 'react'

import { Icon, Popup } from 'semantic-ui-react'
import { IconSizeProp } from 'semantic-ui-react/dist/commonjs/elements/Icon/Icon'
import { SemanticICONS } from 'semantic-ui-react/dist/commonjs/generic'

type IconButtonProps = {
  disabledMessage?: string
  disabled?: boolean
  title?: string
  name: SemanticICONS
  size?: IconSizeProp
  onClick: () => void
  hidden?: boolean
  additionalStyles?: object
  toolTip?: string
}

export const IconButton: React.FC<IconButtonProps> = ({
  name,
  onClick,
  title = '',
  size = undefined,
  disabledMessage,
  disabled = false,
  hidden,
  additionalStyles = {},
  toolTip,
}) => {
  const renderIcon = () => (
    <Icon
      className={`icon-button`}
      name={name}
      size={size}
      onClick={() => (disabled ? console.log('action disable') : onClick())}
      title={toolTip}
    />
  )
  return (
    <Popup
      content={disabledMessage}
      disabled={!disabled || !disabledMessage}
      trigger={
        <div
          className={disabled ? '' : 'clickable'}
          style={{ visibility: hidden ? 'hidden' : 'visible' }}
        >
          {title && (
            <div className={`io-wrapper`} style={{ ...additionalStyles }}>
              <div className="io-component key">{title}</div>
              <div className="io-component value">{renderIcon()}</div>
            </div>
          )}
          {!title && renderIcon()}
        </div>
      }
    />
  )
}
