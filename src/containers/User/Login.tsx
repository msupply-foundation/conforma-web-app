import React, { useState } from 'react'
import { useRouter } from '../../utils/hooks/useRouter'
import { Link } from 'react-router-dom'
import { Form, Button, Container, Grid, Segment, Header } from 'semantic-ui-react'
import config from '../../config.json'
import isLoggedIn from '../../utils/helpers/loginCheck'
import strings from '../../utils/constants'

const Login: React.FC = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [isError, setIsError] = useState(false)
  const { push, history } = useRouter()

  const handleSubmit = async (event: any) => {
    event.preventDefault()
    const passwordHash = hashPassword(password)
    const loginResult = await attemptLogin(username, passwordHash)
    if (!loginResult.success) setIsError(true)
    else {
      setIsError(false)
      localStorage.setItem('persistJWT', loginResult.JWT)
      localStorage.setItem('user', JSON.stringify(loginResult.user))
      console.log('Log in successful!')
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
                  Log In
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

function hashPassword(password: string) {
  // TO-DO Implement password hashing
  return password
}

export async function attemptLogin(username: string, passwordHash: string) {
  try {
    const response = await fetch(config.serverREST + '/login', {
      method: 'POST',
      cache: 'no-cache',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, passwordHash }),
    })
    return response.json()
  } catch (err) {
    throw err
  }
}

export const logOut = () => {
  localStorage.clear()
  window.location.replace('/')
}
