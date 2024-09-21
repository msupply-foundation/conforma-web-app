import { useState } from 'react'
import { useToast } from '../../../contexts/Toast'
import { getRequest, postRequest } from '../../../utils/helpers/fetchMethods'
import getServerUrl from '../../../utils/helpers/endpoints/endpointUrlBuilder'
import { Template } from '../useGetTemplates'
import { downloadFile } from '../../../utils/helpers/utilityFunctions'
import config from '../../../config'
import { SetErrorAndLoadingState } from '../shared/OperationContextHelpers'
import { getVersionString } from '../template/helpers'
import { ModifiedEntities } from './EntitySelectModal'

type ModalType =
  | 'unlinkedDataViewWarning'
  | 'commit'
  | 'exportCommit'
  | 'exportWarning'
  | 'import'
  | 'duplicate'

export interface ModalState {
  type: ModalType
  isOpen: boolean
  onConfirm: (input: unknown) => Promise<void>
  close: () => void
  currentIsCommitted?: boolean
  entities?: ModifiedEntities
}

export type PreserveExistingEntities = {
  filters?: Set<string>
  permissions?: Set<string>
  dataViews?: Set<string>
  dataViewColumns?: Set<string>
  dataTables?: Set<string>
  category?: string | null
  files?: Set<string>
}

const commit = async (id: number, comment: string) => {
  try {
    const { versionId } = await postRequest({
      url: getServerUrl('templateImportExport', { action: 'commit', id }),
      jsonBody: { comment },
      headers: { 'Content-Type': 'application/json' },
    })
    return { versionId }
  } catch (err) {
    return { error: (err as Error).message }
  }
}

const check = async (id: number) => {
  try {
    const result = await getRequest(
      getServerUrl('templateImportExport', { action: 'export', id, type: 'check' })
    )
    return result
  } catch (err) {
    return { error: (err as Error).message }
  }
}

const duplicate = async (id: number, code?: string) => {
  try {
    const newId = await postRequest({
      url: getServerUrl('templateImportExport', {
        action: 'duplicate',
        id,
        type: code ? 'new' : 'version',
      }),
      jsonBody: { code },
      headers: { 'Content-Type': 'application/json' },
    })
    return { newId }
  } catch (err) {
    return { error: (err as Error).message }
  }
}

const exportAndDownload = async ({ id, code, versionId, versionHistory }: Template) => {
  const JWT = localStorage.getItem(config.localStorageJWTKey)
  const filename = `${code}-${versionId}_v${versionHistory.length + 1}.zip`
  try {
    await downloadFile(
      getServerUrl('templateImportExport', {
        action: 'export',
        id,
        type: 'dump',
      }),
      filename,
      {
        headers: { Authorization: `Bearer ${JWT}` },
      }
    )
  } catch (err) {
    return { error: (err as Error).message }
  }
}

const upload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  if (!e.target?.files) return { error: 'No file selected' }
  const file = e.target.files[0]
  try {
    const data = new FormData()
    data.append('file', file)

    const result = await postRequest({
      url: getServerUrl('templateImportExport', { action: 'import', type: 'upload' }),
      otherBody: data,
    })
    return result
  } catch (err) {
    return { error: (err as Error).message }
  }
}

const install = async (uid: string, installDetails: PreserveExistingEntities) => {
  try {
    const result = await postRequest({
      url: getServerUrl('templateImportExport', {
        action: 'import',
        uid,
        type: 'install',
      }),
      jsonBody: installDetails,
      headers: { 'Content-Type': 'application/json' },
    })
    return result
  } catch (err) {
    return { error: (err as Error).message }
  }
}

interface ProgressStep {
  step: number
  state: unknown
}

export const useTemplateOperations = (setErrorAndLoadingState: SetErrorAndLoadingState) => {
  const [modalState, setModalState] = useState<ModalState>({
    type: 'commit',
    isOpen: false,
    onConfirm: async () => {},
    close: () => setModalState({ ...modalState, isOpen: false }),
  })
  // const [progressStep, setProgressStep] = useState()

  const { showToast } = useToast()

  const updateModalState = (newState: Partial<ModalState>) =>
    setModalState({ ...modalState, ...newState })

  const showModal = (
    type: ModalType,
    onConfirm: (input: unknown) => Promise<void>,
    loadingOnConfirm: boolean = true
  ) => {
    updateModalState({
      type,
      isOpen: true,
      onConfirm: async (input: unknown) => {
        updateModalState({ isOpen: false })
        if (loadingOnConfirm) setErrorAndLoadingState({ isLoading: true })
        await onConfirm(input)
      },
    })
  }

  const showError = (title: string, error: string) => {
    if (error.length > 100)
      setErrorAndLoadingState({ error: { title, message: error }, isLoading: false })
    else {
      showToast({
        title,
        text: error,
        style: 'error',
      })
      setErrorAndLoadingState({ isLoading: false })
    }
  }

  const showSuccess = ({ title, message }: { title: string; message: string }) => {
    showToast({
      title,
      text: message,
      style: 'success',
    })
    setErrorAndLoadingState({ isLoading: false })
  }

  // const preCommitCheck = async (id: number) => {
  //   const { committed, error } = await check(id)
  //   if (error) {
  //     showError('Problem checking template details', error)
  //     return
  //   }
  //   if (committed) return true

  //   updateModalState({
  //     type: 'commitWarning',
  //     iOpen: true,
  //     onConfirm: async (result) => {
  //       return result
  //     },
  //   })
  // }

  const commitTemplate = async (
    id: number,
    refetch: () => void,
    ignoreUnconnectedDataViews?: boolean
  ) => {
    if (!ignoreUnconnectedDataViews) {
      setErrorAndLoadingState({ isLoading: true })
      const { unconnectedDataViews, error } = await check(id)
      if (error) {
        showError('Problem checking template', error)
        return
      }
      setErrorAndLoadingState({ isLoading: false })

      if (unconnectedDataViews.length > 0) {
        showModal(
          'unlinkedDataViewWarning',
          async () => {
            commitTemplate(id, refetch, true)
          },
          false
        )
        return
      }
    }

    showModal('commit', async (comment) => {
      const { versionId, error } = await commit(id, comment as string)
      if (error) {
        showError('Problem committing template', error)
        return
      }
      showSuccess({ title: 'Template committed', message: `Version ID: ${versionId}` })
      refetch()
    })
  }

  const duplicateTemplate = async (
    template: Template,
    refetch: () => void,
    { ignoreUnconnectedDataViews = false }: { ignoreUnconnectedDataViews?: boolean } = {}
  ) => {
    setErrorAndLoadingState({ isLoading: true })
    const { committed, error } = await check(template.id)
    if (error) {
      showError('Problem checking template details', error)
      return
    }

    updateModalState({
      type: 'duplicate',
      isOpen: true,
      currentIsCommitted: committed,
      onConfirm: async (input) => {
        updateModalState({ isOpen: false })
        setErrorAndLoadingState({ isLoading: true })
        const { newCode, comment } = input as { newCode?: string; comment?: string }

        if (comment) {
          const { error } = await commit(template.id, comment)
          if (error) {
            showError('Problem committing template', error)
            return
          }
        }

        const { error } = await duplicate(template.id, newCode)
        if (error) {
          showError('Problem duplicating template', error)
          return
        }

        showSuccess({
          title: newCode ? 'New template created' : 'New template version created',
          message: `${newCode ?? template.code}`,
        })

        refetch()
      },
    })
  }

  const exportTemplate = async (
    template: Template,
    refetch: () => void,
    {
      ignoreUnconnectedDataViews = false,
      confirmedReady = false,
    }: { ignoreUnconnectedDataViews?: boolean; confirmedReady?: boolean } = {}
  ) => {
    if (!ignoreUnconnectedDataViews) {
      setErrorAndLoadingState({ isLoading: true })
      const { committed, unconnectedDataViews, error } = await check(template.id)
      if (error) {
        showError('Problem checking template', error)
        return
      }
      setErrorAndLoadingState({ isLoading: false })

      if (unconnectedDataViews.length > 0) {
        showModal(
          'unlinkedDataViewWarning',
          async () => {
            exportTemplate(template, refetch, { ignoreUnconnectedDataViews: true })
          },
          false
        )
        return
      }
    }

    setErrorAndLoadingState({ isLoading: true })
    const { committed, ready, diff, error } = await check(template.id)
    if (error) {
      showError('Problem committing template', error)
      return
    }
    setErrorAndLoadingState({ isLoading: false })

    if (!committed) {
      updateModalState({
        type: 'exportCommit',
        isOpen: true,
        onConfirm: async (comment) => {
          updateModalState({ isOpen: false })
          setErrorAndLoadingState({ isLoading: true })

          const { error } = await commit(template.id, comment as string)
          if (error) {
            showError('Problem committing template', error)
            return
          }
          exportTemplate(template, refetch, { ignoreUnconnectedDataViews: true })
        },
      })
      console.log('Modal opened, returning')
      return
    }

    if (!ready && !confirmedReady) {
      // Warn user
    }

    const result = await exportAndDownload(template)
    if (result?.error) {
      showError('Problem exporting template', result.error)
      return
    }

    showSuccess({
      title: 'Template exported',
      message: `${template.code} - ${getVersionString(template)}`,
    })
    refetch()
  }

  const importTemplate = async (e: React.ChangeEvent<HTMLInputElement>, refetch: () => void) => {
    // Upload and analyze
    setErrorAndLoadingState({ isLoading: true })
    const { uid, modifiedEntities, ready, error } = await upload(e)
    if (error) {
      showError('Problem uploading template', error)
      return
    }

    const installTemplate = async () => {
      const { versionId, versionNo, status, code, error } = await install(uid, preserveExisting)
      if (error) {
        showError('Problem installing template', error)
        return
      }
      showSuccess({
        title: 'Template imported',
        message: `${code} - v${versionNo} (${versionId})\nStatus: ${status}`,
      })
      refetch()
    }

    let preserveExisting: PreserveExistingEntities = {}

    if (!ready) {
      updateModalState({
        type: 'import',
        isOpen: true,
        onConfirm: async (result) => {
          preserveExisting = result as PreserveExistingEntities
          updateModalState({ isOpen: false })
          setErrorAndLoadingState({ isLoading: true })

          installTemplate()
        },
      })
    }
    // Install
    installTemplate()
  }

  return {
    commitTemplate,
    duplicateTemplate,
    exportTemplate,
    importTemplate,
    modalState,
  }
}
