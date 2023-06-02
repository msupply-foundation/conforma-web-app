import React, { useState, useEffect } from 'react'
import { Header } from 'semantic-ui-react'
import { getRequest, postRequest } from '../../utils/helpers/fetchMethods'
import { useLanguageProvider } from '../../contexts/Localisation'
import usePageTitle from '../../utils/hooks/usePageTitle'
import { useToast, topLeft } from '../../contexts/Toast'
import useConfirmationModal from '../../utils/hooks/useConfirmationModal'
import getServerUrl from '../../utils/helpers/endpoints/endpointUrlBuilder'
import { JsonEditor } from './JsonEditor'
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
    awaitAction: false,
  })

  const [prefs, setPrefs] = useState<object>()
  const [isSaving, setIsSaving] = useState(false)

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
          theme={{ container: '#f9f9f9' }}
        />
      ) : (
        <Loading />
      )}
    </div>
  )
}
