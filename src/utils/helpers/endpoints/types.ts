import { DataViewTableAPIQueries } from '../../types'

type BasicEndpoint = [endpoint: 'public' | 'prefs' | 'login' | 'loginOrg']

type FileEndpoint = [endpoint: 'file', fileId: string, isThumbnail?: 'thumbnail']

type DataViewEndpoint = [
  endpoint: 'dataViews',
  tableName?: string,
  itemIdOrQuery?: number | DataViewTableAPIQueries
]

type UploadEndpoint = [
  endpoint: 'upload',
  options?: {
    user_id?: number | null
    application_serial?: string
    application_response_id?: number
    unique_id?: string
    template_id?: string
    subfolder?: string
    description?: string | null
  }
]

export type RestEndpoints = BasicEndpoint | FileEndpoint | UploadEndpoint | DataViewEndpoint
