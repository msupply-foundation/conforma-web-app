import React, { useState, useEffect } from 'react'
import { useRouter } from '../../utils/hooks/useRouter'
import isLoggedIn from '../../utils/helpers/loginCheck'
import config from '../../config.json'
import { postRequest as attemptLogin } from '../../utils/helpers/fetchMethods'
import { useUserState } from '../../contexts/UserState'
import messages from '../../utils/messages'
import strings from '../../utils/constants'

const UserRegister: React.FC = () => {
  const [networkError, setNetworkError] = useState('')
  const { push } = useRouter()
  const { onLogin } = useUserState()

  // useEffect ensures isLoggedIn only runs on first mount, not re-renders
  useEffect(() => {
    if (isLoggedIn()) push('/')
  }, [])

  useEffect(() => {
    // Log in as 'nonRegistered' user to be able to apply for User Registration form
    attemptLogin(
      { username: strings.USER_NONREGISTERED, password: '' },
      config.serverREST + '/login'
    )
      .then((loginResult) => {
        console.log('loginResult', loginResult)
        const { JWT, user, templatePermissions } = loginResult
        onLogin(JWT, user, templatePermissions)
      })
      .then(() => {
        console.log('Trying to load new URL')
        push('/application/new?type=UserRegistration')
      })
      .catch((err) => {
        setNetworkError(err.message)
      })
  }, [])

  if (networkError) return <p>{networkError}</p>
  else return <p>{messages.REDIRECT_TO_REGISTRATION}</p>
}

export default UserRegister
