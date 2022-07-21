import { DataViewTableAPIQueries } from '../../types'

type BasicEndpoint = [
  endpoint: 'public' | 'prefs' | 'login' | 'loginOrg' | 'userInfo' | 'generatePDF'
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
    user_id?: number | null
    application_serial?: string
    application_response_id?: number
    unique_id?: string
    template_id?: string
    subfolder?: string
    description?: string | null
  }
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
