import React, { useState } from 'react'
import { useRouter } from '../../utils/hooks/useRouter'
import isLoggedIn from '../../utils/helpers/loginCheck'
import { attemptLogin } from '../User/Login'
import { useUserState } from '../../contexts/UserState'
import setUserInfo from '../../utils/helpers/setUserInfo'
import messages from '../../utils/messages'

const UserRegister: React.FC = () => {
  const [networkError, setNetworkError] = useState('')
  const { push } = useRouter()
  const { setUserState } = useUserState()

  if (isLoggedIn()) push('/')

  attemptLogin('nonRegistered', '')
    .then((loginResult) => {
      console.log('Result', loginResult)
      localStorage.setItem('persistJWT', loginResult.JWT)
      setUserInfo({ dispatch: setUserState })
      push('/application/new?type=UserRegistration')
    })
    .catch((err) => {
      setNetworkError(err.message)
    })

  if (networkError) return <p>{networkError}</p>
  else return <p>{messages.REDIRECT_TO_REGISTRATION}</p>
}

export default UserRegister
