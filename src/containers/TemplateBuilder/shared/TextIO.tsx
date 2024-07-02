import React, { useEffect, useState } from 'react'
import { Form, Icon, Input, Popup, SemanticICONS, TextArea } from 'semantic-ui-react'
import { SemanticCOLORS } from 'semantic-ui-react/dist/commonjs/generic'

const iconLink = 'https://react.semantic-ui.com/elements/icon/'
const colourLink = 'https://htmlcolorcodes.com/'

export type TextIOprops = {
  text?: string
  title?: string
  setText?: (text: string | null, resetValue: (text: string) => void) => void
  markNeedsUpdate?: () => void
  disabled?: boolean
  disabledMessage?: string
  icon?: string
  color?: string
  labelNegative?: boolean
  link?: string
  isTextArea?: boolean
  isPropUpdated?: boolean
  textAreaDefaultRows?: number
  iconColor?: SemanticCOLORS
  minLabelWidth?: number
  maxLabelWidth?: number
  labelTextAlign?: string
  onIconClick?: () => void
  additionalStyles?: object
}

const getDefaultRows = (text: string, textAreaDefaulRows: number) => {
  const rowsInText = text.match(/[\n]/g)?.length || 0
  return rowsInText === 0 ? textAreaDefaulRows : rowsInText + 2
}

const TextIO: React.FC<TextIOprops> = ({
  text = '',
  setText,
  markNeedsUpdate = () => {},
  disabled = false,
  title = '',
  icon,
  disabledMessage,
  color,
  labelNegative = false,
  link,
  isTextArea = false,
  textAreaDefaultRows = 4,
  isPropUpdated = false,
  iconColor,
  minLabelWidth = 50,
  maxLabelWidth,
  labelTextAlign = 'center',
  additionalStyles = {},
  onIconClick,
}) => {
  const [defaultRows] = useState(getDefaultRows(text ?? '', textAreaDefaultRows))
  const [innerValue, setInnerValue] = useState(text)
  const style: any = { minWidth: minLabelWidth, maxWidth: maxLabelWidth, textAlign: labelTextAlign }
  if (color) style.color = color
  const ioCSS = labelNegative ? 'io-component-negative' : 'io-component'

  useEffect(() => {
    if (isPropUpdated) setInnerValue(text)
  }, [text])

  const renderText = () => {
    if (setText) return null

    return (
      <div className={ioCSS + ' value'} style={{ whiteSpace: isTextArea ? 'normal' : 'nowrap' }}>
        {text}
      </div>
    )
  }

  const renderInput = () => {
    if (!setText) return null

    if (isTextArea) {
      return (
        <div className={ioCSS + ' value'}>
          <Form>
            <TextArea
              disabled={disabled}
              value={innerValue ?? ''}
              rows={defaultRows}
              onBlur={() => setText(innerValue === '' ? null : innerValue, setInnerValue)}
              onChange={(_, { value }) => {
                setInnerValue(String(value))
                markNeedsUpdate()
              }}
            />
          </Form>
        </div>
      )
    }

    return (
      <Input
        value={innerValue}
        disabled={disabled}
        className={ioCSS + ' value'}
        size="small"
        onChange={(_, { value }) => {
          setInnerValue(value)
          markNeedsUpdate()
        }}
        // Dont' want to try and query api on every key change of query text
        onBlur={() => setText(innerValue === '' ? null : innerValue, setInnerValue)}
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

export default TextIO
export { iconLink, colourLink }
