import React from 'react'
import { Link } from 'react-router-dom'
import { Icon, Progress } from 'semantic-ui-react'
import { ApplicationStatus } from '../../../utils/generated/graphql'
import { CellProps } from '../../../utils/types'
import { useLanguageProvider } from '../../../contexts/Localisation'
import useLocalisedEnums from '../../../utils/hooks/useLocalisedEnums'
import useConfirmationModal from '../../../utils/hooks/useConfirmationModal'
import { useRouter } from '../../../utils/hooks/useRouter'

const StatusCell: React.FC<CellProps> = ({ application, loading, deleteApplication }) => {
  const { t } = useLanguageProvider()
  const { Status } = useLocalisedEnums()
  const { location } = useRouter()
  const { ConfirmModal, showModal } = useConfirmationModal({
    title: t('APPLICATION_DELETION_CONFIRM_TITLE'),
    message: t('APPLICATION_DELETION_CONFIRM_MESSAGE'),
    confirmText: t('OPTION_OK'),
    onConfirm: () => deleteApplication(),
  })

  const { serial, status } = application
  const linkTo = { pathname: `/application/${serial}`, state: { prevQuery: location.search } }

  switch (status) {
    case ApplicationStatus.ChangesRequired:
      return (
        <Link to={linkTo} className="user-action">
          <Icon name="exclamation circle" className="alert" />
          {t('ACTION_MAKE_CHANGES')}
        </Link>
      )
    case ApplicationStatus.Draft:
      return (
        <>
          <Progress size="tiny" />
          <Link to={linkTo} className="user-action">
            {t('ACTION_EDIT_DRAFT')}
          </Link>
          <Icon
            className="delete-icon"
            name="trash alternate outline"
            loading={loading}
            onClick={() => showModal()}
          />
          <ConfirmModal />
        </>
      )
    case ApplicationStatus.Completed:
      return (
        <Link to={linkTo} className="user-action">
          {t('ACTION_VIEW')}
        </Link>
      )
    case ApplicationStatus.ChangesRequired:
      return (
        <Link to={linkTo} className="user-action">
          {t('ACTION_MAKE_CHANGES')}
        </Link>
      ) // TODO: Show number of responses to make changes
    case undefined:
      console.log('Problem getting status of application serial ', serial)
      return null
    default:
      return <p>{Status[status as ApplicationStatus]}</p>
  }
}

export default StatusCell
