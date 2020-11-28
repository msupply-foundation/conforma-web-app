import React from 'react'
import { Header, Icon } from 'semantic-ui-react'
import { SummaryViewProps } from '../../types'

const SummaryView: React.FC<SummaryViewProps> = ({ parameters, response }) => {
  return (
    <>
      <Header as="h3" content={parameters.label} />
      <p>
        {!response?.isValid ? <Icon name="exclamation circle" color="red" /> : null}
        {response?.value.text}
      </p>
    </>
  )
}

export default SummaryView
