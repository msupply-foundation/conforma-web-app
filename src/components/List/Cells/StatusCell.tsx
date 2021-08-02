import React from 'react'
import { Link } from 'react-router-dom'
import { Icon, Progress } from 'semantic-ui-react'
import { ApplicationStatus } from '../../../utils/generated/graphql'
import { CellProps } from '../../../utils/types'
import strings from '../../../utils/constants'

const StatusCell: React.FC<CellProps> = ({ application }) => {
  const { serial, status } = application
  switch (status) {
    case ApplicationStatus.ChangesRequired:
      return (
        <Link to={`/application/${serial}`} className="user-action">
          <Icon name="exclamation circle" className="alert" />
          {strings.ACTION_MAKE_CHANGES}
        </Link>
      )
    case ApplicationStatus.Draft:
      return (
        <>
          <Progress size="tiny" />
          <Link to={`/application/${serial}`} className="user-action">
            {strings.ACTION_EDIT_DRAFT}
          </Link>
          {/* TO DO: Trash icon should link to application delete */}
          <Icon name="trash alternate outline" />
        </>
      )
    case ApplicationStatus.Completed:
      return (
        <Link to={`/application/${serial}`} className="user-action">
          {strings.ACTION_VIEW}
        </Link>
      )
    case ApplicationStatus.ChangesRequired:
      return (
        <Link to={`/application/${serial}`} className="user-action">
          {strings.ACTION_MAKE_CHANGES}
        </Link>
      ) // TODO: Show number of responses to make changes
    case undefined:
      console.log('Problem getting status of application serial ', serial)
      return null
    default:
      return <p>{statusStringMap[status as ApplicationStatus]}</p>
  }
}

const statusStringMap: { [key in ApplicationStatus]: string } = {
  SUBMITTED: strings.STATUS_SUBMITTED,
  DRAFT: '',
  CHANGES_REQUIRED: '',
  RE_SUBMITTED: '',
  COMPLETED: '',
}

export default StatusCell
