import { useState } from 'react'
import { useToast } from '../../../contexts/Toast'
import { Template, VersionObject } from '../useGetTemplates'
import { SetErrorAndLoadingState } from '../shared/OperationContextHelpers'
import { ModifiedEntities } from './EntitySelectModal'
import { useMultiStep, WorkflowStep } from './useMultiStep'
import {
  commit,
  check,
  duplicate,
  upload,
  exportAndDownload,
  install,
  UnconnectedDataViews,
  PreserveExistingInput,
} from './apiOperations.ts'

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
  // Optional properties only used in particular cases
  currentIsCommitted?: boolean
  modifiedEntities?: ModifiedEntities
  unconnectedDataViews?: UnconnectedDataViews[]
}

export interface WorkflowState {
  id: number
  code: string
  versionId: string
  versionHistory: VersionObject[]
  status: string
  refetch: () => void
  committed?: boolean
  unconnectedDataViews?: unknown[]
  readyForExport?: boolean
  commitType?: 'commit' | 'exportCommit'
  uploadEvent?: React.ChangeEvent<HTMLInputElement>
  diff?: ModifiedEntities
  installInput?: { uid: string; preserveExisting: PreserveExistingInput }
}

export const useTemplateOperations = (setErrorAndLoadingState: SetErrorAndLoadingState) => {
  const [modalState, setModalState] = useState<ModalState>({
    type: 'commit',
    isOpen: false,
    onConfirm: async () => {},
    close: () => setModalState({ ...modalState, isOpen: false }),
  })
  const { setWorkflow, nextStep, hasNext, setWorkflowState } = useMultiStep<WorkflowState>({
    id: 0,
    code: '',
    versionId: '',
    versionHistory: [],
    status: '',
    refetch: () => {},
  })

  const { showToast } = useToast()

  const showModal = (
    type: ModalType,
    onConfirm: (input: unknown) => Promise<void> | void,
    additionalProps: {
      currentIsCommitted?: boolean
      unconnectedDataViews?: UnconnectedDataViews[]
      modifiedEntities?: ModifiedEntities
    } = {}
  ) => {
    setModalState({
      ...modalState,
      type,
      isOpen: true,
      onConfirm: async (input: unknown) => {
        setModalState((state) => ({ ...state, isOpen: false }))
        await onConfirm(input)
      },
      ...additionalProps,
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

  // Workflows
  const commitTemplate = async (template: Template, refetch: () => void) => {
    console.log('Running commit workflow')
    setWorkflow([checkStep, commitStep] as WorkflowStep[], {
      ...template,
      refetch,
    })
    nextStep()
  }

  const exportTemplate = async (template: Template, refetch: () => void) => {
    console.log('Running Export workflow')
    setWorkflow([checkStep, warnStep, commitStep, exportStep] as WorkflowStep[], {
      ...template,
      refetch,
      commitType: 'exportCommit',
    })
    nextStep()
  }

  const duplicateTemplate = async (template: Template, refetch: () => void) => {
    console.log('Running Export workflow')
    setWorkflow([checkStep, duplicateStep] as WorkflowStep[], {
      ...template,
      refetch,
    })
    nextStep()
  }

  const importTemplate = async (e: React.ChangeEvent<HTMLInputElement>, refetch: () => void) => {
    console.log('Running Export workflow')
    setWorkflow([uploadStep, installStep] as WorkflowStep[], {
      id: 0,
      code: '',
      versionId: '',
      versionHistory: [],
      status: '',
      refetch,
      uploadEvent: e,
    })
    nextStep()
  }

  // Individual Steps called as part of the above workflows

  const checkStep = async (state: WorkflowState) => {
    const { id } = state
    console.log('Checking', id)
    setErrorAndLoadingState({ isLoading: true })
    const checkResult = await check(id)
    setErrorAndLoadingState({ isLoading: false })

    if ('error' in checkResult) {
      showError('Problem checking template details', checkResult.error)
      return
    }

    const { committed, unconnectedDataViews = [], ready } = checkResult
    setWorkflowState({ ...state, committed, unconnectedDataViews, readyForExport: ready })

    console.log('committed', committed)

    if (unconnectedDataViews.length === 0 || committed) {
      nextStep()
      return
    }

    showModal('unlinkedDataViewWarning', nextStep, {
      unconnectedDataViews,
    })
  }

  const commitStep = async (state: WorkflowState) => {
    console.log('STATE', state)
    const { id, refetch, commitType } = state
    console.log('Committing', id)

    if (state?.committed) {
      console.log('Already committed, going to next step')
      if (hasNext()) nextStep()
      return
    }

    showModal(commitType ?? 'commit', async (comment) => {
      const { versionId, error } = await commit(id, comment as string)
      if (error) {
        showError('Problem committing template', error)
        return
      }
      setWorkflowState({ ...state, versionId })
      if (!hasNext()) {
        console.log('No next')
        showSuccess({ title: 'Template committed', message: `Version ID: ${versionId}` })
        refetch()
        return
      }

      console.log('Doing next...')
      nextStep()
    })
  }

  const duplicateStep = async (state: WorkflowState) => {
    const { id, code, committed, refetch } = state
    console.log('Duplicating, committed?', committed)
    showModal(
      'duplicate',
      async (input) => {
        setErrorAndLoadingState({ isLoading: true })
        const { newCode, comment } = input as { newCode?: string; comment?: string }

        if (comment) {
          const { error } = await commit(id, comment)
          if (error) {
            showError('Problem committing template', error)
            return
          }
        }

        const { error } = await duplicate(id, newCode)
        if (error) {
          showError('Problem duplicating template', error)
          return
        }

        showSuccess({
          title: newCode ? 'New template created' : 'New template version created',
          message: `${newCode ?? code}`,
        })

        refetch()
      },
      { currentIsCommitted: committed ?? false }
    )
  }

  const warnStep = async (state: WorkflowState) => {
    console.log('Warning...')
    if (state.readyForExport) {
      nextStep()
      return
    }

    showModal('exportWarning', nextStep)
  }

  const exportStep = async (state: WorkflowState) => {
    const { id, code, versionId, versionHistory, refetch } = state
    const result = await exportAndDownload(id, code, versionId, versionHistory)
    if (result?.error) {
      showError('Problem exporting template', result.error)
      return
    }

    showSuccess({
      title: 'Template exported',
      message: `${code} - (v${versionHistory.length + 1})`,
    })
    refetch() // Maybe can be conditional -- only need if wasn't committed previously
  }

  const uploadStep = async (state: WorkflowState) => {
    // Upload and analyze
    setErrorAndLoadingState({ isLoading: true })
    const event = state.uploadEvent
    if (!event) return
    const result = await upload(event)
    setErrorAndLoadingState({ isLoading: false })
    if ('error' in result) {
      showError('Problem uploading template', result.error)
      return
    }
    const { uid, modifiedEntities, ready } = result

    setWorkflowState({
      ...state,
      diff: modifiedEntities,
      installInput: { uid, preserveExisting: {} },
    })

    if (!ready) {
      showModal(
        'import',
        async (input) => {
          const preserveExisting = input as PreserveExistingInput
          setWorkflowState({ ...state, installInput: { uid, preserveExisting } })
          nextStep()
        },
        { modifiedEntities }
      )
      return
    }

    nextStep()
  }

  const installStep = async (state: WorkflowState) => {
    const { installInput, refetch } = state
    if (!installInput) return
    const { uid, preserveExisting } = installInput
    setErrorAndLoadingState({ isLoading: true })
    const { versionId, versionNo, status, code, error } = await install(uid, preserveExisting)
    setErrorAndLoadingState({ isLoading: false })

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

  return {
    commitTemplate,
    duplicateTemplate,
    exportTemplate,
    importTemplate,
    modalState,
  }
}
