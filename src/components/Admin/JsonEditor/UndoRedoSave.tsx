import { Button, Icon } from 'semantic-ui-react'
import { useLanguageProvider } from '../../../contexts/Localisation'

interface UndoRedoProps {
  undo: () => void
  redo: () => void
  canUndo: boolean
  canRedo: boolean
  isDirty?: boolean
  isSaving?: boolean
  handleSave?: () => void
}

export const UndoRedoSave = ({
  undo,
  redo,
  canUndo,
  canRedo,
  isDirty,
  isSaving,
  handleSave,
}: UndoRedoProps) => {
  const { t } = useLanguageProvider()

  return (
    <div className="flex-row-space-between">
      <p className={`clickable nav-button ${!canUndo ? 'invisible' : ''}`}>
        <a onClick={undo}>
          <Icon name="arrow alternate circle left" />
          <strong>{t('BUTTON_UNDO')}</strong>
        </a>
      </p>
      <p className={`clickable nav-button ${!canRedo ? 'invisible' : ''}`}>
        <a onClick={redo}>
          <strong>{t('BUTTON_REDO')}</strong>
          <Icon name="arrow alternate circle right" />
        </a>
      </p>
      <Button
        primary
        disabled={!isDirty}
        loading={isSaving}
        content={t('BUTTON_SAVE')}
        onClick={handleSave}
      />
    </div>
  )
}
