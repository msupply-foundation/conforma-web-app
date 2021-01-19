import React, { useState, useEffect } from 'react'
import { useRouter } from '../../utils/hooks/useRouter'
import { useUserState } from '../../contexts/UserState'
import { Link } from 'react-router-dom'
import { Form, Button, Container, Grid, Segment, Header, Dropdown } from 'semantic-ui-react'
import config from '../../config.json'
import isLoggedIn from '../../utils/helpers/loginCheck'
import strings from '../../utils/constants'
import messages from '../../utils/messages'
import { attemptLogin, attemptLoginOrg } from '../../utils/helpers/attemptLogin'
import { LoginPayload, OrganisationSimple } from '../../utils/types'

const loginURL = config.serverREST + '/login'
const loginOrgURL = config.serverREST + '/login-org'

const Login: React.FC = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [isError, setIsError] = useState(false)
  const [loginPayload, setLoginPayload] = useState<LoginPayload>()
  const [selectedOrgIndex, setSelectedOrgIndex] = useState(0)
  const { push, history } = useRouter()
  const { onLogin } = useUserState()

  // useEffect ensures isLoggedIn only runs on first mount, not re-renders
  useEffect(() => {
    if (isLoggedIn()) push('/')
  }, [])

  const onLoginSuccess = (loginResult: LoginPayload) => {
    setIsError(false)
    setLoginPayload({
      ...loginResult,
    })
  }

  const handleSubmit = async () => {
    if (!loginPayload) {
      // User login
      await attemptLogin({
        username,
        password,
        onLoginSuccess,
        onLoginFailure: () => setIsError(true),
      })
    } else {
      // Organisation login
      const { orgId } = loginPayload?.orgList?.[selectedOrgIndex] as OrganisationSimple
      attemptLoginOrg({
        orgId,
        JWT: loginPayload.JWT,
        onLoginOrgSuccess: (loginOrgResult: LoginPayload) => {
          finishLogin(loginOrgResult)
        },
      })
    }
  }

  const finishLogin = async (loginPayload: LoginPayload) => {
    const { JWT, user, templatePermissions } = loginPayload
    await onLogin(JWT, user, templatePermissions)
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
      // Auto-login with only one organisation
      handleSubmit()
    }
  }, [loginPayload])

  const handleSelection = (e: any, data: any) => {
    const { value } = data
    setSelectedOrgIndex(value)
  }

  return (
    <Container text style={{ height: '100vh' }}>
      <Grid container columns="1" centered verticalAlign="middle" style={{ height: '100%' }}>
        <Grid.Column width={14} style={{ padding: 10 }}>
          <Segment clearing>
            <Header size="huge">{strings.LABEL_WELCOME}</Header>
            <Form>
              {!loginPayload && (
                <>
                  <Form.Field>
                    <label>{strings.LABEL_LOGIN_USERNAME}</label>
                    <input
                      placeholder={strings.LABEL_LOGIN_USERNAME}
                      name="username"
                      type="text"
                      value={username}
                      onChange={(event) => setUsername(event.target.value)}
                    />
                  </Form.Field>
                  <Form.Field>
                    <label>{strings.LABEL_LOGIN_PASSWORD}</label>
                    <input
                      placeholder={strings.LABEL_LOGIN_PASSWORD}
                      name="password"
                      type="password"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                    />
                  </Form.Field>
                </>
              )}
              {loginPayload && (
                <p>
                  {messages.LOGIN_WELCOME_SELECT_ORG.replace('%1', loginPayload.user.firstName)}
                </p>
              )}
              {loginPayload && (
                <Dropdown
                  selection
                  options={loginPayload?.orgList?.map((org: OrganisationSimple, index) => ({
                    key: `org_${org.orgId}`,
                    text: `${org.orgName} ${org?.userRole ? `(${org.userRole})` : ''}`,
                    value: index,
                  }))}
                  defaultValue={0}
                  onChange={handleSelection}
                />
              )}
              <Container>
                {!loginPayload && <Link to="/register">{strings.LINK_LOGIN_USER}</Link>}
                <Button floated="right" type="submit" onClick={handleSubmit}>
                  {!loginPayload ? strings.LABEL_LOG_IN : strings.LABEL_PROCEED}
                </Button>
              </Container>
              {isError && <p>{strings.ERROR_LOGIN_PASSWORD}</p>}
            </Form>
          </Segment>
        </Grid.Column>
      </Grid>
    </Container>
  )
}

export default Login
