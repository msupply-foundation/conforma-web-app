import React from 'react'
import { CellProps } from '../../../utils/types'
import { DateTime } from 'luxon'
import { useLanguageProvider } from '../../../contexts/Localisation'

// Show date-time in a different colour (red) if deadline is less than this many
// days away:
const ALERT_FORMAT_DAYS = 2

const DeadlineCell: React.FC<CellProps> = ({ application }) => {
  const {
    selectedLanguage: { locale },
  } = useLanguageProvider()
  if (!application.applicantDeadline) return null

  const deadline = DateTime.fromISO(application.applicantDeadline)
  const textColorClass =
    deadline.diff(DateTime.now(), 'days').days < ALERT_FORMAT_DAYS ? 'alert-colour' : ''
  return (
    <p className={`slightly-smaller-text ${textColorClass}`}>
      {deadline.setLocale(locale).toLocaleString()}
    </p>
  )
}
export default DeadlineCell
