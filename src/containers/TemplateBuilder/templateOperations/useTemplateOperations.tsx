import { useState } from 'react'
import { useToast } from '../../../contexts/Toast'
import { getRequest, postRequest } from '../../../utils/helpers/fetchMethods'
import getServerUrl from '../../../utils/helpers/endpoints/endpointUrlBuilder'
import { Template } from '../useGetTemplates'
import { downloadFile } from '../../../utils/helpers/utilityFunctions'
import config from '../../../config'
import { SetErrorAndLoadingState } from '../shared/OperationContextHelpers'
import { Confirm, Input } from 'semantic-ui-react'

export interface ModalState {
  type: 'commit' | 'exportCommit' | 'exportWarning' | 'import' | 'duplicate'
  isOpen: boolean
  onConfirm: () => void
  close: () => void
}

export const useTemplateOperations = (setErrorAndLoadingState: SetErrorAndLoadingState) => {
  const [modalState, setModalState] = useState<ModalState>({
    type: 'commit',
    isOpen: false,
    onConfirm: () => {},
    close: () => setModalState({ ...modalState, isOpen: false }),
  })

  const { showToast } = useToast()

  const JWT = localStorage.getItem(config.localStorageJWTKey)

  const updateModalState = (newState: Partial<ModalState>) =>
    setModalState({ ...modalState, ...newState })

  const commitTemplate = async (id: number, comment: string, showSuccess: boolean = true) => {
    updateModalState({
      type: 'commit',
      isOpen: true,
      onConfirm: async () => {
        updateModalState({ isOpen: false })
        setErrorAndLoadingState({ isLoading: true })
        try {
          const { versionId } = await postRequest({
            url: getServerUrl('templateImportExport', { action: 'commit', id }),
            jsonBody: { comment },
            headers: { 'Content-Type': 'application/json' },
          })
          if (showSuccess)
            showToast({
              title: 'Template committed',
              text: `Version ID: ${versionId}`,
              style: 'success',
            })
          setErrorAndLoadingState({ isLoading: false })
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

  const duplicateTemplate = async (template: Template, code?: string) => {
    try {
      await postRequest({
        url: getServerUrl('templateImportExport', {
          action: 'duplicate',
          id: template.id,
          type: code ? 'new' : 'version',
        }),
        jsonBody: { code },
        headers: { 'Content-Type': 'application/json' },
      })
      showToast({
        title: code ? 'New template created' : 'New template version created',
        text: `${code ?? template.code}`,
      })
      return true
      // await refetch() TO-DO
    } catch (err) {
      showToast({
        title: 'Problem duplicating template',
        text: (err as Error).message,
        style: 'error',
      })
      return false
    }
  }

  const exportTemplate = async (id: number) => {
    setErrorAndLoadingState({ isLoading: true })
    // If not committed, show warning, commit, then export
    const { ready, diff, unconnectedDataViews } = await getRequest(
      getServerUrl('templateImportExport', { action: 'export', id, type: 'check' })
    )

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
    } else {
      // Show warning to user
      showToast({
        style: 'warning',
        title: 'Something has changed',
        text: JSON.stringify(unconnectedDataViews),
      })
    }
    setErrorAndLoadingState({ isLoading: false })

    // If committed, run check, show warning if necessary
    // Export and download
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

export const CommitConfirmation: React.FC<{ commit: any; cancel: any; open: boolean }> = (
  props
) => {
  // const {export, cancel} = props
  const [comment, setComment] = useState('')
  return (
    <Confirm
      open={props.open}
      // Prevent click in Input from closing modal
      onClick={(e: any) => e.stopPropagation()}
      content={
        <div style={{ padding: 10, gap: 10 }} className="flex-column">
          <h2>Commit and export template?</h2>
          <p>
            By exporting this template now, you will be committing the current version. To make any
            further changes, you will need to duplicate it and start a new template version.
          </p>
          <div className="flex-row-start-center" style={{ gap: 10 }}>
            <label>Please provide a commit message:</label>
            <Input
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              style={{ width: '60%' }}
            />
          </div>
        </div>
      }
      onCancel={props.cancel}
      onConfirm={props.commit}
    />
  )
}
