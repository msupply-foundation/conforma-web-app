import { useState } from 'react'
import { Confirm, Input } from 'semantic-ui-react'
import { ModalState } from './useTemplateOperations'

export const TemplateOperationsModal: React.FC<ModalState> = ({ type, ...props }) => {
  switch (type) {
    case 'commit':
      return <CommitConfirm {...props} />
    default:
      return null
  }
}

export const CommitConfirm: React.FC<Omit<ModalState, 'type'>> = ({ isOpen, onConfirm, close }) => {
  const [comment, setComment] = useState('')
  return (
    <Confirm
      open={isOpen}
      // Prevent click in Input from closing modal
      onClick={(e: any) => e.stopPropagation()}
      content={
        <div style={{ padding: 10, gap: 10 }} className="flex-column">
          <h2>Commit version?</h2>
          <p>
            This will create a permanent template version that can no longer be modified. To make
            any further changes, you will need to duplicate it and create a new version.
          </p>
          <div className="flex-row-start-center" style={{ gap: 10 }}>
            <label>Please provide a commit message:</label>
            <Input
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              style={{ width: '60%' }}
            />
          </div>
        </div>
      }
      onCancel={close}
      onConfirm={onConfirm}
    />
  )
}
