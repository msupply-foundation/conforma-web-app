import { DataViewTableAPIQueries } from '../../types'

type BasicEndpoint = [
  // These ones don't take any query parameters
  endpoint:
    | 'public'
    | 'prefs'
    | 'login'
    | 'loginOrg'
    | 'userInfo'
    | 'generatePDF'
    | 'admin'
    | 'installLanguage'
    | 'allLanguages'
]

type LanguageEndpoint = [endpoint: 'language', languageCode: string]

type VerifyEndpoint = [endpoint: 'verify', uid: string]

type FileEndpoint = [endpoint: 'file', fileId: string, isThumbnail?: 'thumbnail']

type UserPermissionsEndpoint = [
  endpoint: 'userPermissions',
  parameters: { username?: string; orgId?: number | null }
]

type CheckTriggersEndpoint = [endpoint: 'checkTrigger', serial: string]

type CheckUniqueEndpoint = [
  endpoint: 'checkUnique',
  parameters: {
    type?: 'username' | 'email' | 'organisation'
    value: string
    table?: string
    field?: string
  }
]

type DataViewEndpoint = [
  endpoint: 'dataViews',
  tableName?: string,
  itemIdOrQuery?: number | DataViewTableAPIQueries
]

type UploadEndpoint = [
  endpoint: 'upload',
  parameters?: {
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

type EnableLanguageEndpoint = [endpoint: 'enableLanguage', languageCode: string, enabled?: boolean]

type RemoveLanguageEndpoint = [endpoint: 'removeLanguage', languageCode: string]

type SnapshotEndpoint = [
  endpoint: 'snapshot',
  action: 'list' | 'take' | 'use' | 'upload' | 'delete' | 'download',
  name?: string,
  options?: string
]

type LookupTableEndpoint = [
  endpoint: 'lookupTable',
  action: 'import' | 'export',
  lookupTableId?: number
]

export type RestEndpoints =
  | BasicEndpoint
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
