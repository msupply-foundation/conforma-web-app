import React from 'react'
import { Link } from 'react-router-dom'
import { ApplicationListShape } from '../../../utils/generated/graphql'
import { CellProps } from '../../../utils/types'
import { useRouter } from '../../../utils/hooks/useRouter'

const ApplicationNameCell: React.FC<CellProps> = ({ application }) => {
  const { location } = useRouter()
  return (
    <div className="application-name-cell">
      <Link
        to={{
          pathname: `/application/${application.serial || 0}`,
          state: { prevQuery: location.search },
        }}
      >
        {application.name as string}
      </Link>
      <ApplicationNameCellDetails {...application} />
    </div>
  )
}

const ApplicationNameReviewLinkCell: React.FC<CellProps> = ({ application }) => {
  const { location } = useRouter()
  return (
    <div>
      <Link
        to={{
          pathname: `/application/${application.serial || 0}/review`,
          state: { prevQuery: location.search },
        }}
      >
        {application.name as string}
      </Link>
      <ApplicationNameCellDetails {...application} />
    </div>
  )
}

const ApplicationNameCellDetails: React.FC<ApplicationListShape> = ({ applicant, orgName }) => (
  <p className="application-name-cell-name">{`${applicant}${orgName ? ' • ' + orgName : ''}`}</p>
)

export { ApplicationNameCell, ApplicationNameReviewLinkCell }
