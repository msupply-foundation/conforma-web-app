const isLoggedIn = () => {
  const username = localStorage.getItem('username')
  const templatePermissions = localStorage.getItem('templatePermissions')
  const JWT = localStorage.getItem('JWT')
  return username && templatePermissions && JWT
}

export default isLoggedIn
