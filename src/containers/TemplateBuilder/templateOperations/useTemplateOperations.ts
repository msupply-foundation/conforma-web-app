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

export const useTemplateOperations = (setErrorAndLoadingState: SetErrorAndLoadingState) => {
  const [modalState, setModalState] = useState<ModalState>({
    type: 'commit',
    isOpen: false,
    onConfirm: async () => {},
    close: () => setModalState({ ...modalState, isOpen: false }),
  })

  const { showToast } = useToast()

  const JWT = localStorage.getItem(config.localStorageJWTKey)

  const updateModalState = (newState: Partial<ModalState>) =>
    setModalState({ ...modalState, ...newState })

  const commitTemplate = async (id: number, refetch: () => void) => {
    updateModalState({
      type: 'commit',
      isOpen: true,
      onConfirm: async (comment) => {
        updateModalState({ isOpen: false })
        setErrorAndLoadingState({ isLoading: true })
        try {
          const { versionId } = await postRequest({
            url: getServerUrl('templateImportExport', { action: 'commit', id }),
            jsonBody: { comment },
            headers: { 'Content-Type': 'application/json' },
          })
          showToast({
            title: 'Template committed',
            text: `Version ID: ${versionId}`,
            style: 'success',
          })
          setErrorAndLoadingState({ isLoading: false })
          refetch()
        } catch (err) {
          showToast({
            title: 'Problem committing template',
            text: (err as Error).message,
            style: 'error',
          })
          setErrorAndLoadingState({
            isLoading: false,
            error: { message: (err as Error).message, error: 'Something else' },
          })
        }
      },
    })
  }

  const duplicateTemplate = async (template: Template, refetch: () => void) => {
    console.log('Are we duping?')
    setErrorAndLoadingState({ isLoading: true })
    const { committed } = await getRequest(
      getServerUrl('templateImportExport', { action: 'export', id: template.id, type: 'check' })
    )
    setErrorAndLoadingState({ isLoading: false })

    updateModalState({
      type: 'duplicate',
      isOpen: true,
      currentIsCommitted: committed,
      onConfirm: async (input) => {
        updateModalState({ isOpen: false })
        setErrorAndLoadingState({ isLoading: true })
        const { newCode, comment } = input as { newCode?: string; comment?: string }

        if (comment) {
          try {
            await postRequest({
              url: getServerUrl('templateImportExport', { action: 'commit', id: template.id }),
              jsonBody: { comment },
              headers: { 'Content-Type': 'application/json' },
            })
          } catch (err) {
            showToast({
              title: 'Problem committing template',
              text: (err as Error).message,
              style: 'error',
            })
            setErrorAndLoadingState({
              isLoading: false,
              error: { message: 'Something went wrong', error: 'Something else' },
            })
            return
          }
        }

        try {
          await postRequest({
            url: getServerUrl('templateImportExport', {
              action: 'duplicate',
              id: template.id,
              type: newCode ? 'new' : 'version',
            }),
            jsonBody: { code: newCode },
            headers: { 'Content-Type': 'application/json' },
          })
          showToast({
            title: newCode ? 'New template created' : 'New template version created',
            text: `${newCode ?? template.code}`,
            style: 'success',
          })
          refetch()
        } catch (err) {
          showToast({
            title: 'Problem duplicating template',
            text: (err as Error).message,
            style: 'error',
          })
        }
        setErrorAndLoadingState({ isLoading: false })
      },
    })
  }

  const exportTemplate = async (id: number, refetch: () => void) => {
    setErrorAndLoadingState({ isLoading: true })
    const { committed, ready, diff, unconnectedDataViews } = await getRequest(
      getServerUrl('templateImportExport', { action: 'export', id, type: 'check' })
    )
    setErrorAndLoadingState({ isLoading: false })

    if (!committed) {
      updateModalState({
        type: 'exportCommit',
        isOpen: true,
        onConfirm: async (comment) => {
          updateModalState({ isOpen: false })
          setErrorAndLoadingState({ isLoading: true })
          try {
            // First commit
            const result = await postRequest({
              url: getServerUrl('templateImportExport', { action: 'commit', id }),
              jsonBody: { comment },
              headers: { 'Content-Type': 'application/json' },
            })
            if (result.versionId) await exportTemplate(id, refetch)
            else
              setErrorAndLoadingState({
                isLoading: false,
                error: { message: 'Something went wrong', error: 'Something else' },
              })
          } catch (err) {
            showToast({
              title: 'Problem committing template',
              text: (err as Error).message,
              style: 'error',
            })
            setErrorAndLoadingState({
              isLoading: false,
              error: { message: (err as Error).message, error: 'Something else' },
            })
          }
        },
      })
      return
    }

    if (ready) {
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
      showToast({
        title: 'Template exported',
        text: 'Something something',
        style: 'success',
      })
      refetch()
    } else {
      // Show warning to user
      showToast({
        style: 'warning',
        title: 'Something has changed',
        text: JSON.stringify(unconnectedDataViews),
      })
    }
    setErrorAndLoadingState({ isLoading: false })
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
