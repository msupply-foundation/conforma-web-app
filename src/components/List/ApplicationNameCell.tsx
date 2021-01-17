import React from 'react'
import { ApplicationDetails } from '../../utils/types'

interface CellProps {
  application: ApplicationDetails
}

const ApplicationNameCell: React.FC<CellProps> = ({ application }) => {
  console.log('applicationName', application.name)

  return <p>{application.name}</p>
}

export default ApplicationNameCell
