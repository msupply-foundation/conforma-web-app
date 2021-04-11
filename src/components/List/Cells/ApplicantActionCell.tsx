import React from 'react'
import { Link } from 'react-router-dom'
import { ApplicationStatus } from '../../../utils/generated/graphql'
import { CellProps } from '../../../utils/types'

const ApplicantActionCell: React.FC<CellProps> = ({ application: { status, serial } }) => {
  let action = ''

  if (status === ApplicationStatus.ChangesRequired) action = 'Update'
  if (status === ApplicationStatus.Draft) action = 'Continue'

  return (
    <>
      <Link style={actionStyle} to={`/application/${serial}`}>
        {action}
      </Link>
    </>
  )
}

// Styles - TODO: Move to LESS || Global class style (semantic)
const actionStyle = { color: '#003BFE', fontWeight: 400, letterSpacing: 1 }

export default ApplicantActionCell
