import config from '../../config'

const isLoggedIn = () => {
  const JWT = localStorage.getItem(config.localStorageJWTKey)
  if (JWT == undefined) return false
  return JWT !== null
}

export default isLoggedIn
