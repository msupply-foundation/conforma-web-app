import React, { useState, useEffect } from 'react'
import { Checkbox, Header, Message } from 'semantic-ui-react'
import { getRequest, postRequest } from '../../utils/helpers/fetchMethods'
import { useLanguageProvider } from '../../contexts/Localisation'
import usePageTitle from '../../utils/hooks/usePageTitle'
import { useToast, topLeft } from '../../contexts/Toast'
import useConfirmationModal from '../../utils/hooks/useConfirmationModal'
import getServerUrl from '../../utils/helpers/endpoints/endpointUrlBuilder'
import { JsonEditor } from './JsonEditor/JsonEditor'
import Loading from '../Loading'
import { useViewport } from '../../contexts/ViewportState'
import { usePrefs } from '../../contexts/SystemPrefs'
import { JsonData } from 'json-edit-react'

export const AdminPreferences: React.FC = () => {
  const { t, tFormat } = useLanguageProvider()
  usePageTitle(t('PAGE_TITLE_PREFS'))
  const { isMobile } = useViewport()
  const { showToast } = useToast({ position: topLeft })
  const { ConfirmModal: WarningModal, showModal: showWarningModal } = useConfirmationModal({
    type: 'warning',
    title: t('PREFERENCES_SAVE_WARNING'),
    message: t('PREFERENCES_SAVE_MESSAGE'),
    confirmText: t('BUTTON_CONFIRM'),
    awaitAction: false,
  })

  const [prefs, setPrefs] = useState<object>()
  const [isSaving, setIsSaving] = useState(false)
  const [maintenanceMode, setMaintenanceMode] = useState<boolean>(
    localStorage.getItem('maintenanceMode') === 'ON'
  )
  const { refetchPrefs } = usePrefs()

  useEffect(() => {
    getRequest(getServerUrl('getAllPrefs')).then((prefs) => {
      setPrefs(prefs)
    })
  }, [])

  const handleSave = async (data: JsonData) => {
    setIsSaving(true)
    try {
      const result = await postRequest({
        url: getServerUrl('setPrefs'),
        jsonBody: data as object,
        headers: { 'Content-Type': 'application/json' },
      })
      if (result.success) {
        showToast({ title: t('PREFERENCES_SAVED'), style: 'success' })
      } else {
        showToast({ title: t('PREFERENCES_SAVE_PROBLEM'), text: result.message, style: 'error' })
      }
    } catch (err) {
      showToast({
        title: t('PREFERENCES_SAVE_PROBLEM'),
        text: (err as Error).message,
        style: 'error',
      })
    }
    setIsSaving(false)
  }

  const handleSetMaintenanceMode = async () => {
    const value = !maintenanceMode

    setMaintenanceMode(value)
    const { success, enabled } = await postRequest({
      url: getServerUrl('setMaintenanceMode'),
      jsonBody: { enabled: value },
      headers: { 'Content-Type': 'application/json' },
    })
    if (success) {
      if (enabled) localStorage.setItem('maintenanceMode', 'ON')
      refetchPrefs()
      // No need for toast here as should get notification from websocket
      // listener
    } else {
      setMaintenanceMode(!value)
      showToast({ title: `Problem changing Maintenance mode`, style: 'error' })
    }
  }

  return (
    <div id="preferences-panel">
      <WarningModal />
      <Header>{t('PREFERENCES_HEADER')}</Header>
      <p>{tFormat('PREFERENCES_SEE_DOCS')}</p>
      {prefs ? (
        <JsonEditor
          data={prefs}
          onSave={(data) => showWarningModal({ onConfirm: () => handleSave(data) })}
          isSaving={isSaving}
          rootName="preferences"
          collapse={2}
          showArrayIndices={false}
          maxWidth={650}
          restrictDelete={({ level }) => level === 1}
          restrictAdd={({ level }) => level === 0}
          indent={isMobile ? 1 : 2}
        />
      ) : (
        <Loading />
      )}
      <div style={{ marginTop: 40, width: '100%' }}>
        <Header as="h2">Maintenance Mode</Header>
        <Message
          header={t('PREFERENCES_MAINTENANCE_WARNING')}
          content={t('PREFERENCES_MAINTENANCE_WARNING_TEXT')}
          warning
        />
        <Checkbox
          style={{ float: 'right' }}
          label="Enable"
          checked={maintenanceMode}
          toggle
          onChange={() => {
            if (!maintenanceMode)
              showWarningModal({
                type: 'warning',
                title: t('PREFERENCES_ENABLE_MAINTENANCE_MODE'),
                message: t('PREFERENCES_ENABLE_MAINTENANCE_TEXT'),
                confirmText: t('BUTTON_CONFIRM'),
                awaitAction: false,
                onConfirm: handleSetMaintenanceMode,
              })
            else handleSetMaintenanceMode()
          }}
        />
      </div>
    </div>
  )
}
