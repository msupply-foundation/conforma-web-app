import React, { createContext, useContext } from 'react'
import { useState } from 'react'
import { Modal } from 'semantic-ui-react'
import ButtonWithFallback from './ButtonWidthFallback'

type InnerState = { resolve?: (isConfirmed: boolean) => void; message: string }
type ConfirmationContextState = { askForConfirmation: (message: string) => Promise<boolean> }

const defaultContext: ConfirmationContextState = {
  askForConfirmation: () => {
    throw new Error('context not present')
  },
}

const Context = createContext<ConfirmationContextState>(defaultContext)

const ConfirmationContext: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [innerState, setInnerState] = useState<InnerState>({ message: '' })

  const [state] = useState<ConfirmationContextState>({
    askForConfirmation: (message) => new Promise((resolve) => setInnerState({ resolve, message })),
  })

  const onClose = (isConfirmed: boolean) => {
    const resolve = innerState.resolve

    setInnerState({ message: '' })
    if (resolve) resolve(isConfirmed)
  }

  const renderExtra = () => (
    <Modal
      open={!!innerState.message}
      onClick={() => onClose(false)}
      onClose={() => onClose(false)}
    >
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div>{innerState.message}</div>
        <div className="flex-row-center-center">
          <ButtonWithFallback title={'Yes'} onClick={() => onClose(true)} />{' '}
          <ButtonWithFallback title={'No'} onClick={() => onClose(false)} />
        </div>
      </div>
    </Modal>
  )

  return (
    <Context.Provider value={state}>
      {children}
      {renderExtra()}
    </Context.Provider>
  )
}

export default ConfirmationContext
export const useConfirmationState = () => useContext(Context)
