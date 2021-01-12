import React, { useState } from 'react'
import { useRouter } from '../../utils/hooks/useRouter'
import isLoggedIn from '../../utils/helpers/loginCheck'
import { attemptLogin } from '../User/Login'
import { useUserState } from '../../contexts/UserState'
import messages from '../../utils/messages'
import strings from '../../utils/constants'

const UserRegister: React.FC = () => {
  const [networkError, setNetworkError] = useState('')
  const { push } = useRouter()
  const { onLogin } = useUserState()

  if (isLoggedIn()) push('/')

  attemptLogin(strings.USER_NONREGISTERED, '')
    .then((loginResult) => {
      onLogin(loginResult.JWT)
      push('/application/new?type=UserRegistration')
    })
    .catch((err) => {
      setNetworkError(err.message)
    })

  if (networkError) return <p>{networkError}</p>
  else return <p>{messages.REDIRECT_TO_REGISTRATION}</p>
}

export default UserRegister
