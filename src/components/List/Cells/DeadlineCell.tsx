import React from 'react'
import { CellProps } from '../../../utils/types'
import { DateTime } from 'luxon'

// Show date-time in a different colour (red) if deadline is less than this many
// days away:
const ALERT_FORMAT_DAYS = 2

const DeadlineCell: React.FC<CellProps> = ({ application }) => {
  if (!application.applicantDeadline) return null

  const deadline = DateTime.fromISO(application.applicantDeadline)
  const textColorClass =
    deadline.diff(DateTime.now(), 'days').days < ALERT_FORMAT_DAYS ? 'alert-colour' : ''
  return <p className={`slightly-smaller-text ${textColorClass}`}>{deadline.toLocaleString()}</p>
}
export default DeadlineCell
