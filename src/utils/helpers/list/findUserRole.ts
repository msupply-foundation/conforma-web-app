import { USER_ROLES } from '../../data'
import { PermissionPolicyType } from '../../generated/graphql'
import { TemplatePermissions } from '../../types'

/**
 * @function: findUserRole
 * Deduce the current user Role to interact with applications.
 * Each UserRole define different view options and actions the user have access in the UI.
 * - @param permissions - Array with group of permissions the user have for a template
 * - @returns UserRole deduced from group of permissions or undefined.
 */

const getPermissionsForType = (templatePermissions: TemplatePermissions, type: string) => {
  const permissions = templatePermissions?.[type] || []
  return permissions
}

const isReviewPermission = (permissions: PermissionPolicyType[]) =>
  permissions.includes(PermissionPolicyType.Review) ||
  permissions.includes(PermissionPolicyType.Assign) ||
  permissions.includes(PermissionPolicyType.View)

const findUserRole = (
  templatePermissions: TemplatePermissions,
  type: string,
  isInternalUser: boolean
): string | undefined => {
  const permissions = getPermissionsForType(templatePermissions, type)
  if (isInternalUser && permissions.includes(PermissionPolicyType.Apply)) {
    return USER_ROLES.INTERNAL_APPLICANT
  }
  if (isReviewPermission(permissions)) {
    return USER_ROLES.REVIEWER
  }

  return USER_ROLES.APPLICANT
}

const checkExistingUserRole = (
  templatePermissions: TemplatePermissions,
  type: string,
  userRole: string,
  isInternalUser: boolean
) => {
  const list = Object.values(USER_ROLES)
  if (!list.includes(userRole as USER_ROLES)) return false

  const permissions = getPermissionsForType(templatePermissions, type)

  if (userRole === USER_ROLES.INTERNAL_APPLICANT) {
    return permissions.includes(PermissionPolicyType.Apply) && isInternalUser
  }

  if (userRole === USER_ROLES.APPLICANT) {
    return permissions.includes(PermissionPolicyType.Apply)
  }

  if (userRole === USER_ROLES.REVIEWER) {
    return isReviewPermission(permissions)
  }

  return false
}

export { findUserRole, checkExistingUserRole }
