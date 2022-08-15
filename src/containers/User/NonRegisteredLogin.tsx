import React, { useState, useEffect } from 'react'
import { useRouter } from '../../utils/hooks/useRouter'
import isLoggedIn from '../../utils/helpers/loginCheck'
import { attemptLogin } from '../../utils/helpers/attemptLogin'
import { useUserState } from '../../contexts/UserState'
import { useLanguageProvider } from '../../contexts/Localisation'
import { LoginPayload } from '../../utils/types'
import config from '../../config'

interface NonRegisteredLoginProps {
  option: 'register' | 'reset-password' | 'redirect'
  redirect?: string
}

const NonRegisteredLogin: React.FC<NonRegisteredLoginProps> = ({ option, redirect }) => {
  const { strings } = useLanguageProvider()

  const [networkError, setNetworkError] = useState('')
  const { push, query } = useRouter()
  const { onLogin } = useUserState()

  // useEffect ensures isLoggedIn only runs on first mount, not re-renders
  useEffect(() => {
    // Don't let a logged in user go to register page, but they can go to
    // "reset-password"
    if (option === 'reset-password') return
    if (isLoggedIn()) push('/')
  }, [])

  useEffect(() => {
    // Log in as 'nonRegistered' user to be able to apply for User Registration
    // form or reset password

    attemptLogin({
      username: config.nonRegisteredUser,
      password: '',
      sessionId: (query.sessionId as string) ?? undefined,
      onLoginSuccess,
    }).catch((error) => {
      setNetworkError(error.message)
    })
  }, [])

  const onLoginSuccess = async (loginResult: LoginPayload) => {
    const { JWT, user, templatePermissions, permissionNames, orgList, isAdmin } = loginResult
    await onLogin(JWT, user, templatePermissions, permissionNames, orgList, isAdmin)
    if (option === 'register') push('/application/new?type=UserRegistration')
    else if (option === 'reset-password') push('/application/new?type=PasswordReset')
    else if (option === 'redirect' && redirect) push(redirect)
  }

  if (networkError) return <p>{networkError}</p>
  else return <p>{strings.LOGIN_REDIRECT_TO_REGISTRATION}</p>
}

export default NonRegisteredLogin
