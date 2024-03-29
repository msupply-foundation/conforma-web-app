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
    | 'getAllPrefs'
    | 'setPrefs'
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
  ) & { value: string; caseInsensitive?: boolean }
]

export type DataViewEndpoint = [
  endpoint: 'dataViews',
  options?:
    | { dataViewCode: string; query?: DataViewTableAPIQueries }
    | { dataViewCode: string; itemId: number }
    | { dataViewCode: string; column: string }
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
    | { action: 'list'; archive?: boolean }
    | { action: 'download' | 'delete'; name: string; archive?: boolean }
    | { action: 'upload'; template?: boolean }
    | { action: 'take' | 'use'; name: string; options?: string; archive?: boolean }
]

export type ArchiveEndpoint = [endpoint: 'archiveFiles', options: { days: number }]

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
  | ArchiveEndpoint
  | LookupTableEndpoint
  | GetApplicationDataEndpoint
