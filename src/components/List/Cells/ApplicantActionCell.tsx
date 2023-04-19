import React from 'react'
import { Link } from 'react-router-dom'
import { ApplicationStatus } from '../../../utils/generated/graphql'
import { CellProps } from '../../../utils/types'
import { useLanguageProvider } from '../../../contexts/Localisation'
import { Icon } from 'semantic-ui-react'

const ApplicantActionCell: React.FC<CellProps> = ({ application: { status, serial } }) => {
  const { t } = useLanguageProvider()
  let action = ''

  if (status === ApplicationStatus.ChangesRequired) action = t('ACTION_UPDATE')
  if (status === ApplicationStatus.Draft) action = t('ACTION_CONTINUE')

  if (!action)
    return (
      <Link className="user-action" to={`/application/${serial}`}>
        <Icon name="chevron right" />
      </Link>
    )

  return (
    <Link className="user-action" to={`/application/${serial}`}>
      {action}
    </Link>
  )
}

export default ApplicantActionCell
