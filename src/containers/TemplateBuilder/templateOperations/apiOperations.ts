/**
 * The raw http operations called b the Template Operations hook
 */

import getServerUrl from '../../../utils/helpers/endpoints/endpointUrlBuilder'
import { getRequest, postRequest } from '../../../utils/helpers/fetchMethods'
import { downloadFile } from '../../../utils/helpers/utilityFunctions'
import { TemplateState } from '../template/TemplateWrapper'
import { Template, VersionObject } from '../useGetTemplates'
import config from '../../../config'
import { ModifiedEntities } from './EntitySelectModal'

export const commit = async (id: number, comment: string) => {
  try {
    const { versionId } = await postRequest({
      url: getServerUrl('templateImportExport', { action: 'commit', id }),
      jsonBody: { comment },
      headers: { 'Content-Type': 'application/json' },
    })
    return { versionId }
  } catch (err) {
    return { error: (err as Error).message }
  }
}

export interface UnconnectedDataViews {
  id: number
  code: string
  identifier: string
  title: string
}

export interface Diff {
  filters: {}
  permissions: {}
  dataViews: {}
  dataViewColumns: {}
  category: {}
  dataTables: {}
}

interface CheckResult {
  committed: boolean
  unconnectedDataViews: UnconnectedDataViews[]
  ready?: boolean
  diff?: Diff
}

export const check = async (id: number) => {
  try {
    const result: CheckResult = await getRequest(
      getServerUrl('templateImportExport', { action: 'export', id, type: 'check' })
    )
    return result
  } catch (err) {
    return { error: (err as Error).message }
  }
}

export const duplicate = async (id: number, code?: string) => {
  try {
    const newId = await postRequest({
      url: getServerUrl('templateImportExport', {
        action: 'duplicate',
        id,
        type: code ? 'new' : 'version',
      }),
      jsonBody: { code },
      headers: { 'Content-Type': 'application/json' },
    })
    return { newId }
  } catch (err) {
    return { error: (err as Error).message }
  }
}

export const exportAndDownload = async (
  id: number,
  code: string,
  versionId: string,
  versionHistory: VersionObject[]
) => {
  const JWT = localStorage.getItem(config.localStorageJWTKey)
  const filename = `${code}-${versionId}_v${versionHistory.length + 1}.zip`
  try {
    await downloadFile(
      getServerUrl('templateImportExport', {
        action: 'export',
        id,
        type: 'dump',
      }),
      filename,
      {
        headers: { Authorization: `Bearer ${JWT}` },
      }
    )
  } catch (err) {
    return { error: (err as Error).message }
  }
}

export const upload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  if (!e.target?.files) return { error: 'No file selected' }
  const file = e.target.files[0]
  try {
    const data = new FormData()
    data.append('file', file)

    const result: { uid: string; modifiedEntities: ModifiedEntities; ready: boolean } =
      await postRequest({
        url: getServerUrl('templateImportExport', { action: 'import', type: 'upload' }),
        otherBody: data,
      })
    return result
  } catch (err) {
    return { error: (err as Error).message }
  }
}

export type PreserveExistingEntities = {
  filters: string[]
  permissions: string[]
  dataViews: string[]
  dataViewColumns: string[]
  dataTables: string[]
  category: string | null
  files: string[]
}

export const install = async (uid: string, installDetails: PreserveExistingEntities) => {
  try {
    const result = await postRequest({
      url: getServerUrl('templateImportExport', {
        action: 'import',
        uid,
        type: 'install',
      }),
      jsonBody: installDetails,
      headers: { 'Content-Type': 'application/json' },
    })
    return result
  } catch (err) {
    return { error: (err as Error).message }
  }
}