import React, { useState } from 'react'
import { Button, Header, Icon, Modal, ModalProps } from 'semantic-ui-react'
import { useLanguageProvider } from '../../contexts/Localisation'

interface ConfirmModalState extends ModalProps {
  type: 'warning' | 'confirmation'
  title: string
  message?: string
  confirmText: string
  cancelText: string
  onConfirm: () => void
  onCancel: () => void
}

const useConfirmationModal = ({
  type,
  title,
  message,
  confirmText,
  cancelText,
  onConfirm,
  onCancel,
  ...modalProps
}: Partial<ConfirmModalState> = {}) => {
  const { strings } = useLanguageProvider()
  const [open, setOpen] = useState(false)
  const [buttonLoading, setButtonLoading] = useState(false)
  const [modalState, setModalState] = useState<ConfirmModalState>({
    type: type ?? 'confirmation',
    title: title ?? strings.MODAL_CONFIRM_TITLE,
    message,
    confirmText: confirmText ?? strings.OPTION_OK,
    cancelText: cancelText ?? strings.OPTION_CANCEL,
    onConfirm: onConfirm ? onConfirm : () => console.log('Clicked OK'),
    onCancel: onCancel ? onCancel : () => {},
  })

  const handleConfirm = async (confirmFunction: () => void) => {
    setButtonLoading(true)
    await confirmFunction()
    setButtonLoading(false)
    setOpen(false)
  }

  const handleCancel = async (cancelFunction: () => void) => {
    cancelFunction()
    setOpen(false)
  }

  const ConfirmModal = () => (
    <Modal
      closeIcon
      open={open}
      {...modalProps}
      basic
      size="small"
      onClose={() => {
        modalState.onCancel()
        setOpen(false)
      }}
    >
      <Header icon>
        {modalState.type === 'confirmation' ? (
          <Icon name="check square outline" color="green" />
        ) : (
          <Icon name="exclamation triangle" color="orange" />
        )}
        {modalState.title}
      </Header>
      <Modal.Content>{modalState.message && <p>{modalState.message}</p>}</Modal.Content>
      <Modal.Actions>
        <Button
          content={modalState.cancelText}
          inverted
          onClick={() => handleCancel(modalState.onCancel)}
        />
        <Button
          loading={buttonLoading}
          color="green"
          inverted
          icon="checkmark"
          content={modalState.confirmText}
          onClick={() => handleConfirm(modalState.onConfirm)}
        />
      </Modal.Actions>
    </Modal>
  )

  const showModal = ({
    title,
    message,
    confirmText: OKText,
    cancelText,
    onConfirm: onOK,
    onCancel,
  }: Partial<ConfirmModalState> = {}) => {
    const newState: Partial<ConfirmModalState> = {}
    if (title) newState.title = title
    if (message) newState.message = message
    if (OKText) newState.confirmText = OKText
    if (cancelText) newState.cancelText = cancelText
    if (onOK) newState.onConfirm = onOK
    if (onCancel) newState.onCancel = onCancel
    setModalState({ ...modalState, ...newState })
    setOpen(true)
  }

  return { ConfirmModal, showModal }
}

export default useConfirmationModal
