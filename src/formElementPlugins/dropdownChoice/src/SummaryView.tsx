import React from 'react'
import { Grid, Header, Icon } from 'semantic-ui-react'
import { SummaryViewProps } from '../../types'

const SummaryView: React.FC<SummaryViewProps> = ({ parameters, response }) => {
  return (
    <>
      <Header as="h3" content={parameters.label} />
      <p>{response?.text}</p>
    </>
  )
}

export default SummaryView
