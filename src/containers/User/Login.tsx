import React, { useState } from 'react'
import { useRouter } from '../../utils/hooks/useRouter'
import { useUserState } from '../../contexts/UserState'
import { Link } from 'react-router-dom'
import { Form, Button, Container, Grid, Segment, Header } from 'semantic-ui-react'
import config from '../../config.json'
import isLoggedIn from '../../utils/helpers/loginCheck'
import strings from '../../utils/constants'
import setUserInfo from '../../utils/helpers/fetchUserInfo'

const Login: React.FC = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [isError, setIsError] = useState(false)
  const { push, history } = useRouter()
  const { login } = useUserState()

  const handleSubmit = async (event: any) => {
    event.preventDefault()
    const loginResult = await attemptLogin(username, password)
    if (!loginResult.success) setIsError(true)
    else {
      setIsError(false)
      login(loginResult.JWT)
      if (history.location?.state?.from) push(history.location.state.from)
      else push('/')
    }
  }

  if (isLoggedIn()) push('/')

  return (
    <Container text style={{ height: '100vh' }}>
      <Grid container columns="1" centered verticalAlign="middle" style={{ height: '100%' }}>
        <Grid.Column>
          <Segment>
            <Header size="huge">{strings.LABEL_WELCOME}</Header>
            <Form>
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
              <Container>
                <Button type="submit" onClick={handleSubmit}>
                  {strings.LABEL_LOG_IN}
                </Button>
                <Link to="/register">{strings.LINK_LOGIN_USER}</Link>
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

export async function attemptLogin(username: string, password: string) {
  try {
    const response = await fetch(config.serverREST + '/login', {
      method: 'POST',
      cache: 'no-cache',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    })
    return response.json()
  } catch (err) {
    throw err
  }
}
