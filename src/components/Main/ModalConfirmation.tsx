import React from 'react'
import { Button, Header, Icon, Modal, ModalProps } from 'semantic-ui-react'

interface ModalConfirmationProps {
  modalProps: ModalProps
  onClick: Function
  onClose: Function
}
const ModalConfirmation: React.FC<ModalConfirmationProps> = ({ modalProps, onClick, onClose }) => {
  const { open, title, message, option } = modalProps
  return (
    <Modal open={open} basic size="small">
      <Header icon>
        <Icon name="check square outline" color="green" />
        {title}
      </Header>
      <Modal.Content>
        <p>{message}</p>
      </Modal.Content>
      <Modal.Actions>
        <Button
          color="green"
          inverted
          icon="checkmark"
          content={option}
          onClick={() => onClick()}
        />
      </Modal.Actions>
    </Modal>
  )
}

export default ModalConfirmation
