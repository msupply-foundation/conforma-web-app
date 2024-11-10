import React, { useEffect, useState } from 'react'
import { Icon, Input, Popup, SemanticICONS } from 'semantic-ui-react'
import { TextIOprops } from './TextIO'

const iconLink = 'https://react.semantic-ui.com/elements/icon/'
const colourLink = 'https://htmlcolorcodes.com/'

type NumberIOprops = Omit<
  TextIOprops,
  'text' | 'setText' | 'isTextArea' | 'textAreaDefaultRows'
> & {
  number?: number | null
  setNumber?: (number: number | null, resetValue: (textValue: string) => void) => void
  inputWidth?: number
}

const NumberIO: React.FC<NumberIOprops> = ({
  number,
  setNumber,
  markNeedsUpdate = () => {},
  disabled = false,
  title = '',
  icon,
  disabledMessage,
  color,
  labelNegative = false,
  link,
  isPropUpdated = false,
  iconColor,
  minLabelWidth = 50,
  maxLabelWidth,
  labelTextAlign = 'center',
  additionalStyles = {},
  onIconClick,
  inputWidth = 80,
}) => {
  const [innerValue, setInnerValue] = useState(number === null ? '' : String(number))
  const style: any = { minWidth: minLabelWidth, maxWidth: maxLabelWidth, textAlign: labelTextAlign }
  if (color) style.color = color
  const ioCSS = labelNegative ? 'io-component-negative' : 'io-component'

  useEffect(() => {
    if (isPropUpdated) setInnerValue(String(number))
  }, [number])

  const renderText = () => {
    if (setNumber) return null
    return <div className={ioCSS + ' value'}>{number}</div>
  }

  const renderInput = () => {
    if (!setNumber) return null

    return (
      <Input
        value={innerValue}
        disabled={disabled}
        className={ioCSS + ' value'}
        size="small"
        onChange={(_, { value }) => {
          if (!value.match(/^-?[\d\.]*$/)) return
          setInnerValue(value)
          markNeedsUpdate()
        }}
        // Dont' want to try and query api on every key change of query text
        onBlur={() => setNumber(innerValue === '' ? null : Number(innerValue), setInnerValue)}
        style={{ width: inputWidth }}
      />
    )
  }

  const renderIcon = () => {
    const className = !!onIconClick ? 'clickable' : ''
    return (
      <Icon
        color={iconColor}
        style={{ marginLeft: 5 }}
        className={className}
        onClick={onIconClick}
        name={icon as SemanticICONS}
      />
    )
  }

  const renderLabel = () => {
    const keyClass = labelNegative ? 'io-component-negative key-negative' : 'io-component key'
    if (link) {
      return (
        <div style={style} className={keyClass}>
          <a style={style} target="_blank" href={link}>
            {title} {icon && renderIcon()}
          </a>
        </div>
      )
    }
    return (
      <div style={style} className={keyClass}>
        {title} {icon && renderIcon()}
      </div>
    )
  }

  return (
    <Popup
      content={disabledMessage}
      disabled={!disabled || !disabledMessage}
      trigger={
        <div className="io-wrapper" style={additionalStyles}>
          {renderLabel()}
          {renderText()}
          {renderInput()}
        </div>
      }
    />
  )
}

export default NumberIO
export { iconLink, colourLink }
