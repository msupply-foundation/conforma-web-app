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

export const AdminDataViews: React.FC = () => {
  const { t, tFormat } = useLanguageProvider()
  usePageTitle(t('PAGE_TITLE_DATA_VIEW'))

  const showToast = useToast({ position: topLeft })
  const { ConfirmModal: WarningModal, showModal: showWarningModal } = useConfirmationModal({
    type: 'warning',
    title: t('PREFERENCES_SAVE_WARNING'),
    message: t('PREFERENCES_SAVE_MESSAGE'),
    confirmText: t('BUTTON_CONFIRM'),
  })

  const [selectedTable, setSelectedTable] = useState<string>()
  const [dataView, setDataView] = useState<object>()
  const [dataViewColumnDefinition, setDataViewColumnDefinition] = useState<object>()
  const [prefs, setPrefs] = useState<object>()
  const [hasChanged, setHasChanged] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [undoQueue, setUndoQueue] = useState<object[]>([])
  const [redoQueue, setRedoQueue] = useState<object[]>([])

  return (
    <div id="data-view-config-panel">
      <WarningModal />
      <Header>{t('DATA_VIEW_CONFIG_HEADER')}</Header>
    </div>
  )
}
