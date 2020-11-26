const isLoggedIn = () => {
  // const username = localStorage.getItem('username')
  // const templatePermissions = localStorage.getItem('templatePermissions')
  const JWT = localStorage.getItem('persistJWT')
  console.log('Logged in?', JWT !== null, JWT)
  return JWT !== null
}

export default isLoggedIn
