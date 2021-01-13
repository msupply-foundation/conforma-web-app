import { PermissionPolicyType } from '../../generated/graphql'

// TODO: Change to use type instead
interface UserRoles {
  [role: string]: Array<PermissionPolicyType>
}

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
  const matchingRoles = Object.keys(userRoles).filter((type) => {
    const difference = userRoles[type].filter((x) => !comparePermissions.includes(x))
    return difference.length === 0
  })
  console.log('Possible user-roles:', matchingRoles)
  return matchingRoles.length > 0 ? matchingRoles[0] : undefined
}
