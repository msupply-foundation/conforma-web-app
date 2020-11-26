import React, { useEffect, useState } from 'react'
import { Button, Container, Label, Segment } from 'semantic-ui-react'
import { useUserState } from '../../contexts/UserState'
import { useGetUsersQuery, User } from '../../utils/generated/graphql'
import useGetUserPermissions from '../../utils/hooks/useGetUserPermissions'
import Loading from '../../components/Loading'
import { logOut } from '../User/Login'

const UserArea: React.FC = () => {
  const {
    userState: { currentUser, users },
    setUserState,
  } = useUserState()
  const { data, loading, error } = useGetUsersQuery()
  const { username, templatePermissions } = useGetUserPermissions()

  useEffect(() => {
    if (!username) return
    setUserState({ type: 'setCurrentUser', nextUser: username })
  }, [username])

  useEffect(() => {
    if (!templatePermissions) return
    setUserState({ type: 'setTemplatePermissions', templatePermissions })
  }, [templatePermissions])

  useEffect(() => {
    if (data && data.users && data.users.nodes) {
      const users = data.users.nodes as Pick<User, 'username'>[]
      const userNames = users
        .filter((user) => user !== null)
        .map(({ username }) => username) as string[]
      setUserState({ type: 'updateUsersList', updatedUsers: userNames })
    }
  }, [data, error])

  return loading ? (
    <Loading />
  ) : (
    <Segment.Group vertical="true">
      <Container>
        <Label>The current user is: {currentUser}</Label>
      </Container>
      <Container>
        {users &&
          users.map((user) => (
            <Button basic key={`user-area-button-${user}`} color="green">
              {user}
            </Button>
          ))}
        <Button basic color="blue" onClick={logOut}>
          Log out
        </Button>
      </Container>
    </Segment.Group>
  )
}

export default UserArea
