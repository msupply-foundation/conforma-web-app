import React from 'react'
import { Header, Icon } from 'semantic-ui-react'
import { SummaryViewProps } from '../../types'

const SummaryView: React.FC<SummaryViewProps> = ({ parameters, value }) => {
  return (
    <>
      <Header as="h3" content={parameters.label} />
      <p>
        {!value?.isValid ? <Icon name="exclamation circle" color="red" /> : null}
        {value?.text}
      </p>
    </>
  )
}

export default SummaryView
