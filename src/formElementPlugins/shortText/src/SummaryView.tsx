import React from 'react'
import { Input } from 'semantic-ui-react'
import { SummaryViewProps } from '../../types'

const SummaryView: React.FC<SummaryViewProps> = ({ parameters, value }) => {
  const { label, maskedInput } = parameters
  return (
    <>
      <label>{label}</label>
      <Input
        readOnly
        disabled
        transparent
        value={value ? value?.text : ''}
        type={maskedInput ? 'password' : undefined}
      />
    </>
  )
}

export default SummaryView
