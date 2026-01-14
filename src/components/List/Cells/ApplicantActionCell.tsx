import { Link } from 'react-router-dom'
import { ApplicationStatus } from '../../../utils/generated/graphql'
import { CellProps } from '../../../utils/types'
import { useLanguageProvider } from '../../../contexts/Localisation'
import { Icon } from 'semantic-ui-react'
import { useRouter } from '../../../utils/hooks/useRouter'

const ApplicantActionCell = ({ application: { status, serial }, isInternalUser }: CellProps) => {
  const { t } = useLanguageProvider()
  const { location } = useRouter()
  let action = ''

  if (status === ApplicationStatus.ChangesRequired) action = t('ACTION_UPDATE')
  if (status === ApplicationStatus.Draft) action = t('ACTION_CONTINUE')

  if (!action) {
    const pathname = isInternalUser ? `/application/${serial}/review` : `/application/${serial}`
    return (
      <Link className="user-action" to={{ pathname, state: { prevQuery: location.search } }}>
        <Icon name="chevron right" />
      </Link>
    )
  }

  return (
    <Link className="user-action" to={`/application/${serial}`}>
      {action}
    </Link>
  )
}

export default ApplicantActionCell
