import React, { useEffect, useState } from 'react'
import { Button, Icon } from 'semantic-ui-react'
import { JsonEditor as ReactJson, JsonEditorProps, CopyFunction } from 'json-edit-react'
import { useToast, topLeft, Position } from '../../contexts/Toast'
import { useLanguageProvider } from '../../contexts/Localisation'
import Loading from '../Loading'
import useUndo from 'use-undo'
import { truncateString } from '../../utils/helpers/utilityFunctions'

interface JsonEditorExtendedProps extends Omit<JsonEditorProps, 'data'> {
  onSave: (data: object) => void
  isSaving?: boolean
  data: object
}

export const JsonEditor: React.FC<JsonEditorExtendedProps> = ({
  onSave,
  isSaving = false,
  data,
  ...jsonViewProps
}) => {
  const { t } = useLanguageProvider()
  const [isDirty, setIsDirty] = useState(false)
  const [{ present: currentData }, { set: setData, reset, undo, redo, canUndo, canRedo }] =
    useUndo(data)
  const showToast = useToast({ position: topLeft })

  useEffect(() => {
    reset(data)
    setIsDirty(false)
  }, [data])

  const handleSave = async () => {
    if (currentData !== undefined) {
      await onSave(currentData)
      reset(currentData)
      setIsDirty(false)
    }
  }

  const handleCopy: CopyFunction = ({ key, value, type, stringValue }) => {
    const text =
      typeof value === 'object' && value !== null
        ? t('CLIPBOARD_COPIED_ITEMS', { name: key, count: Object.keys(value).length })
        : truncateString(stringValue)
    showToast({
      title: t(type === 'value' ? 'CLIPBOARD_COPIED_VALUE' : 'CLIPBOARD_COPIED_PATH'),
      text,
      style: 'info',
      position: Position.bottomLeft,
    })
  }

  if (currentData === undefined) return <Loading />

  return (
    <div className="json-editor">
      <ReactJson
        data={currentData}
        onUpdate={({ newData }) => {
          setData(newData)
          setIsDirty(true)
        }}
        enableClipboard={handleCopy}
        theme={{ input: { fontFamily: 'monospace' }, container: '#f9f9f9' }}
        {...jsonViewProps}
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
        <Button
          primary
          disabled={!isDirty}
          loading={isSaving}
          content={t('BUTTON_SAVE')}
          onClick={handleSave}
        />
      </div>
    </div>
  )
}
