import { USER_ROLES } from '../../data'

export default (userRole: string) => {
  const list = Object.values(USER_ROLES)
  return list.includes(userRole as USER_ROLES)
}
