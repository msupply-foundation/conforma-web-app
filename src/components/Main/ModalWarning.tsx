import React from 'react'
import { Button, Header, Icon, Modal, ModalProps } from 'semantic-ui-react'

interface ModalWarningProps {
  showModal: ModalProps
}

const ModalWarning: React.FC<ModalWarningProps> = ({ showModal }) => {
  const { title, message, option, onClick } = showModal

  // TOOD: Use more props from ModalProps for more general configuration of modal (e.g. Shorthand for different actions)
  return (
    <Modal basic size="small" {...showModal}>
      <Header icon>
        <Icon name="exclamation triangle" />
        {title}
      </Header>
      <Modal.Content>
        <p>{message}</p>
      </Modal.Content>
      <Modal.Actions>
        <Button color="green" inverted icon="checkmark" content={option} onClick={onClick} />
      </Modal.Actions>
    </Modal>
  )
}

export default ModalWarning
