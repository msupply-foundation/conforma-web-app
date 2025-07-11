import { Icon } from 'semantic-ui-react'

export interface UndoRedoProps {
  canUndo: boolean
  canRedo: boolean
  undo: () => void
  redo: () => void
}

export const UndoRedo = ({ canUndo, canRedo, undo, redo }: UndoRedoProps) => {
  if (!canUndo && !canRedo) return null

  return (
    <div className="flex-row-space-between">
      <p className={`clickable nav-button ${!canUndo ? 'invisible' : ''}`}>
        <a onClick={undo}>
          <Icon name="arrow alternate circle left" />
          <strong>Undo</strong>
        </a>
      </p>
      <p className={`clickable nav-button ${!canRedo ? 'invisible' : ''}`}>
        <a onClick={redo}>
          <strong>Redo</strong>
          <Icon name="arrow alternate circle right" />
        </a>
      </p>
    </div>
  )
}
