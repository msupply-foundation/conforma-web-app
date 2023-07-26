import {
  useUpdateTemplateMutation,
  useUpdateTemplateFilterJoinMutation,
  useUpdateTemplateSectionMutation,
  useDeleteWholeApplicationMutation,
  useRestartApplicationMutation,
  useUpdateTemplateStageMutation,
  useDeleteTemplateMutation,
} from '../../../utils/generated/graphql'
import getServerUrl from '../../../utils/helpers/endpoints/endpointUrlBuilder'
import { postRequest } from '../../../utils/helpers/fetchMethods'
import useCreateApplication from '../../../utils/hooks/useCreateApplication'
import useGetApplicationSerial from '../../../utils/hooks/useGetApplicationSerial'
import {
  ImportTemplate,
  UpdateTemplate,
  UpdateTemplateFilterJoin,
  DeleteApplication,
  CreateApplication,
  TemplatesOperationProps,
  ErrorAndLoadingState,
  UpdateApplication,
  UpdateTemplateStage,
  DeleteTemplate,
} from './OperationContext'

const templateExportOptionName = 'templateExport'

type SetErrorAndLoadingState = (props: ErrorAndLoadingState) => void

type TemplateOperationHelper = (
  props: TemplatesOperationProps,
  setErrorAndLoadingState: SetErrorAndLoadingState
) => Promise<boolean>

type ImportTemplateHelper = (setErrorAndLoadingState: SetErrorAndLoadingState) => ImportTemplate

type UpdateTemplateHelper = (
  setErrorAndLoadingState: SetErrorAndLoadingState,
  updateTemplateMutation: ReturnType<typeof useUpdateTemplateMutation>[0]
) => UpdateTemplate

type DeleteTemplateHelper = (
  setErrorAndLoadingState: SetErrorAndLoadingState,
  updateTemplateSectionMutation: ReturnType<typeof useDeleteTemplateMutation>[0]
) => DeleteTemplate

type UpdateTemplateFilterJoinHelper = (
  setErrorAndLoadingState: SetErrorAndLoadingState,
  updateTemplateMutation: ReturnType<typeof useUpdateTemplateFilterJoinMutation>[0]
) => UpdateTemplateFilterJoin

type UpdateTemplateSectionHelper = (
  setErrorAndLoadingState: SetErrorAndLoadingState,
  updateTemplateSectionMutation: ReturnType<typeof useUpdateTemplateSectionMutation>[0]
) => UpdateTemplateFilterJoin

type DeleteApplicationHelper = (
  setErrorAndLoadingState: SetErrorAndLoadingState,
  deleteApplicationMutation: ReturnType<typeof useDeleteWholeApplicationMutation>[0]
) => DeleteApplication

type CreateApplicationHelper = (
  setErrorAndLoadingState: SetErrorAndLoadingState,
  create: ReturnType<typeof useCreateApplication>['create'],
  getSerialAsync: ReturnType<typeof useGetApplicationSerial>['getSerialAsync']
) => CreateApplication

type UpdateApplicationHelper = (
  setErrorAndLoadingState: SetErrorAndLoadingState,
  create: ReturnType<typeof useRestartApplicationMutation>[0]
) => UpdateApplication

type UpdateTemplateStageHelper = (
  setErrorAndLoadingState: SetErrorAndLoadingState,
  updateTemplateStageMutation: ReturnType<typeof useUpdateTemplateStageMutation>[0]
) => UpdateTemplateStage

const checkMutationResult = async (
  result: any,
  setErrorAndLoadingState: SetErrorAndLoadingState
) => {
  if (result?.errors) {
    setErrorAndLoadingState({
      isLoading: false,
      error: {
        message: 'error',
        error: JSON.stringify(result.errors),
      },
    })
    return false
  }
  return true
}

export const updateTemplate: UpdateTemplateHelper =
  (setErrorAndLoadingState: SetErrorAndLoadingState, updateTemplateMutation) =>
  async (template, patch) => {
    try {
      const result = await updateTemplateMutation({
        variables: { id: template.id, templatePatch: patch },
      })
      return checkMutationResult(result, setErrorAndLoadingState)
    } catch (e) {
      setErrorAndLoadingState({ isLoading: false, error: { error: 'error', message: e.message } })
      return false
    }
  }

export const updateTemplateFilterJoin: UpdateTemplateFilterJoinHelper =
  (setErrorAndLoadingState: SetErrorAndLoadingState, updateTemplateFilterJoin) =>
  async (id, patch) => {
    try {
      const result = await updateTemplateFilterJoin({ variables: { id, filterJoinPatch: patch } })
      return checkMutationResult(result, setErrorAndLoadingState)
    } catch (e) {
      setErrorAndLoadingState({ isLoading: false, error: { error: 'error', message: e.message } })
      return false
    }
  }

export const updateTemplateSection: UpdateTemplateSectionHelper =
  (setErrorAndLoadingState: SetErrorAndLoadingState, updatateTemplateSectionMutation) =>
  async (id, patch) => {
    try {
      const result = await updatateTemplateSectionMutation({
        variables: { id, sectionPatch: patch },
      })
      return checkMutationResult(result, setErrorAndLoadingState)
    } catch (e) {
      setErrorAndLoadingState({ isLoading: false, error: { error: 'error', message: e.message } })
      return false
    }
  }

export const updateApplication: UpdateApplicationHelper =
  (setErrorAndLoadingState: SetErrorAndLoadingState, updateApplicationMutation) =>
  async (serial, patch) => {
    try {
      const result = await updateApplicationMutation({
        variables: { serial, applicationPatch: patch },
      })
      return checkMutationResult(result, setErrorAndLoadingState)
    } catch (e) {
      setErrorAndLoadingState({ isLoading: false, error: { error: 'error', message: e.message } })
      return false
    }
  }

export const updateTemplateStage: UpdateTemplateStageHelper =
  (setErrorAndLoadingState: SetErrorAndLoadingState, updateTemplateStageMutation) =>
  async (id, patch) => {
    try {
      const result = await updateTemplateStageMutation({
        variables: { id, templateStagePatch: patch },
      })
      return checkMutationResult(result, setErrorAndLoadingState)
    } catch (e) {
      setErrorAndLoadingState({ isLoading: false, error: { error: 'error', message: e.message } })
      return false
    }
  }

export const deleteApplication: DeleteApplicationHelper =
  (setErrorAndLoadingState: SetErrorAndLoadingState, deleteApplicationMutation) => async (id) => {
    try {
      const result = await deleteApplicationMutation({
        variables: { id },
      })
      return checkMutationResult(result, setErrorAndLoadingState)
    } catch (e) {
      setErrorAndLoadingState({ isLoading: false, error: { error: 'error', message: e.message } })
      return false
    }
  }

export const createApplication: CreateApplicationHelper =
  (setErrorAndLoadingState: SetErrorAndLoadingState, create, getSerialAsync) => async (props) => {
    try {
      const result = await create(props)
      if (!checkMutationResult) return false

      const serial = await getSerialAsync(result?.data?.createApplication?.application?.id || 0)
      if (serial) return true

      setErrorAndLoadingState({
        isLoading: false,
        error: { error: 'error', message: 'cannot get newly created application serial' },
      })
      return false
    } catch (e) {
      setErrorAndLoadingState({ isLoading: false, error: { error: 'error', message: e.message } })
      return false
    }
  }

export const exportTemplate: TemplateOperationHelper = async (
  { id, snapshotName },
  setErrorAndLoadingState
) => {
  const result = await safeFetch(
    getServerUrl('snapshot', {
      action: 'take',
      name: snapshotName,
      options: templateExportOptionName,
    }),
    JSON.stringify(getFilterBody(id)),
    setErrorAndLoadingState
  )

  return result
}

export const duplicateTemplate: TemplateOperationHelper = async (
  { id, snapshotName, templates = {} },
  setErrorAndLoadingState
) => {
  const body = JSON.stringify({ ...getFilterBody(id), templates })

  const result = await safeFetch(
    getServerUrl('snapshot', {
      action: 'take',
      name: snapshotName,
      options: templateExportOptionName,
    }),
    body,
    setErrorAndLoadingState
  )

  if (!result) return false

  const snapshotResult = await safeFetch(
    getServerUrl('snapshot', {
      action: 'use',
      name: snapshotName,
      options: templateExportOptionName,
    }),
    body,
    setErrorAndLoadingState
  )

  // Delete the snapshot cos we don't want snapshots page cluttered with individual templates
  safeFetch(getServerUrl('snapshot', { action: 'delete', name: snapshotName }), {}, () => {})

  return snapshotResult
}

export const deleteTemplate: DeleteTemplateHelper =
  (setErrorAndLoadingState: SetErrorAndLoadingState, deleteTemplateMutation) => async (id) => {
    try {
      const result = await deleteTemplateMutation({
        variables: { id },
      })
      return checkMutationResult(result, setErrorAndLoadingState)
    } catch (e) {
      setErrorAndLoadingState({ isLoading: false, error: { error: 'error', message: e.message } })
      return false
    }
  }

export const importTemplate: ImportTemplateHelper =
  (setErrorAndLoadingState: SetErrorAndLoadingState) => async (e) => {
    if (!e.target?.files) return false
    const file = e.target.files[0]
    const snapshotName = file.name.replace('.zip', '')

    try {
      const data = new FormData()
      data.append('file', file)

      const result = await safeFetch(
        getServerUrl('snapshot', { action: 'upload' }),
        data,
        setErrorAndLoadingState
      )

      if (!result) return false

      const snapshotResult = await safeFetch(
        getServerUrl('snapshot', {
          action: 'use',
          name: snapshotName,
          options: templateExportOptionName,
        }),
        '{}',
        setErrorAndLoadingState
      )

      // Delete the snapshot cos we don't want snapshots page cluttered with individual templates
      safeFetch(getServerUrl('snapshot', { action: 'delete', name: snapshotName }), {}, () => {})

      return snapshotResult
    } catch (error) {
      setErrorAndLoadingState({ isLoading: false, error: { error: 'error', message: error } })
      return false
    }
  }

const getFilterBody = (id: number) => {
  const equalToTemplateId = { equalTo: id }
  const allElementsMatchTemplateId = { some: { templateId: equalToTemplateId } }
  const filters = {
    filters: {
      template: { id: equalToTemplateId },
      filter: { templateFilterJoins: allElementsMatchTemplateId },
      permissionName: { templatePermissions: allElementsMatchTemplateId },
      templateCategory: { templates: { some: { id: { equalTo: id } } } },
    },
  }
  return filters
}
const safeFetch = async (
  url: string,
  body: any,
  setErrorAndLoadingState: SetErrorAndLoadingState
) => {
  setErrorAndLoadingState({ isLoading: true })
  try {
    const resultJson = await postRequest({
      url,
      headers: typeof body === 'string' ? { 'Content-Type': 'application/json' } : {},
      otherBody: body,
    })
    if (!!resultJson?.success) {
      setErrorAndLoadingState({ isLoading: false })
      return true
    }

    setErrorAndLoadingState({ isLoading: false, error: resultJson })
    return false
  } catch (error) {
    setErrorAndLoadingState({ isLoading: false, error: { error: 'error', message: error } })
    return false
  }
}

export const getRandomNumber = () => Math.floor(Math.random() * Math.pow(9, 9))
