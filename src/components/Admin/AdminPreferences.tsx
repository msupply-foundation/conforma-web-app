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

  useEffect(() => {
    getRequest(getServerUrl('getAllPrefs')).then((prefs) => {
      setPrefs(prefs)
    })
  }, [])

  const handleSave = async (data: object) => {
    setIsSaving(true)
    try {
      const result = await postRequest({
        url: getServerUrl('setPrefs'),
        jsonBody: data,
        headers: { 'Content-Type': 'application/json' },
      })
      if (result.success) {
        showToast({ title: t('PREFERENCES_SAVED'), style: 'success' })
      } else {
        showToast({ title: t('PREFERENCES_SAVE_PROBLEM'), text: result.message, style: 'error' })
      }
    } catch (err) {
      showToast({ title: t('PREFERENCES_SAVE_PROBLEM'), text: err.message, style: 'error' })
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
      // No need for turning on toast as should get notification from websocket
      // listener
      else {
        localStorage.removeItem('maintenanceMode')
        showToast({ title: `Maintenance mode: OFF`, style: 'success' })
      }
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
          header="Careful!"
          content="Enabling maintenance mode will disconnect all active users and re-direct them to a temporary page"
          warning
        />
        <Checkbox
          style={{ float: 'right' }}
          label="Enable"
          checked={maintenanceMode}
          toggle
          onChange={handleSetMaintenanceMode}
        />
      </div>
    </div>
  )
}
