import React, { useState } from 'react'
import { useHistory } from 'react-router'
import { Form, Button, Container, Grid, Segment, Header } from 'semantic-ui-react'
import config from '../../src/config.json'

const Login: React.FC = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [isError, setIsError] = useState(false)
  const history = useHistory()

  const handleSubmit = async (event: any) => {
    event.preventDefault()
    const passwordHash = hashPassword(password)
    const loginResult = await attemptLogin(username, passwordHash)
    if (!loginResult.success) setIsError(true)
    else {
      setIsError(false)
      localStorage.setItem('username', username)
      localStorage.setItem('templatePermissions', loginResult.templatePermissions)
      localStorage.setItem('JWT', loginResult.JWT)
      console.log('Log in successful!')
      history.push('/') // TO-DO: re-route to previous URL
    }
  }

  return (
    <Container text style={{ height: '100vh' }}>
      <Grid container columns="1" centered verticalAlign="middle" style={{ height: '100%' }}>
        <Grid.Column>
          <Segment>
            <Header size="huge">Welcome to IRIMS Application Manager</Header>
            <Form>
              <Form.Field>
                <label>Username</label>
                <input
                  placeholder="Username"
                  name="username"
                  type="text"
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                />
              </Form.Field>
              <Form.Field>
                <label>Password</label>
                <input
                  placeholder="Password"
                  name="password"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                />
              </Form.Field>
              <Button type="submit" onClick={handleSubmit}>
                Log In
              </Button>
              {isError && <p>Oops! Problem with username or password</p>}
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

async function attemptLogin(username: string, passwordHash: string) {
  const response = await fetch(config.serverREST + '/login', {
    method: 'POST',
    // mode: 'cors',
    cache: 'no-cache',
    // credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
    },
    redirect: 'follow', // manual, *follow, error
    referrerPolicy: 'no-referrer',
    body: JSON.stringify({ username, passwordHash }), // body data type must match "Content-Type" header
  })
  return response.json() // parses JSON response into native JavaScript objects
}
