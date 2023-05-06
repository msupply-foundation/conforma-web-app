import React, { useState } from 'react'
import { useRouter } from '../../utils/hooks/useRouter'
import { Header, Button, Dropdown, Checkbox } from 'semantic-ui-react'
import { TranslateMethod, useLanguageProvider } from '../../contexts/Localisation'
import usePageTitle from '../../utils/hooks/usePageTitle'
import { useToast, Position } from '../../contexts/Toast'
import useConfirmationModal from '../../utils/hooks/useConfirmationModal'
import {
  DataTable,
  DataView,
  GetDataTablesQuery,
  useCreateDataViewMutation,
  useDeleteDataViewMutation,
  useGetDataTablesQuery,
  useGetDataViewsQuery,
  useUpdateDataViewMutation,
} from '../../utils/generated/graphql'
import { toCamelCase } from '../../LookupTable/utils'
import { JsonEditor } from './JsonEditor'
import { pickBy } from 'lodash'
import { nanoid } from 'nanoid'

export const AdminDataViews: React.FC = () => {
  const { t } = useLanguageProvider()
  usePageTitle(t('PAGE_TITLE_DATA_VIEW'))

  const { query, updateQuery, setQuery } = useRouter()

  const { data, loading } = useGetDataTablesQuery()

  const [includeLookupTables, setIncludeLookupTables] = useState(false)

  const selectedTable = query.selectedTable

  return (
    <div id="data-view-config-panel">
      <Header>{t('DATA_VIEW_CONFIG_HEADER')}</Header>
      <div>
        <Dropdown
          selection
          clearable
          placeholder={t('DATA_VIEW_CONFIG_SELECT_TABLE')}
          loading={loading}
          value={selectedTable}
          options={getDataTableOptions(data, includeLookupTables, t)}
          onChange={(_, { value }) => {
            if (!value) setQuery({})
            else updateQuery({ selectedTable: value })
          }}
        />
        <Checkbox
          checked={includeLookupTables}
          onChange={() => setIncludeLookupTables(!includeLookupTables)}
          label={t('DATA_VIEW_CONFIG_INCLUDE_LOOKUP')}
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
  const { t } = useLanguageProvider()
  const { query, updateQuery } = useRouter()
  const { ConfirmModal, showModal: showConfirmation } = useConfirmationModal({
    type: 'warning',
    confirmText: t('BUTTON_CONFIRM'),
  })
  const showToast = useToast({ position: Position.topLeft })

  const { data, loading, refetch } = useGetDataViewsQuery({
    variables: { tableName },
  })

  const [updateDataView, { loading: isSaving }] = useUpdateDataViewMutation({
    onError: (e) =>
      showToast({ title: t('DATA_VIEW_CONFIG_UPDATE_PROBLEM'), text: e.message, style: 'error' }),
    onCompleted: (d) => {
      const identifier = d.updateDataView?.dataView?.identifier
      showToast({ title: t('DATA_VIEW_CONFIG_SAVED'), text: identifier, style: 'success' })
      updateQuery({ dataView: d.updateDataView?.dataView?.identifier })
    },
  })

  const [deleteDataView, { loading: isDeleting }] = useDeleteDataViewMutation({
    onError: (e) =>
      showToast({ title: t('DATA_VIEW_CONFIG_DELETE_PROBLEM'), text: e.message, style: 'error' }),
    onCompleted: (d) => {
      showToast({ title: t('DATA_VIEW_CONFIG_DELETED'), text: selectedDataView, style: 'success' })
      updateQuery({ dataView: null })
      refetch()
    },
  })

  const [addDataView, { loading: isAdding }] = useCreateDataViewMutation({
    onError: (e) =>
      showToast({ title: t('DATA_VIEW_CONFIG_ADD_PROBLEM'), text: e.message, style: 'error' }),
    onCompleted: (d) => {
      showToast({
        title: t('DATA_VIEW_CONFIG_ADDED'),
        text: t('DATA_VIEW_CONFIG_ADD_MESSAGE'),
        style: 'success',
      })
      updateQuery({ dataView: d.createDataView?.dataView?.identifier })
      refetch()
    },
  })

  const selectedDataView = query.dataView

  const dataViews = data?.dataViews?.nodes as DataView[] | undefined

  const dataViewObject = dataViews && dataViews.find((dv) => dv.identifier === selectedDataView)

  return (
    <div>
      <ConfirmModal />
      <Dropdown
        selection
        clearable
        placeholder={t('DATA_VIEW_CONFIG_SELECT_VIEW')}
        loading={loading}
        value={selectedDataView}
        options={getDataViewOptions(dataViews)}
        onChange={(_, { value }) => {
          if (dataViews) updateQuery({ dataView: value })
        }}
      />
      <Button
        primary
        disabled={!dataViewObject}
        loading={isDeleting}
        content={t('DATA_VIEW_CONFIG_DELETE_BUTTON')}
        onClick={() =>
          showConfirmation({
            title: t('DATA_VIEW_CONFIG_DELETE_WARNING'),
            message: t('DATA_VIEW_CONFIG_DELETE_MESSAGE'),
            onConfirm: () => deleteDataView({ variables: { id: dataViewObject?.id as number } }),
          })
        }
      />
      <Button
        primary
        loading={isAdding}
        content={t('DATA_VIEW_CONFIG_ADD_BUTTON')}
        onClick={() => {
          addDataView({
            variables: {
              identifier: `${tableName}_${nanoid(8)}`,
              tableName,
              code: '__CODE__',
              detailViewHeaderColumn: '__HEADER_COL__',
            },
          })
        }}
      />
      {dataViewObject && (
        <JsonEditor
          data={
            dataViewObject
              ? pickBy(
                  dataViewObject,
                  (_, key) =>
                    !['__typename', 'id']
                      // These two properties shouldn't show up in the editor,
                      // as we don't want them being touched
                      .includes(key)
                )
              : undefined
          }
          onSave={(data) =>
            showConfirmation({
              title: t('DATA_VIEW_CONFIG_SAVE_WARNING'),
              message: t('DATA_VIEW_CONFIG_SAVE_MESSAGE'),
              onConfirm: () =>
                updateDataView({ variables: { id: dataViewObject?.id as number, patch: data } }),
            })
          }
          isSaving={isSaving}
          name={dataViewObject?.identifier}
          collapsed={1}
          displayArrayKey={false}
          quotesOnKeys={false}
          displayDataTypes={true}
          style={{ padding: '10px' }}
        />
      )}
    </div>
  )
}

const getDataTableOptions = (
  data: GetDataTablesQuery | undefined,
  includeLookupTables: boolean,
  t: TranslateMethod
) => {
  if (!data) return []

  return (data.dataTables?.nodes as DataTable[])
    .filter(({ isLookupTable }) => (includeLookupTables ? true : !isLookupTable))
    .map(({ id, tableName, isLookupTable }) => {
      const table = toCamelCase(tableName)
      return {
        key: `${table}_${id}`,
        text: `${table}${isLookupTable ? ` (${t('LOOKUP_TABLE_TITLE')})` : ''}`,
        value: table,
      }
    })
}

const getDataViewOptions = (dataViews: DataView[] | undefined) => {
  if (!dataViews) return []

  return dataViews.map((dataView) => {
    const { id, identifier, code } = dataView
    return {
      key: `${code}_${id}`,
      text: identifier,
      value: identifier,
      data: dataView,
    }
  })
}
