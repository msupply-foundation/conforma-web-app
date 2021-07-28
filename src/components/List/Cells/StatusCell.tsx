import React from 'react'
import { Link } from 'react-router-dom'
import { Icon, Progress, Segment } from 'semantic-ui-react'
import { ApplicationStatus } from '../../../utils/generated/graphql'
import { CellProps } from '../../../utils/types'

enum ACTIONS {
  EDIT_DRAFT = 'Edit draft',
  MAKE_CHANGES = 'Make changes',
  VIEW = 'View',
}

const StatusCell: React.FC<CellProps> = ({ application }) => {
  const { serial, status } = application
  switch (status) {
    case ApplicationStatus.ChangesRequired:
      return (
        <Link to={`/application/${serial}`} className="user-action">
          <Icon name="exclamation circle" className="alert" />
          {ACTIONS.MAKE_CHANGES}
        </Link>
      )
    case ApplicationStatus.Draft:
      return (
        <>
          <Progress size="tiny" />
          <Link to={`/application/${serial}`} className="user-action">
            {ACTIONS.EDIT_DRAFT}
          </Link>
          {/* TO DO: Trash icon should link to application delete */}
          <Icon name="trash alternate outline" />
        </>
      )
    case ApplicationStatus.Completed:
      return (
        <Link to={`/application/${serial}`} className="user-action">
          {ACTIONS.VIEW}
        </Link>
      )
    case ApplicationStatus.ChangesRequired:
      return (
        <Link to={`/application/${serial}`} className="user-action">
          {ACTIONS.MAKE_CHANGES}
        </Link>
      ) // TODO: Show number of responses to make changes
    case undefined:
      console.log('Problem to get status of application serial ', serial)
      return null
    default:
      return <p>{status}</p>
  }
}

export default StatusCell
