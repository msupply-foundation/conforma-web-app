import React, { useEffect } from 'react'
import { useQuery } from '@apollo/client'
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
    if (data) {
      if (data.users && data.users.nodes) {
        const userNames = data.users.nodes.map(({ username }) => username)
        setUserState({ type: 'updateUsersList', updatedUsers: userNames })
      }
    }
  }, [data, error])

  return loading ? (
    <Loading />
  ) : (
    <Segment.Group vertical>
      <Container>
        <Label>The current user is: {currentUser}</Label>
      </Container>
      <Container>
        {users &&
          users.map((user) => (
            <Button
              basic
              color="green"
              onClick={() => setUserState({ type: 'setCurrentUser', payload: { nextUser: user } })}
            >
              {user}
            </Button>
          ))}
      </Container>
    </Segment.Group>
  )
}

export default UserArea
