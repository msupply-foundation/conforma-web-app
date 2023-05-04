import React, { useState, useEffect } from 'react'
import { Header, Button, Icon } from 'semantic-ui-react'
import ReactJson, { InteractionProps, OnCopyProps } from 'react-json-view'
import { getRequest, postRequest } from '../../utils/helpers/fetchMethods'
import { useLanguageProvider } from '../../contexts/Localisation'
import usePageTitle from '../../utils/hooks/usePageTitle'
import { useToast, topLeft, Position } from '../../contexts/Toast'
import useConfirmationModal from '../../utils/hooks/useConfirmationModal'
import getServerUrl from '../../utils/helpers/endpoints/endpointUrlBuilder'
import Loading from '../Loading'

export const AdminPreferences: React.FC = () => {
  const { t, tFormat } = useLanguageProvider()
  usePageTitle(t('PAGE_TITLE_PREFS'))

  const showToast = useToast({ position: topLeft })
  const { ConfirmModal: WarningModal, showModal: showWarningModal } = useConfirmationModal({
    type: 'warning',
    title: t('PREFERENCES_SAVE_WARNING'),
    message: t('PREFERENCES_SAVE_MESSAGE'),
    confirmText: t('BUTTON_CONFIRM'),
  })

  const [prefs, setPrefs] = useState<object>()
  const [hasChanged, setHasChanged] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [undoQueue, setUndoQueue] = useState<object[]>([])
  const [redoQueue, setRedoQueue] = useState<object[]>([])

  useEffect(() => {
    getRequest(getServerUrl('getAllPrefs')).then((prefs) => setPrefs(prefs))
  }, [])

  const handleChange = ({
    existing_src,
    updated_src,
    existing_value,
    new_value,
  }: InteractionProps) => {
    if (existing_value === new_value) return
    setHasChanged(true)
    setUndoQueue([...undoQueue, existing_src])
    setRedoQueue([])
    setPrefs(updated_src)
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const result = await postRequest({
        url: getServerUrl('setPrefs'),
        jsonBody: prefs,
        headers: { 'Content-Type': 'application/json' },
      })
      setIsSaving(false)
      if (result.success) {
        setHasChanged(false)
        showToast({ title: t('PREFERENCES_SAVED'), style: 'success' })
      } else {
        showToast({ title: t('PREFERENCES_SAVE_PROBLEM'), text: result.message, style: 'error' })
      }
    } catch (err) {
      setIsSaving(false)
      showToast({ title: t('PREFERENCES_SAVE_PROBLEM'), text: err.message, style: 'error' })
    }
  }

  const handleUndo = () => {
    const queue = [...undoQueue]
    const prev = queue.pop()
    if (prev && prefs) {
      setHasChanged(true)
      setRedoQueue([...redoQueue, prefs])
      setPrefs(prev)
      setUndoQueue(queue)
    }
  }

  const handleRedo = () => {
    const queue = [...redoQueue]
    const next = queue.pop()
    if (next && prefs) {
      setUndoQueue([...undoQueue, prefs])
      setPrefs(next)
      setRedoQueue(queue)
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

  return (
    <div id="preferences-panel">
      <WarningModal />
      <Header>{t('PREFERENCES_HEADER')}</Header>
      <p>{tFormat('PREFERENCES_SEE_DOCS')}</p>
      {prefs ? (
        <ReactJson
          src={prefs}
          name="preferences"
          collapsed={2}
          // @ts-ignore -- prop not recognised, but still works 🤷‍♂️
          displayArrayKey={false}
          enableClipboard={handleCopy}
          quotesOnKeys={false}
          displayDataTypes={false}
          onEdit={handleChange}
          onDelete={handleChange}
          onAdd={handleChange}
          style={{ padding: '10px' }}
        />
      ) : (
        <Loading />
      )}
      <div className="flex-row-space-between" style={{ maxWidth: 500 }}>
        <p className={`clickable nav-button ${undoQueue.length === 0 ? 'invisible' : ''}`}>
          <a onClick={handleUndo}>
            <Icon name="arrow alternate circle left" />
            <strong>{t('BUTTON_UNDO')}</strong>
          </a>
        </p>
        <p className={`clickable nav-button ${redoQueue.length === 0 ? 'invisible' : ''}`}>
          <a onClick={handleRedo}>
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
          onClick={() => showWarningModal({ onConfirm: () => handleSave() })}
        />
      </div>
    </div>
  )
}
