import React, { SyntheticEvent, useState, useEffect } from 'react'
import { useRouter } from '../../utils/hooks/useRouter'
import { useApolloClient } from '@apollo/client'
import { useUserState } from '../../contexts/UserState'
import { Link } from 'react-router-dom'
import { Form, Button, Container, Icon, Image, Header, List, Dropdown } from 'semantic-ui-react'
import isLoggedIn from '../../utils/helpers/loginCheck'
import { useLanguageProvider } from '../../contexts/Localisation'
import { usePrefs } from '../../contexts/SystemPrefs'
import { attemptLogin, attemptLoginOrg } from '../../utils/helpers/attemptLogin'
import getServerUrl from '../../utils/helpers/endpoints/endpointUrlBuilder'
import { LoginPayload, OrganisationSimple } from '../../utils/types'

const defaultLogo = require('../../../images/logos/conforma_logo_wide_1024.png').default
import config from '../../config'

const LOGIN_AS_NO_ORG = 0
const NO_ORG_SELECTED = -1

const Login: React.FC = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [isError, setIsError] = useState(false)
  const [networkError, setNetworkError] = useState('')
  const [loginPayload, setLoginPayload] = useState<LoginPayload>()
  const [selectedOrgId, setSelectedOrgId] = useState<number>(NO_ORG_SELECTED)
  const { push, history } = useRouter()
  const { onLogin } = useUserState()
  const client = useApolloClient()
  const { strings, languageOptions } = useLanguageProvider()
  const { preferences } = usePrefs()

  const noOrgOption: OrganisationSimple = {
    orgId: LOGIN_AS_NO_ORG,
    orgName: strings.LABEL_NO_ORG_OPTION ?? '',
    userRole: null,
    isSystemOrg: false,
  }

  // useEffect ensures isLoggedIn only runs on first mount, not re-renders
  useEffect(() => {
    if (isLoggedIn()) push('/')
    client.clearStore()
  }, [])

  const onLoginSuccess = (loginResult: LoginPayload) => {
    localStorage.setItem(config.localStorageJWTKey, loginResult.JWT)
    setIsError(false)
    setLoginPayload({
      ...loginResult,
    })
  }

  const handleSubmit = async () => {
    if (!loginPayload) {
      // User login
      attemptLogin({
        username,
        password,
        onLoginSuccess,
        onLoginFailure: () => setIsError(true),
      }).catch((error) => {
        setNetworkError(error.message)
      })
    }
  }

  const finishLogin = async (loginPayload: LoginPayload) => {
    const { JWT, user, templatePermissions, orgList, isAdmin } = loginPayload
    await onLogin(JWT, user, templatePermissions, orgList, isAdmin)
    if (history.location?.state?.from) push(history.location.state.from)
    else push('/')
  }

  useEffect(() => {
    if (loginPayload?.orgList?.length === 0) {
      // No orgs, so skip org login
      finishLogin(loginPayload)
      return
    }
    if (loginPayload?.orgList?.length === 1) {
      // Only one org, so select it by default
      setSelectedOrgId(loginPayload.orgList[0].orgId)
    }
  }, [loginPayload])

  useEffect(() => {
    // Organisation login
    if (!loginPayload) return
    const orgId = selectedOrgId
    if (orgId === 0) {
      // Log in without organisation
      finishLogin(loginPayload)
      return
    }
    attemptLoginOrg({
      orgId,
      onLoginOrgSuccess: (loginOrgResult: LoginPayload) => {
        finishLogin(loginOrgResult)
      },
    }).catch((error) => {
      setNetworkError(error.message)
    })
  }, [selectedOrgId])

  const logoUrl = preferences?.brandLogoFileId
    ? getServerUrl('file', { fileId: preferences?.brandLogoFileId })
    : defaultLogo

  return (
    <Container id="login-container">
      {languageOptions.length > 1 && <LanguageSelector />}
      <div id="login-box">
        <div className="flex-column-center">
          <Image src={logoUrl} className="image-icon" />
          <Header as="h3" className="login-header">
            {strings.TITLE_LOGIN_HEADER}
          </Header>
        </div>
        <Header as="h2" className="centered header-space-around-medium">
          {loginPayload && selectedOrgId === NO_ORG_SELECTED
            ? strings.LOGIN_WELCOME.replace('%1', loginPayload.user.firstName)
            : strings.TITLE_LOGIN}
        </Header>
        <Form>
          {isError && (
            <p className="alert">
              <Icon name="attention" />
              {strings.ERROR_LOGIN_PASSWORD}
            </p>
          )}
          {networkError && (
            <p className="alert">
              <Icon name="attention" />
              {networkError}
            </p>
          )}
          {!loginPayload && (
            <>
              <Form.Field error={isError} className="form-extra-spacing">
                <label>{strings.LABEL_LOGIN_USERNAME}</label>
                <input
                  placeholder={strings.LABEL_LOGIN_USERNAME}
                  name="username"
                  type="text"
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                />
              </Form.Field>
              <Form.Field error={isError}>
                <label>{strings.LABEL_LOGIN_PASSWORD}</label>
                <input
                  placeholder={strings.LABEL_LOGIN_PASSWORD}
                  name="password"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                />
              </Form.Field>
              <Button id="login-button" primary fluid type="submit" onClick={handleSubmit}>
                {strings.LABEL_LOG_IN}
              </Button>
              <p className="center-text">
                <strong>
                  <Link to="/register">{strings.LINK_NEW_ACCOUNT}</Link>
                </strong>
                <br />
                <span className="smaller-text">
                  <Link to="/reset-password">{strings.LINK_RESET_PASSWORD}</Link>
                </span>
              </p>
            </>
          )}
          {loginPayload?.orgList && loginPayload?.orgList?.length > 1 && (
            <>
              <p>
                <strong>{strings.LOGIN_ORG_SELECT}</strong>
              </p>
              <List
                celled
                relaxed="very"
                className="no-bottom-border"
                items={[...loginPayload?.orgList, noOrgOption].map((org: OrganisationSimple) => ({
                  key: `list-item-${org.orgId}`,
                  content: (
                    <div
                      className="section-single-row-box-container clickable"
                      onClick={() => setSelectedOrgId(org.orgId)}
                    >
                      <div className="centered-flex-box-row flex-grow-1">
                        <span style={{ fontStyle: org.orgId === LOGIN_AS_NO_ORG ? 'italic' : '' }}>
                          {org.orgName}
                        </span>
                      </div>
                      <Icon name="chevron right" />
                    </div>
                  ),
                }))}
              />
            </>
          )}
        </Form>
      </div>
    </Container>
  )
}

const LanguageSelector: React.FC = () => {
  const { languageOptions, selectedLanguage, setLanguage } = useLanguageProvider()
  if (!selectedLanguage) return null

  const dropdownOptions = languageOptions.map((opt, index) => ({
    key: opt.code,
    text: `${opt.flag} ${opt.languageName}`,
    value: index,
  }))

  const handleLanguageChange = async (_: SyntheticEvent, { value }: any) => {
    setLanguage(languageOptions[value].code)
  }

  return (
    <div className="top-right-corner">
      <Dropdown
        text={`${selectedLanguage.flag} ${selectedLanguage.languageName}
      `}
        options={dropdownOptions}
        onChange={handleLanguageChange}
        direction="left"
        value={languageOptions.findIndex((lang) => lang.code === selectedLanguage.code)}
      />
    </div>
  )
}

export default Login
