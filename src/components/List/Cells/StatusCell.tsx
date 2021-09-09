import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button, Icon, ModalProps, Progress } from 'semantic-ui-react'
import { ApplicationStatus, useDeleteApplicationMutation } from '../../../utils/generated/graphql'
import { CellProps } from '../../../utils/types'
import enumsToLocalStrings from '../../../utils/data/enumsToLocalisedStrings'
import strings from '../../../utils/constants'
import messages from '../../../utils/messages'
import ModalConfirmation from '../../Main/ModalConfirmation'

const StatusCell: React.FC<CellProps> = ({ application, loading, deleteApplication }) => {
  const [showModalDeletion, setShowModalDeletion] = useState<ModalProps>({ open: false })

  const showConfirmation = () => {
    const { title, message, option } = messages.APPLICATION_DELETION_CONFIRM
    setShowModalDeletion({
      open: true,
      title,
      message,
      option,
      onClick: () => {
        deleteApplication()
        setShowModalDeletion({ open: false })
      },
      onClose: () => setShowModalDeletion({ open: false }),
    })
  }

  const deleteDraft = () => {
    showConfirmation()
  }

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
          <Icon
            className="delete-icon"
            name="trash alternate outline"
            loading={loading}
            onClick={deleteDraft}
          />
          <ModalConfirmation {...showModalDeletion} />
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
      return <p>{enumsToLocalStrings[status as ApplicationStatus]}</p>
  }
}

export default StatusCell
