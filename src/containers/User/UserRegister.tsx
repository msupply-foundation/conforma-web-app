import React from 'react'
import { useHistory } from 'react-router'
import isLoggedIn from '../../utils/helpers/loginCheck'
import { attemptLogin } from '../User/Login'

const UserRegister: React.FC = () => {
  let history = useHistory()
  if (isLoggedIn()) history.push('/')

  attemptLogin('nonRegistered', '').then((loginResult) => {
    localStorage.setItem('persistJWT', loginResult.JWT)
    history.push('/applications/new?type=UserRego1')
  })

  return <p>Re-directing to user registration application...</p>
}

export default UserRegister
