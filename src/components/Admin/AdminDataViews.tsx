import React, { useState, useEffect } from 'react'
import { useRouter } from '../../utils/hooks/useRouter'
import { Header, Button, Icon, Dropdown, Checkbox } from 'semantic-ui-react'
import { useLanguageProvider } from '../../contexts/Localisation'
import usePageTitle from '../../utils/hooks/usePageTitle'
import { useToast, topLeft, Position } from '../../contexts/Toast'
import useConfirmationModal from '../../utils/hooks/useConfirmationModal'
import getServerUrl from '../../utils/helpers/endpoints/endpointUrlBuilder'
import Loading from '../Loading'
import {
  DataTable,
  DataTablesConnection,
  DataView,
  GetDataTablesQuery,
  GetDataViewsQuery,
  useGetDataTablesQuery,
  useGetDataViewsQuery,
  useUpdateDataViewMutation,
} from '../../utils/generated/graphql'
import { toCamelCase } from '../../LookupTable/utils'
import { JsonEditor } from './JsonEditor'
import { pickBy } from 'lodash'

export const AdminDataViews: React.FC = () => {
  const { t, tFormat } = useLanguageProvider()
  usePageTitle(t('PAGE_TITLE_DATA_VIEW'))

  const { query, updateQuery } = useRouter()

  const showToast = useToast({ position: topLeft })
  const { ConfirmModal: WarningModal, showModal: showWarningModal } = useConfirmationModal({
    type: 'warning',
    title: t('PREFERENCES_SAVE_WARNING'),
    message: t('PREFERENCES_SAVE_MESSAGE'),
    confirmText: t('BUTTON_CONFIRM'),
  })

  const { data, loading, error } = useGetDataTablesQuery()

  const [includeLookupTables, setIncludeLookupTables] = useState(false)
  const [dataView, setDataView] = useState<object>()
  const [dataViewColumnDefinition, setDataViewColumnDefinition] = useState<object>()
  const [prefs, setPrefs] = useState<object>()
  const [hasChanged, setHasChanged] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const selectedTable = query.selectedTable

  return (
    <div id="data-view-config-panel">
      <WarningModal />
      <Header>{t('DATA_VIEW_CONFIG_HEADER')}</Header>
      <div>
        <Dropdown
          selection
          placeholder="Select data table"
          loading={loading}
          value={selectedTable}
          options={getDataTableOptions(data, includeLookupTables)}
          onChange={(_, { value }) => updateQuery({ selectedTable: value })}
        />
        <Checkbox
          checked={includeLookupTables}
          onChange={() => setIncludeLookupTables(!includeLookupTables)}
          label={'Include lookup tables?'}
        />
      </div>
      {selectedTable && <DataViewEditor tableName={selectedTable} />}
      {/* <ColumnDefinitionEditor /> */}
    </div>
  )
}

interface DataViewEditorProps {
  tableName: string
}

const DataViewEditor: React.FC<DataViewEditorProps> = ({ tableName }) => {
  const { t, tFormat } = useLanguageProvider()
  const { query, updateQuery } = useRouter()
  const { ConfirmModal, showModal: showConfirmation } = useConfirmationModal({
    type: 'warning',
    title: t('PREFERENCES_SAVE_WARNING'),
    message: t('PREFERENCES_SAVE_MESSAGE'),
    confirmText: t('BUTTON_CONFIRM'),
    awaitAction: false,
  })
  const showToast = useToast({ position: topLeft })

  const { data, loading, error } = useGetDataViewsQuery({
    variables: { tableName },
  })
  const [updateDataView, { loading: isSaving }] = useUpdateDataViewMutation({
    onError: (e) =>
      showToast({ title: t('PREFERENCES_SAVE_PROBLEM'), text: e.message, style: 'error' }),
    onCompleted: () => showToast({ title: 'Data view saved', style: 'success' }),
  })

  const selectedDataView = query.dataView

  const dataViews = data?.dataViews?.nodes as DataView[] | undefined

  const dataViewObject = dataViews && dataViews.find((dv) => dv.identifier === selectedDataView)

  const handleSave = async (data: object) => {
    const result = dataViewObject
      ? await updateDataView({ variables: { id: dataViewObject?.id, patch: data } })
      : 'No data'
    console.log('Result', result)
  }

  return (
    <div>
      <ConfirmModal />
      <Dropdown
        selection
        placeholder="Select data view"
        loading={loading}
        value={selectedDataView}
        options={getDataViewOptions(dataViews)}
        onChange={(_, { value }) => {
          if (dataViews) updateQuery({ dataView: value })
        }}
      />
      <JsonEditor
        data={pickBy(dataViewObject, (_, key) => !['__typename', 'id'].includes(key))}
        onSave={(data) => showConfirmation({ onConfirm: () => handleSave(data) })}
        isSaving={isSaving}
        name={dataViewObject?.identifier}
        collapsed={1}
        displayArrayKey={false}
        quotesOnKeys={false}
        displayDataTypes={true}
        style={{ padding: '10px' }}
      />
    </div>
  )
}

const getDataTableOptions = (
  data: GetDataTablesQuery | undefined,
  includeLookupTables: boolean
) => {
  if (!data) return []

  return (data.dataTables?.nodes as DataTable[])
    .filter(({ isLookupTable }) => (includeLookupTables ? true : !isLookupTable))
    .map(({ id, tableName, isLookupTable }) => {
      const table = toCamelCase(tableName)
      return {
        key: `${table}_${id}`,
        text: `${table}${isLookupTable ? ' (Lookup table)' : ''}`,
        value: table,
      }
    })
}

const getDataViewOptions = (dataViews: DataView[] | undefined) => {
  if (!dataViews) return []

  return dataViews.map((dataView, index) => {
    const { id, identifier, title, code } = dataView
    return {
      key: `${code}_${id}`,
      text: `${title} (${identifier})`,
      value: identifier,
      data: dataView,
    }
  })
}
