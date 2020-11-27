import { logOut } from '../../containers/User/Login'

const isLoggedIn = () => {
  const JWT = localStorage.getItem('persistJWT')
  const username = localStorage.getItem('username')
  return JWT && username
}

export default isLoggedIn
