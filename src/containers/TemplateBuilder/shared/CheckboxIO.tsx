import React, { useEffect, useState } from 'react'
import { Checkbox, Popup } from 'semantic-ui-react'

type CheckboxIOprops = {
  value: boolean
  title: string
  setValue: (value: boolean) => boolean | undefined | void
  disabled?: boolean
  disabledMessage?: string
  isPropUpdated?: boolean
  minLabelWidth?: number
  labelTextAlign?: string
}

const CheckboxIO: React.FC<CheckboxIOprops> = ({
  value,
  setValue,
  disabled = false,
  title,
  disabledMessage,
  isPropUpdated = false,
  minLabelWidth = 100,
  labelTextAlign = 'center',
}) => {
  const [innerValue, setInnerValue] = useState(value)
  const style: any = { minWidth: minLabelWidth, textAlign: labelTextAlign }

  useEffect(() => {
    if (isPropUpdated) setInnerValue(() => value)
  }, [value])

  return (
    <Popup
      content={disabledMessage}
      disabled={!disabled || !disabledMessage}
      trigger={
        <div className="io-wrapper">
          {title && (
            <div className="io-component key" style={style}>
              {title}
            </div>
          )}
          <div className="io-component value">
            <Checkbox
              checked={innerValue}
              toggle
              disabled={disabled}
              size="small"
              onChange={() => {
                const newValue = !innerValue
                const result = setValue(newValue)
                if (typeof result === 'boolean') setInnerValue(result)
                else setInnerValue(newValue)
              }}
            />
          </div>
        </div>
      }
    />
  )
}

export default CheckboxIO
