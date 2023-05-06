import React, { useEffect } from 'react'
import { Button, Icon } from 'semantic-ui-react'
import ReactJson, { InteractionProps, OnCopyProps, ReactJsonViewProps } from 'react-json-view'
import { useToast, topLeft, Position } from '../../contexts/Toast'
import { useLanguageProvider } from '../../contexts/Localisation'
import Loading from '../Loading'
import { useUndoQueue } from '../../utils/hooks/useUndoQueue'

interface JsonEditorProps extends Omit<ReactJsonViewProps, 'src'> {
  onSave: (data: object) => void
  isSaving?: boolean
  data: object | undefined
  displayArrayKey?: boolean
}

export const JsonEditor: React.FC<JsonEditorProps> = ({
  onSave,
  isSaving = false,
  data,
  displayArrayKey,
  ...jsonViewProps
}) => {
  const { t } = useLanguageProvider()
  const { currentValue, setValue, undo, redo, hasChanged, setSaved, canUndo, canRedo } =
    useUndoQueue<object>()
  const showToast = useToast({ position: topLeft })

  useEffect(() => {
    if (data !== undefined) setValue(data)
  }, [data])

  const handleChange = ({ updated_src, existing_value, new_value }: InteractionProps) => {
    if (existing_value === new_value) return
    setValue(updated_src)
  }

  const handleSave = async () => {
    if (currentValue !== undefined) {
      await onSave(currentValue)
      setSaved()
    }
  }

  const handleCopy = ({ name, src }: OnCopyProps) =>
    showToast({
      title: t('PREFERENCES_COPIED'),
      text: t('PREFERENCES_COPIED_ITEMS', {
        name,
        count: typeof src === 'object' && src !== null ? Object.keys(src).length : 0,
        value: src,
      }),
      style: 'info',
      position: Position.bottomLeft,
    })

  if (currentValue === undefined) return <Loading />

  return (
    <div className="json-editor">
      <ReactJson
        {...jsonViewProps}
        src={currentValue}
        // @ts-ignore -- prop not recognised, but still works 🤷‍♂️
        displayArrayKey={displayArrayKey}
        onEdit={handleChange}
        onDelete={handleChange}
        onAdd={handleChange}
        enableClipboard={handleCopy}
      />
      <div className="flex-row-space-between" style={{ maxWidth: 500 }}>
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
      </div>
      <div className="flex-row-end" style={{ maxWidth: 500 }}>
        <Button
          primary
          disabled={!hasChanged}
          loading={isSaving}
          content={t('BUTTON_SAVE')}
          onClick={handleSave}
        />
      </div>
    </div>
  )
}
