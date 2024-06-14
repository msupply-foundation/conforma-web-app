import { TypedDocumentNode, OperationVariables, ApolloQueryResult } from '@apollo/client'
import { DocumentNode } from 'graphql'

type AllLookupTableStructuresType = {
  allTableStructuresLoadState: ApolloQueryResult<any>
  allTableStructures?: LookUpTableType[]
  setAllTableStructures: (rows: any) => void
  refetchAllTableStructures: (variables: any) => Promise<ApolloQueryResult<any>>
}

type FieldMapType = {
  fieldname: string
  label: string
  dataType: string
  gqlName: string
}

type LookUpTableType = {
  id: number
  displayName: string
  tableName: string
  fieldMap: Array<FieldMapType>
  dataViewCode: string | null
  isExpanded?: boolean
}

type TableStructureType = {
  tableQuery: DocumentNode | TypedDocumentNode<any, OperationVariables>
  tableName: string
  structure: LookUpTableType
}

type LookUpTableListMainMenuType = {
  headerText: string
  subHeaderText?: string
}

enum LookUpTableImportCsvActions {
  UploadModalOpen = 'OPEN_MODAL',
  UploadModalClose = 'CLOSE_MODAL',
  ImportCSV = 'SET_FILE',
  SetTableName = 'SET_TABLE_NAME',
  submittable = 'SUBMITTABLE',
  submitting = 'SUBMITTING',
  setErrorMessages = 'SET_ERROR_MESSAGES',
  setSuccessMessages = 'SET_SUCCESS_MESSAGES',
}

type LookUpTableImportCsvType = {
  uploadModalOpen: boolean
  file: File | null
  tableName: string
  submittable: boolean
  submitting: boolean
  errors: []
  success: []
}

type LookUpTableImportCsvActionType =
  | { type: 'OPEN_MODAL' }
  | { type: 'CLOSE_MODAL' }
  | { type: 'SET_FILE'; payload: File }
  | { type: 'SET_TABLE_NAME'; payload: string }
  | { type: 'SUBMITTABLE'; payload: boolean }
  | { type: 'SUBMITTING'; payload: boolean }
  | { type: 'SET_ERROR_MESSAGES'; payload: [] }
  | { type: 'SET_SUCCESS_MESSAGES'; payload: [] }

export {
  FieldMapType,
  LookUpTableType,
  TableStructureType,
  LookUpTableListMainMenuType,
  LookUpTableImportCsvActions,
  LookUpTableImportCsvType,
  LookUpTableImportCsvActionType,
  AllLookupTableStructuresType,
}
