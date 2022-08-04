import { DataViewTableAPIQueries } from '../../types'

export type BasicEndpoint = [
  // These ones don't take any query parameters or sub-routes
  endpoint:
    | 'public'
    | 'prefs'
    | 'login'
    | 'loginOrg'
    | 'userInfo'
    | 'createHash'
    | 'generatePDF'
    | 'previewActions'
    | 'extendApplication'
    | 'admin'
    | 'installLanguage'
    | 'allLanguages'
]

export type LanguageEndpoint = [endpoint: 'language', options: { code: string }]

export type VerifyEndpoint = [endpoint: 'verify', options: { uid: string }]

export type FileEndpoint = [endpoint: 'file', options: { fileId: string; thumbnail?: boolean }]

export type UserPermissionsEndpoint = [
  endpoint: 'userPermissions',
  options: { username?: string; orgId?: number | null }
]

export type CheckTriggersEndpoint = [endpoint: 'checkTrigger', options: { serial: string }]

export type CheckUniqueEndpoint = [
  endpoint: 'checkUnique',
  options: (
    | {
        type: 'username' | 'email' | 'organisation'
      }
    | {
        table: string
        field: string
      }
  ) & { value: string }
]

export type DataViewEndpoint = [
  endpoint: 'dataViews',
  options?:
    | { tableName: string; query?: DataViewTableAPIQueries }
    | { tableName: string; itemId: number }
]

export type UploadEndpoint = [
  endpoint: 'upload',
  options: {
    userId?: number | null
    applicationSerial?: string
    applicationResponseId?: number
    applicationNoteId?: number
    uniqueId?: string
    templateId?: string
    subfolder?: string
    description?: string | null
  }
]

export type EnableLanguageEndpoint = [
  endpoint: 'enableLanguage',
  options: { code: string; enabled?: boolean }
]

export type RemoveLanguageEndpoint = [endpoint: 'removeLanguage', options: { code: string }]

export type SnapshotEndpoint = [
  endpoint: 'snapshot',
  options:
    | { action: 'list' }
    | { action: 'download' | 'upload' | 'delete'; name: string }
    | { action: 'take' | 'use'; name: string; options?: string }
]

export type LookupTableEndpoint = [
  endpoint: 'lookupTable',
  options:
    | {
        action: 'import'
        name: string
      }
    | {
        action: 'export'
        id: number
      }
    | {
        action: 'update'
        id: number
      }
]

export type GetApplicationDataEndpoint = [
  endpoint: 'getApplicationData',
  options: { applicationId: number; reviewId?: number }
]

export type ComplexEndpoint =
  | LanguageEndpoint
  | VerifyEndpoint
  | FileEndpoint
  | UserPermissionsEndpoint
  | UploadEndpoint
  | CheckTriggersEndpoint
  | CheckUniqueEndpoint
  | DataViewEndpoint
  | EnableLanguageEndpoint
  | RemoveLanguageEndpoint
  | SnapshotEndpoint
  | LookupTableEndpoint
  | GetApplicationDataEndpoint
