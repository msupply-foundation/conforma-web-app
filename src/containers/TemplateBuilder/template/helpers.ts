import { customAlphabet } from 'nanoid/non-secure'
import { VersionObject } from '../useGetTemplates'

// Use nanoid to generate unique template version IDs
export const getTemplateVersionId = customAlphabet('abcdefghijklmnopqrstuvwxyz1234567890', 6)

// If versionId starts with "*" char, then it can be modified
export const isTemplateUnlocked = (template: { versionId: string }) =>
  template.versionId.startsWith('*')

/**
 * Formats template version for UI display:
 *    <versionId> (v<number>)
 *    e.g. ba39d9 (v4)
 *
 * If "unlocked" (versionId starts with '*):
 *    <parentVersionId>* (v<number>)
 *    e.g. hkgx51* (v6)
 */
export const getVersionString = (
  template: {
    versionId: string
    parentVersionId: string | null
    versionHistory: VersionObject[]
  },
  showNumber = true
) => {
  const { versionId, parentVersionId, versionHistory } = template
  return `${versionId.startsWith('*') ? (parentVersionId || 'NEW') + '*' : versionId}${
    showNumber ? ` (v${versionHistory.length + 1})` : ''
  }`
}
