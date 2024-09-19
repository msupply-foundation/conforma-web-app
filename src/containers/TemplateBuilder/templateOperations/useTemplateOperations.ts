import { useState } from 'react'
import { useToast } from '../../../contexts/Toast'
import { getRequest, postRequest } from '../../../utils/helpers/fetchMethods'
import getServerUrl from '../../../utils/helpers/endpoints/endpointUrlBuilder'
import { Template } from '../useGetTemplates'
import { downloadFile } from '../../../utils/helpers/utilityFunctions'
import config from '../../../config'
import { SetErrorAndLoadingState } from '../shared/OperationContextHelpers'

export interface ModalState {
  type: 'commit' | 'exportCommit' | 'exportWarning' | 'import' | 'duplicate'
  isOpen: boolean
  onConfirm: (input: unknown) => Promise<void>
  close: () => void
  currentIsCommitted?: boolean
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

const exportAndDownload = async (id: number) => {
  const JWT = localStorage.getItem(config.localStorageJWTKey)
  try {
    await downloadFile(
      getServerUrl('templateImportExport', {
        action: 'export',
        id,
        type: 'dump',
      }),
      'test.zip',
      {
        headers: { Authorization: `Bearer ${JWT}` },
      }
    )
  } catch (err) {
    return { error: (err as Error).message }
  }
}

export const useTemplateOperations = (setErrorAndLoadingState: SetErrorAndLoadingState) => {
  const [modalState, setModalState] = useState<ModalState>({
    type: 'commit',
    isOpen: false,
    onConfirm: async () => {},
    close: () => setModalState({ ...modalState, isOpen: false }),
  })

  const { showToast } = useToast()

  const updateModalState = (newState: Partial<ModalState>) =>
    setModalState({ ...modalState, ...newState })

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

  const commitTemplate = async (id: number, refetch: () => void) => {
    updateModalState({
      type: 'commit',
      isOpen: true,
      onConfirm: async (comment) => {
        updateModalState({ isOpen: false })
        setErrorAndLoadingState({ isLoading: true })
        const { versionId, error } = await commit(id, comment as string)
        if (error) {
          showError('Problem committing template', error)
          return
        }
        showSuccess({ title: 'Template committed', message: `Version ID: ${versionId}` })
        refetch()
      },
    })
  }

  const duplicateTemplate = async (template: Template, refetch: () => void) => {
    setErrorAndLoadingState({ isLoading: true })
    const { committed, error } = await check(template.id)
    if (error) {
      showError('Problem committing template', error)
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

  const exportTemplate = async (template: Template, refetch: () => void) => {
    setErrorAndLoadingState({ isLoading: true })
    const { committed, ready, diff, unconnectedDataViews, error } = await check(template.id)
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

          const { error } = await commit(id, comment as string)
          if (error) {
            showError('Problem committing template', error)
            return
          }
        },
      })
      return
    }

    if (!ready) {
      // Warn user
    }

    const result = await exportAndDownload(template.id)
    if (result?.error) {
      showError('Problem exporting template', result.error)
      return
    }

    showSuccess({ title: 'Template exported', message: template.versionId })
    refetch()
  }

  const importTemplate = async () => {
    // Upload and analyze
    // Show modal if necessary, wait for user input
    // Install
  }

  return {
    commitTemplate,
    duplicateTemplate,
    exportTemplate,
    modalState,
  }
}
