import React from 'react'
import { Link } from 'react-router-dom'
import { CellProps } from '../../../utils/types'

const ApplicationNameCell: React.FC<CellProps> = ({ application, query }) => {
  const { userRole } = query
  const linkUrl =
    userRole === 'consolidator' || userRole == 'reviewer'
      ? `/application/${application.serial || 0}/review`
      : `/application/${application.serial || 0}`

  return <Link to={linkUrl}>{application.name as string}</Link>
}

export default ApplicationNameCell
