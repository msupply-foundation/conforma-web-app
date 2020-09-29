import React, { useEffect } from 'react'
import { Button, Container, Label, Segment } from 'semantic-ui-react'
import { useUserState } from './UserState'
import { useGetUsersQuery, User } from '../../generated/graphql'
import Loading from '../../components/Loading'

const UserArea: React.FC = () => {
  const {
    userState: { currentUser, users },
    setUserState,
  } = useUserState()
  const { data, loading, error } = useGetUsersQuery()

  useEffect(() => {
    if (data && data.users && data.users.nodes) {
      const users = data.users.nodes as Pick<User, 'username'>[]
      const userNames = users.map(({ username }) => username) as string[]
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
            <Button
              basic
              key={`user-area-button-${user}`}
              color="green"
              onClick={() => setUserState({ type: 'setCurrentUser', nextUser: user })}
            >
              {user}
            </Button>
          ))}
      </Container>
    </Segment.Group>
  )
}

export default UserArea
