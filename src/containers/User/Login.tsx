import React, { useState, useEffect } from 'react'
import { useRouter } from '../../utils/hooks/useRouter'
import { useUserState } from '../../contexts/UserState'
import { Link } from 'react-router-dom'
import { Form, Button, Container, Grid, Segment, Header, Dropdown } from 'semantic-ui-react'
import config from '../../config.json'
import isLoggedIn from '../../utils/helpers/loginCheck'
import strings from '../../utils/constants'
import { postRequest as attemptLogin } from '../../utils/helpers/fetchMethods'
import { User, LoginPayload, OrganisationSimple, TemplatePermissions } from '../../utils/types'

const loginURL = config.serverREST + '/login'
const loginOrgURL = config.serverREST + '/login-org'

const Login: React.FC = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [isError, setIsError] = useState(false)
  const [user, setUser] = useState<User>()
  const [orgList, setOrgList] = useState<OrganisationSimple[]>([])
  const [JWT, setJWT] = useState<string>()
  const [templatePermissions, setTemplatePermissions] = useState<TemplatePermissions>()
  const [selectedOrgIndex, setSelectedOrgIndex] = useState(0)
  const { push, history } = useRouter()
  const { onLogin } = useUserState()

  const handleSubmit = async () => {
    if (!user) {
      // User login
      const loginResult: LoginPayload = await attemptLogin({ username, password }, loginURL)

      console.log('loginResult', loginResult)
      if (!loginResult.success) setIsError(true)
      else {
        setIsError(false)
        setUser(loginResult.user)
        setJWT(loginResult.JWT)
        setTemplatePermissions(loginResult.templatePermissions)
        setOrgList(loginResult?.orgList as OrganisationSimple[])
      }
    } else {
      // Organisation login
      const { userId } = user as User
      const { orgId } = orgList[selectedOrgIndex] as OrganisationSimple
      const authHeader = { Authorization: 'Bearer ' + JWT }
      const verifyOrgResult = await attemptLogin({ userId, orgId }, loginOrgURL, authHeader)

      console.log('verifyOrgResult', verifyOrgResult)
      if (verifyOrgResult.success) {
        finishLogin(verifyOrgResult)
      }
    }
  }

  const finishLogin = async (loginPayload: LoginPayload) => {
    const { JWT, user, templatePermissions } = loginPayload
    await onLogin(JWT, user, templatePermissions)
    if (history.location?.state?.from) push(history.location.state.from)
    else push('/')
  }

  useEffect(() => {
    if (orgList.length === 0) {
      // No orgs, so skip org login
      JWT && user && templatePermissions && finishLogin({ JWT, user, templatePermissions })
      return
    }
    if (orgList.length === 1) {
      // Auto-login with only one organisation
      handleSubmit()
    }
  }, [orgList])

  if (isLoggedIn()) push('/')

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
              {!user && (
                <>
                  <Form.Field>
                    <label>{strings.LABEL_LOGIN_USERNAME}</label>
                    <input
                      placeholder="Username"
                      name="username"
                      type="text"
                      value={username}
                      onChange={(event) => setUsername(event.target.value)}
                    />
                  </Form.Field>
                  <Form.Field>
                    <label>{strings.LABEL_LOGIN_PASSWORD}</label>
                    <input
                      placeholder="Password"
                      name="password"
                      type="password"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                    />
                  </Form.Field>
                </>
              )}
              {user && (
                // To-Do: Add to Messages
                <p>{`Welcome back, ${user.firstName}. Please select your organisation.`}</p>
              )}
              {user && (
                <Dropdown
                  selection
                  options={orgList.map((org: any, index) => ({
                    key: `org_${org.orgId}`,
                    text: `${org.orgName} ${org?.orgRole ? `(${org.orgRole})` : ''}`,
                    value: index,
                  }))}
                  defaultValue={0}
                  onChange={handleSelection}
                />
              )}
              <Container>
                {!user && <Link to="/register">{strings.LINK_LOGIN_USER}</Link>}
                <Button floated="right" type="submit" onClick={handleSubmit}>
                  {!user ? strings.LABEL_LOG_IN : 'Proceed'}
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
