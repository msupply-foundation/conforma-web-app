import { DateTimeFormatOptions } from 'luxon'
import { DateTimeConstant } from '../../utils/data/LuxonDateTimeConstants'

// Response value of /outcomes endpoint
export type OutcomesResponse = {
  tableName: string
  title: string
  code: string
}[]

interface FormatOptions {
  elementTypePluginCode?: string
  elementParameters?: object
  substitution?: string
  dateFormat?: DateTimeConstant | DateTimeFormatOptions
  // Add more as required
}

export interface DisplayDefinitionBasic {
  dataType?: string
  formatting: FormatOptions
}

export interface DisplayDefinition {
  title: string
  isBasicField: boolean
  dataType?: string
  formatting: FormatOptions
}
export interface HeaderRow extends DisplayDefinition {
  columnName: string
}

interface TableRow {
  id: number
  rowValues: any[]
  item: { [key: string]: any }
}

// Response object of /outcomes/table endpoint
export interface OutcomesTableResponse {
  tableName: string
  title: string
  code: string
  headerRow: HeaderRow[]
  tableRows: TableRow[]
  totalCount: number
  message?: string
}

export interface LinkedApplication {
  id: number
  name: string
  serial: string
  templateName: string
  templateCode: string
  dateCompleted: Date
}

export interface DetailsHeader {
  value: any
  columnName: string
  isBasicField: boolean
  dataType: string | undefined
  formatting: FormatOptions
}

// Response object of /outcomes/table/.../item endpoint
export interface OutcomesDetailResponse {
  tableName: string
  id: number
  header: DetailsHeader
  columns: string[]
  item: { [key: string]: any }
  displayDefinitions: { [key: string]: DisplayDefinition }
  linkedApplications?: LinkedApplication[]
}

export type ApplicationDisplayField = {
  field: keyof LinkedApplication
  displayName: string
  dataType: string
  link: string | null
  linkVar?: keyof LinkedApplication
}
