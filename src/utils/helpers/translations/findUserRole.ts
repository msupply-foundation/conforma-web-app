import { PermissionPolicyType } from '../../generated/graphql'
import { UserRoles } from '../../types'

/**
 * @function: findUserRole
 * Deduce the current user Role to interact with applications.
 * Each UserRole define different view options and actions the user have access in the UI.
 * - @param permissions - Array with group of permissions the user have for a template
 * - @returns UserRole deduced from group of permissions or undefined.
 */

const userRoles: UserRoles = {
  applicant: [PermissionPolicyType.Apply],
  reviewer1: [PermissionPolicyType.Review],
  reviewer2: [PermissionPolicyType.Review, PermissionPolicyType.Assign],
  supervisor: [PermissionPolicyType.Assign],
  consolidator: [PermissionPolicyType.Assign], //, PermissionPolicyType.Consolidate]
}

export default (permissions: Array<PermissionPolicyType>): string | undefined => {
  const comparePermissions = permissions.map((permissionType) => permissionType.toUpperCase())

  // Compare array of permission checking if are the same
  const matching = Object.entries(userRoles).filter(([role, permissionList]) => {
    console.log('role', role)

    const difference = permissionList.filter((x) => !comparePermissions.includes(x))
    return difference.length === 0
  })

  const filteredRoles = matching.map(([role, permissions]) => role)
  console.log('Possible user-roles:', filteredRoles)
  return filteredRoles.length > 0 ? filteredRoles[0] : undefined
}
