import React, { useEffect, useState } from 'react'
import { Dropdown, Popup } from 'semantic-ui-react'

type StringOrNumber = number | string
type GetterOrKey = ((row: any) => StringOrNumber) | string

type DropdownIOprops = {
  value: StringOrNumber
  title?: string
  setValue?: (
    value: StringOrNumber,
    fullValue: any,
    resetValue: (value: StringOrNumber) => void
  ) => void
  disabled?: boolean
  disabledMessage?: string
  labelNegative?: boolean
  link?: string
  isPropUpdated?: boolean
  options?: any[]
  search?: boolean
  getKey?: GetterOrKey
  getValue?: GetterOrKey
  getText?: GetterOrKey
  placeholder?: string
  minLabelWidth?: number
  maxLabelWidth?: number
  labelTextAlign?: string
  additionalStyles?: object
}

const defaultGetters: GetterOrKey = (row) => String(row)

const getterOrKeyHelper = (getterOrKey: GetterOrKey, value: any) => {
  try {
    if (typeof getterOrKey === 'function') return getterOrKey(value)
    if (typeof getterOrKey === 'string') return value[getterOrKey]
  } catch (e) {
    console.log(e)
    return 'cant resolve row'
  }
}

const DropdownIO: React.FC<DropdownIOprops> = ({
  value,
  setValue,
  disabled = false,
  title = '',
  disabledMessage,
  labelNegative = false,
  link,
  isPropUpdated = false,
  options = [],
  search = false,
  getKey = defaultGetters,
  getValue = defaultGetters,
  getText = defaultGetters,
  placeholder,
  minLabelWidth = 100,
  maxLabelWidth,
  labelTextAlign = 'center',
  additionalStyles = {},
}) => {
  const [innerValue, setInnerValue] = useState(value)
  const style: any = {
    minWidth: minLabelWidth,
    maxWidth: maxLabelWidth,
    textAlign: labelTextAlign,
    ...additionalStyles,
  }
  const ioCSS = labelNegative ? 'io-component-negative' : 'io-component'

  useEffect(() => {
    if (isPropUpdated) setInnerValue(value)
  }, [value])
  const renderText = () => {
    if (setValue) return null

    return <div className={ioCSS + ' value'}>{value}</div>
  }

  const renderDropdown = () => {
    if (!setValue) return null
    const calculatedOptions = options.map((value) => ({
      text: getterOrKeyHelper(getText, value),
      key: getterOrKeyHelper(getKey, value),
      value: getterOrKeyHelper(getValue, value),
    }))

    return (
      <Dropdown
        value={innerValue}
        disabled={disabled}
        placeholder={placeholder}
        className={ioCSS + ' value'}
        options={calculatedOptions}
        scrolling
        search={search}
        onChange={(_, { value }) => {
          if (typeof value !== 'string' && typeof value !== 'number') return
          setInnerValue(value)
          const fullValue = options.find((_value) => value === getterOrKeyHelper(getValue, _value))
          setValue(value, fullValue, setInnerValue)
        }}
      />
    )
  }

  const renderLabel = () => {
    const keyClass = labelNegative ? 'io-component-negative key-negative' : 'io-component key'
    if (link) {
      return (
        <div className={keyClass} style={style}>
          <a target="_blank" href={link}>
            {title}
          </a>
        </div>
      )
    }
    return (
      <div className={keyClass} style={style}>
        {title}
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
          {renderDropdown()}
        </div>
      }
    />
  )
}

export default DropdownIO
