import React from 'react'
import { Link } from 'react-router-dom'
import { ApplicationListShape } from '../../../utils/generated/graphql'
import { CellProps } from '../../../utils/types'

const ApplicationNameCell: React.FC<CellProps> = ({ application }) => (
  <div className="application-name-cell">
    <Link to={`/application/${application.serial || 0}`}>{application.name as string}</Link>
    <ApplicationNameCellDetails {...application} />
  </div>
)

const ApplicationNameReviewLinkCell: React.FC<CellProps> = ({ application }) => (
  <div>
    <Link to={`/application/${application.serial || 0}/review`}>{application.name as string}</Link>
    <ApplicationNameCellDetails {...application} />
  </div>
)

const ApplicationNameCellDetails: React.FC<ApplicationListShape> = ({ applicant, orgName }) => (
  <p className="application-name-cell-name">{`${applicant}${orgName ? ' • ' + orgName : ''}`}</p>
)

export { ApplicationNameCell, ApplicationNameReviewLinkCell }
