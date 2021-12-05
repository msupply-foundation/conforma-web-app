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
}

export const IconButton: React.FC<IconButtonProps> = ({
  name,
  onClick,
  title = '',
  size = undefined,
  disabledMessage,
  disabled = false,
}) => {
  const renderIcon = () => (
    <Icon
      className={`icon-button`}
      name={name}
      size={size}
      onClick={() => (disabled ? console.log('action disable') : onClick())}
    />
  )
  return (
    <Popup
      content={disabledMessage}
      disabled={!disabled || !disabledMessage}
      trigger={
        <div className={disabled ? '' : 'clickable'}>
          {title && (
            <div className={`io-wrapper`}>
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
