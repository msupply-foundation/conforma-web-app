import React, { useEffect, useState } from 'react'
import { Button, Grid, Icon, Message, Popup } from 'semantic-ui-react'
import { Loading } from '../../components'
import { hashPassword, attemptLogin } from './Login'
import { useGetUsersQuery } from '../../utils/generated/graphql'
import { useRouter } from '../../utils/hooks/useRouter'
import { User } from '../../utils/types'

const hardcodedPassword = '123456'

const UserSelection: React.FC = () => {
  const { history, push } = useRouter()
  const [users, setUsers] = useState<Array<string>>([])
  const { data, error } = useGetUsersQuery()

  useEffect(() => {
    if (data && data.users && data.users.nodes) {
      const users = data.users.nodes as Pick<User, 'username'>[]
      const userNames = users
        .filter((user) => user !== null)
        .map(({ username }) => username) as string[]
      setUsers(userNames)
    }
  }, [data, error])

  const handleChangeUser = async (username: string) => {
    const passwordHash = hashPassword(hardcodedPassword)
    const loginResult = await attemptLogin(username, passwordHash)
    if (loginResult.success) {
      localStorage.setItem('persistJWT', loginResult.JWT)
      console.log(`Changed user to ${username}`)
      if (history.location?.state?.from) push(history.location.state.from)
      else push('/')
    }
  }

  return (
    <Popup
      position="bottom right"
      trigger={<Icon name="angle down" style={{ paddingLeft: 10 }} />}
      on="click"
    >
      {data ? (
        users ? (
          <Grid divided columns="equal">
            <Grid.Column>
              {users.map((user) => (
                <Grid.Row>
                  <Button
                    basic
                    color="blue"
                    content={user}
                    fluid
                    onClick={() => handleChangeUser(user)}
                  />
                </Grid.Row>
              ))}
            </Grid.Column>
          </Grid>
        ) : (
          <Loading />
        )
      ) : (
        <Message content="Error" />
      )}
    </Popup>
  )
}

export default UserSelection
