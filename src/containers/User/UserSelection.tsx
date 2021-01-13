import React, { useEffect, useState } from 'react'
import { Button, Grid, Icon, Message, Popup } from 'semantic-ui-react'
import { Loading } from '../../components'
import { postRequest as attemptLogin } from '../../utils/helpers/fetchMethods'
import config from '../../config.json'
import { useGetUsersQuery } from '../../utils/generated/graphql'
import { useRouter } from '../../utils/hooks/useRouter'
import { User } from '../../utils/types'
import { useUserState } from '../../contexts/UserState'

const hardcodedPassword = '123456'

const UserSelection: React.FC = () => {
  const { history, push } = useRouter()
  const [users, setUsers] = useState<Array<string>>([])
  const [isOpen, setIsOpen] = useState(false)
  const { data, error } = useGetUsersQuery()
  const { onLogin } = useUserState()

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
    setIsOpen(false)
    const loginResult = await attemptLogin(
      { username, password: hardcodedPassword },
      config.serverREST + '/login'
    )
    if (loginResult.success) {
      const { JWT, user, templatePermissions } = loginResult
      await onLogin(JWT, user, templatePermissions)
    }
    // TO-DO: Log in with Org (auto-select first in list)
  }

  return (
    <Popup
      position="bottom right"
      trigger={<Icon name="angle down" style={{ paddingLeft: 10 }} />}
      on="click"
      onOpen={() => setIsOpen(true)}
      onClose={() => setIsOpen(false)}
      open={isOpen}
    >
      {data ? (
        users ? (
          <Grid divided columns="equal">
            <Grid.Column>
              {users.map((user, index) => (
                <Grid.Row key={`user_select_${index}`}>
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
