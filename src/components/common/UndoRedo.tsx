import { CSSProperties } from 'react'
import { Icon } from 'semantic-ui-react'

export interface UndoRedoProps {
  canUndo: boolean
  canRedo: boolean
  undo: () => void
  redo: () => void
}

const buttonResetStyle: CSSProperties = {
  background: 'none',
  border: 'none',
  padding: 0,
  font: 'inherit',
  color: 'inherit',
  cursor: 'pointer',
}

export const UndoRedo = ({ canUndo, canRedo, undo, redo }: UndoRedoProps) => {
  if (!canUndo && !canRedo) return null

  return (
    <div className="flex-row-space-between" style={{ width: '100%' }}>
      <p className={`clickable nav-button ${!canUndo ? 'invisible' : ''}`}>
        <button type="button" onClick={undo} style={buttonResetStyle}>
          <Icon name="arrow alternate circle left" />
          <strong>Undo</strong>
        </button>
      </p>
      <p className={`clickable nav-button ${!canRedo ? 'invisible' : ''}`}>
        <button type="button" onClick={redo} style={buttonResetStyle}>
          <strong>Redo</strong>
          <Icon name="arrow alternate circle right" />
        </button>
      </p>
    </div>
  )
}
