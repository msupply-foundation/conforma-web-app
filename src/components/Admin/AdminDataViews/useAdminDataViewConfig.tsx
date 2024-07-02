import { useRouter } from '../../../utils/hooks/useRouter'
import { useLanguageProvider } from '../../../contexts/Localisation'
import { useToast, Position } from '../../../contexts/Toast'
import {
  DataView,
  useGetDataViewsQuery,
  useCreateDataViewMutation,
  useDeleteDataViewMutation,
  useUpdateDataViewMutation,
  useGetColumnDefinitionsQuery,
  useCreateColumnDefinitionMutation,
  useDeleteColumnDefinitionMutation,
  useUpdateColumnDefinitionMutation,
  DataViewColumnDefinition,
} from '../../../utils/generated/graphql'

export const useAdminDataViewConfig = (tableName: string) => {
  const { t } = useLanguageProvider()

  const { query, updateQuery } = useRouter()

  const { showToast } = useToast({ position: Position.topLeft })

  // Data Views

  const { data, loading, refetch } = useGetDataViewsQuery({
    variables: { tableName },
  })

  const selectedDataView = query.dataView
  const dataViews = data?.dataViews?.nodes as DataView[] | undefined
  const dataViewObject = dataViews && dataViews.find((dv) => dv.identifier === selectedDataView)

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

  // Data View Column Definitions

  const {
    data: columnData,
    loading: columnsLoading,
    refetch: columnsRefetch,
  } = useGetColumnDefinitionsQuery({
    variables: { tableName },
  })

  const selectedColumn = query.columnDefinition
  const columnDefinitions = columnData?.dataViewColumnDefinitions?.nodes as
    | DataViewColumnDefinition[]
    | undefined
  const columnDefinitionObject =
    columnDefinitions && columnDefinitions.find((def) => def.columnName === selectedColumn)

  const [updateColumnDefinition, { loading: isSavingColumn }] = useUpdateColumnDefinitionMutation({
    onError: (e) =>
      showToast({
        title: t('DATA_VIEW_CONFIG_UPDATE_COL_PROBLEM'),
        text: e.message,
        style: 'error',
      }),
    onCompleted: (d) => {
      const columnName = d.updateDataViewColumnDefinition?.dataViewColumnDefinition?.columnName
      showToast({
        title: t('DATA_VIEW_CONFIG_COL_SAVED'),
        text: columnName ?? '',
        style: 'success',
      })
      updateQuery({
        columnDefinition: d.updateDataViewColumnDefinition?.dataViewColumnDefinition?.columnName,
      })
    },
  })

  const [deleteColumnDefinition, { loading: isDeletingColumn }] = useDeleteColumnDefinitionMutation(
    {
      onError: (e) =>
        showToast({
          title: t('DATA_VIEW_CONFIG_DELETE_COL_PROBLEM'),
          text: e.message,
          style: 'error',
        }),
      onCompleted: () => {
        showToast({
          title: t('DATA_VIEW_CONFIG_COL_DELETED'),
          text: selectedColumn,
          style: 'success',
        })
        updateQuery({ columnDefinition: null })
        columnsRefetch()
      },
    }
  )

  const [addColumnDefinition, { loading: isAddingColumn }] = useCreateColumnDefinitionMutation({
    onError: (e) =>
      showToast({ title: t('DATA_VIEW_CONFIG_ADD_COL_PROBLEM'), text: e.message, style: 'error' }),
    onCompleted: (d) => {
      showToast({
        title: t('DATA_VIEW_CONFIG_COL_ADDED'),
        text: t('DATA_VIEW_CONFIG_ADD_COL_MESSAGE'),
        style: 'success',
      })
      updateQuery({
        columnDefinition: d.createDataViewColumnDefinition?.dataViewColumnDefinition?.columnName,
      })
      columnsRefetch()
    },
  })

  return {
    selectedDataView,
    dataViews,
    dataViewObject,
    loading,
    updateDataView,
    deleteDataView,
    addDataView,
    isSaving,
    isDeleting,
    isAdding,
    selectedColumn,
    columnDefinitions,
    columnDefinitionObject,
    columnsLoading,
    updateColumnDefinition,
    deleteColumnDefinition,
    addColumnDefinition,
    isSavingColumn,
    isDeletingColumn,
    isAddingColumn,
  }
}
