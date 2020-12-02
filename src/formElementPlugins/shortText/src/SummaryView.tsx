import React from 'react'
import { Icon, Input } from 'semantic-ui-react'
import { SummaryViewProps } from '../../types'

const SummaryView: React.FC<SummaryViewProps> = ({ parameters, response }) => {
  const { label, maskedInput } = parameters
  return (
    <>
      <label>{label}</label>
      <Input
        readOnly
        disabled
        transparent
        value={response ? response?.text : ''}
        type={maskedInput ? 'password' : undefined}
        icon={!response?.isValid ? <Icon name="exclamation circle" color="red" /> : null}
      />
    </>
  )
}

export default SummaryView
