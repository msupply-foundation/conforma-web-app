import { TypedDocumentNode, OperationVariables } from '@apollo/client'
import { DocumentNode } from 'graphql'

type FieldMapType = {
  fieldname: string
  label: string
}

type LookUpTableType = {
  id: number
  name: string
  label: string
  fieldMap: Array<FieldMapType>
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
}

type LookUpTableImportCsvType = {
  uploadModalOpen: boolean
  file: File | null
  tableName: string | null
}

type LookUpTableImportCsvActionType =
  | { type: 'OPEN_MODAL' }
  | { type: 'CLOSE_MODAL' }
  | { type: 'SET_FILE'; payload: File }
  | { type: 'SET_TABLE_NAME'; payload: string }

export {
  FieldMapType,
  LookUpTableType,
  TableStructureType,
  LookUpTableListMainMenuType,
  LookUpTableImportCsvActions,
  LookUpTableImportCsvType,
  LookUpTableImportCsvActionType,
}
