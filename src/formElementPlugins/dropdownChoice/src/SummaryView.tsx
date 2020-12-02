import React from 'react'
import { Input, Icon } from 'semantic-ui-react'
import { SummaryViewProps } from '../../types'

const SummaryView: React.FC<SummaryViewProps> = ({ parameters, response }) => {
  const { label } = parameters
  return (
    <>
      {!response?.isValid ? <Icon name="exclamation circle" color="red" /> : null}
      <label>{label}</label>
      <Input readOnly disabled transparent value={response ? response?.text : ''} />
    </>
  )
}

export default SummaryView
