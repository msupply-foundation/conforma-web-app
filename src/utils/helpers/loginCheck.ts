const isLoggedIn = () => {
  const JWT = localStorage.getItem('persistJWT')
  const user = localStorage.getItem('user')
  return JWT && user
}

export default isLoggedIn
