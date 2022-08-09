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
  showCancel: boolean
}

const useConfirmationModal = ({
  type,
  title,
  message,
  confirmText,
  cancelText,
  onConfirm,
  onCancel,
  showCancel = true,
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
    showCancel,
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
        {modalState.showCancel && (
          <Button
            content={modalState.cancelText}
            inverted
            onClick={() => handleCancel(modalState.onCancel)}
          />
        )}
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
    confirmText,
    cancelText,
    onConfirm,
    onCancel,
    showCancel,
  }: Partial<ConfirmModalState> = {}) => {
    const newState: Partial<ConfirmModalState> = {}
    if (title) newState.title = title
    if (message) newState.message = message
    if (confirmText) newState.confirmText = confirmText
    if (cancelText) newState.cancelText = cancelText
    if (onConfirm) newState.onConfirm = onConfirm
    if (onCancel) newState.onCancel = onCancel
    if (showCancel !== undefined) newState.showCancel = showCancel
    setModalState({ ...modalState, ...newState })
    setOpen(true)
  }

  return { ConfirmModal, showModal }
}

export default useConfirmationModal