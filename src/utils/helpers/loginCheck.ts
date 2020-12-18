const isLoggedIn = () => {
  const JWT = localStorage.getItem('persistJWT')
  return JWT !== null
}

export default isLoggedIn
