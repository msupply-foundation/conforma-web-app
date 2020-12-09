import React, { useState } from 'react'
import { useRouter } from '../../utils/hooks/useRouter'
import isLoggedIn from '../../utils/helpers/loginCheck'
import { attemptLogin } from '../User/Login'

const UserRegister: React.FC = () => {
  const [networkError, setNetworkError] = useState('')
  const { push } = useRouter()
  if (isLoggedIn()) push('/')

  attemptLogin('nonRegistered', '')
    .then((loginResult) => {
      console.log('Result', loginResult)
      localStorage.setItem('persistJWT', loginResult.JWT)
      localStorage.setItem('username', loginResult.username)
      push('/application/new?type=UserRegistration')
    })
    .catch((err) => {
      setNetworkError(err.message)
    })

  if (networkError) return <p>{networkError}</p>
  else return <p>Re-directing to user registration application...</p>
}

export default UserRegister
