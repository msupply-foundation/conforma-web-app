import React, { useState } from 'react'
import { Button, Header, Icon, Modal, ModalProps } from 'semantic-ui-react'
import strings from '../../utils/constants'

const modalInitialValue: ModalProps = {
  open: false,
  message: '',
  title: '',
}

interface ModalWarningProps {
  showModal: ModalProps
  setShowModal: (props: ModalProps) => void
  onClickAction?: Function
}

const ModalWarning: React.FC<ModalWarningProps> = ({ showModal, setShowModal, onClickAction }) => {
  const hideModal = () => setShowModal(modalInitialValue)
  return (
    <Modal basic onClose={() => hideModal()} open={showModal.open} size="small">
      <Header icon>
        <Icon name="exclamation triangle" />
        {showModal.title}
      </Header>
      <Modal.Content>
        <p>{showModal.message}</p>
      </Modal.Content>
      <Modal.Actions>
        <Button
          color="green"
          inverted
          onClick={() => {
            hideModal()
            if (onClickAction) onClickAction()
          }}
        >
          <Icon name="checkmark" />
          {strings.BUTTON_OPTION_YES}
        </Button>
      </Modal.Actions>
    </Modal>
  )
}

export default ModalWarning
