import React, { useState, useEffect } from 'react'
import { Header } from 'semantic-ui-react'
import { SummaryViewProps } from '../../types'

const SummaryView: React.FC<SummaryViewProps> = ({ parameters, value }) => {
  return (
    <>
      <Header as="h3" content={parameters.label} />
      <p>{value?.text}</p>
    </>
  )
}

export default SummaryView
