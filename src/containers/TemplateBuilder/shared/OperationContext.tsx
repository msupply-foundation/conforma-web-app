import React, { useState, useContext, createContext } from 'react'
import { Modal, Label, Icon, Loader } from 'semantic-ui-react'
import {
  ApplicationPatch,
  TemplateFilterJoinPatch,
  TemplatePatch,
  TemplateSectionPatch,
  TemplateStagePatch,
  useDeleteTemplateMutation,
  useDeleteWholeApplicationMutation,
  useRestartApplicationMutation,
  useUpdateTemplateFilterJoinMutation,
  useUpdateTemplateMutation,
  useUpdateTemplateSectionMutation,
  useUpdateTemplateStageMutation,
} from '../../../utils/generated/graphql'
import useCreateApplication, {
  CreateApplicationProps,
} from '../../../utils/hooks/useCreateApplication'
import useGetApplicationSerial from '../../../utils/hooks/useGetApplicationSerial'
import {
  exportTemplate,
  duplicateTemplate,
  importTemplate,
  updateTemplate,
  updateTemplateFilterJoin,
  updateTemplateSection,
  deleteApplication,
  createApplication,
  updateApplication,
  updateTemplateStage,
  deleteTemplate,
} from './OperationContextHelpers'
import { VersionObject } from '../useGetTemplates'
import { TemplateState } from '../template/TemplateWrapper'

type Error = { message: string; error: string }
export type ErrorAndLoadingState = {
  error?: Error
  isLoading: boolean
}

export type TemplateOptions = { resetVersion?: boolean; newCode?: string }

export type TemplatesOperationProps = {
  id: number
  snapshotName: string
  templates?: TemplateOptions
}
export type TemplatesOperation = (props: TemplatesOperationProps) => Promise<boolean>
export type ImportTemplate = (e: any) => Promise<boolean>
export type UpdateTemplate = (template: TemplateState, patch: TemplatePatch) => Promise<boolean>
export type DeleteTemplate = (id: number) => Promise<boolean>
export type UpdateTemplateFilterJoin = (
  id: number,
  patch: TemplateFilterJoinPatch
) => Promise<boolean>
export type UpdateTemplateSection = (id: number, patch: TemplateSectionPatch) => Promise<boolean>
export type DeleteApplication = (id: number) => Promise<boolean>
export type CreateApplication = (props: CreateApplicationProps) => Promise<boolean>
export type UpdateApplication = (serial: string, patch: ApplicationPatch) => Promise<boolean>
export type UpdateTemplateStage = (id: number, patch: TemplateStagePatch) => Promise<boolean>

type OperationContextState = {
  fetch: (something: any) => any
  exportTemplate: TemplatesOperation
  duplicateTemplate: TemplatesOperation
  importTemplate: ImportTemplate
  updateTemplate: UpdateTemplate
  deleteTemplate: DeleteTemplate
  updateTemplateFilterJoin: UpdateTemplateFilterJoin
  updateTemplateSection: UpdateTemplateSection
  deleteApplication: DeleteApplication
  createApplication: CreateApplication
  updateApplication: UpdateApplication
  updateTemplateStage: UpdateTemplateStage
}

const contextNotPresentError = () => {
  throw new Error('context not present')
}

const defaultOperationContext: OperationContextState = {
  fetch: contextNotPresentError,
  exportTemplate: contextNotPresentError,
  duplicateTemplate: contextNotPresentError,
  importTemplate: contextNotPresentError,
  updateTemplate: contextNotPresentError,
  deleteTemplate: contextNotPresentError,
  updateTemplateFilterJoin: contextNotPresentError,
  updateTemplateSection: contextNotPresentError,
  deleteApplication: contextNotPresentError,
  createApplication: contextNotPresentError,
  updateApplication: contextNotPresentError,
  updateTemplateStage: contextNotPresentError,
}

const Context = createContext(defaultOperationContext)

const OperationContext: React.FC = ({ children }) => {
  const [updateTemplateMutation] = useUpdateTemplateMutation()
  const [updateTemplateFilterJoinMutation] = useUpdateTemplateFilterJoinMutation()
  const [updateTemplateSectionMutation] = useUpdateTemplateSectionMutation()
  const [deleteTemplateMutation] = useDeleteTemplateMutation()
  const [deleteApplicationMutation] = useDeleteWholeApplicationMutation()
  const [updateApplicationMutation] = useRestartApplicationMutation()
  const [updateTemplateStageMutation] = useUpdateTemplateStageMutation()
  const [innerState, setInnerState] = useState<ErrorAndLoadingState>({ isLoading: false })
  const { create } = useCreateApplication()
  const { getSerialAsync } = useGetApplicationSerial()
  const [contextState] = useState<OperationContextState>({
    fetch: () => {},
    exportTemplate: (props) => exportTemplate(props, setInnerState),
    duplicateTemplate: (props) => duplicateTemplate(props, setInnerState),
    importTemplate: importTemplate(setInnerState),
    updateTemplate: updateTemplate(setInnerState, updateTemplateMutation),
    updateTemplateFilterJoin: updateTemplateFilterJoin(
      setInnerState,
      updateTemplateFilterJoinMutation
    ),
    deleteTemplate: deleteTemplate(setInnerState, deleteTemplateMutation),
    updateTemplateSection: updateTemplateSection(setInnerState, updateTemplateSectionMutation),
    deleteApplication: deleteApplication(setInnerState, deleteApplicationMutation),
    createApplication: createApplication(setInnerState, create, getSerialAsync),
    updateApplication: updateApplication(setInnerState, updateApplicationMutation),
    updateTemplateStage: updateTemplateStage(setInnerState, updateTemplateStageMutation),
  })

  const { isLoading, error } = innerState
  const renderExtra = () => (
    <Modal open={!!isLoading || !!error} onClick={resetLoading} onClose={resetLoading}>
      {error ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Label size="large" color="red">
            {error.message}
            <Icon name="close" onClick={resetLoading} />
          </Label>
          <div style={{ margin: 20 }}>{error.error}</div>
        </div>
      ) : (
        <Loader active>Loading</Loader>
      )}
    </Modal>
  )

  const resetLoading = () => {
    setInnerState({ isLoading: false })
  }

  return (
    <Context.Provider value={contextState}>
      {children}
      {renderExtra()}
    </Context.Provider>
  )
}

export default OperationContext
export const useOperationState = () => useContext(Context)
