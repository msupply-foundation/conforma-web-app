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

export { FieldMapType, LookUpTableType, TableStructureType }
