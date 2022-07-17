import React, { useState } from 'react'
import { Button, Header, Icon, Modal, ModalProps } from 'semantic-ui-react'
import { useLanguageProvider } from '../../contexts/Localisation'

interface ConfirmModalState extends ModalProps {
  type: 'warning' | 'confirmation'
  title: string
  message?: string
  OKText: string
  cancelText: string
  onOK: () => void
  onCancel: () => void
}

const useConfirmModal = ({
  type,
  title,
  message,
  OKText,
  cancelText,
  onOK,
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
    OKText: OKText ?? strings.OPTION_OK,
    cancelText: cancelText ?? strings.OPTION_CANCEL,
    onOK: onOK ? onOK : () => console.log('Clicked OK'),
    onCancel: onCancel ? onCancel : () => {},
  })

  const handleOk = async (OKFunction: () => void) => {
    setButtonLoading(true)
    await OKFunction()
    setButtonLoading(false)
    setOpen(false)
  }

  const handleCancel = async (cancelFunction: () => void) => {
    cancelFunction()
    setOpen(false)
  }

  const ConfirmModal = () => (
    <Modal closeIcon open={open} {...modalProps} basic size="small" onClose={() => setOpen(false)}>
      <Header icon>
        {type === 'confirmation' ? (
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
          content={modalState.OKText}
          onClick={() => handleOk(modalState.onOK)}
        />
      </Modal.Actions>
    </Modal>
  )

  const showModal = ({
    title,
    message,
    OKText,
    cancelText,
    onOK,
    onCancel,
  }: Partial<ConfirmModalState> = {}) => {
    const newState: Partial<ConfirmModalState> = {}
    if (title) newState.title = title
    if (message) newState.message = message
    if (OKText) newState.OKText = OKText
    if (cancelText) newState.cancelText = cancelText
    if (onOK) newState.onOK = onOK
    if (onCancel) newState.onCancel = onCancel
    setModalState({ ...modalState, ...newState })
    setOpen(true)
  }

  return { ConfirmModal, showModal }
}

export default useConfirmModal
