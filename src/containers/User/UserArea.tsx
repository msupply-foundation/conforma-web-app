import React from 'react'
import { Button, Grid, Label, Segment, Sticky } from 'semantic-ui-react'
import strings from '../../utils/constants'
import { useUserState } from '../../contexts/UserState'
import UserSelection from './UserSelection'
import { useRouter } from '../../utils/hooks/useRouter'

const UserArea: React.FC = () => {
  const {
    userState: { currentUser },
    logout,
  } = useUserState()
  const { replace } = useRouter()

  const handleLogOut = async () => {
    await logout()
    replace('/login')
  }

  return currentUser ? (
    <Sticky>
      <Segment inverted vertical>
        <Grid inverted>
          <Grid.Column style={{ width: '30%' }}>
            <Segment inverted>{strings.TITLE_COMPANY_PLACEHOLDER}</Segment>
          </Grid.Column>
          <Grid.Column style={{ width: '50%' }}>
            <Segment inverted />
          </Grid.Column>
          <Grid.Column style={{ width: '20%' }}>
            <Segment inverted floated="right">
              <Label as="button" color="grey" style={{ width: '100%', padding: 10 }}>
                {currentUser?.firstName}
                <UserSelection />
              </Label>
              <Button basic color="blue" onClick={handleLogOut}>
                {strings.LABEL_LOG_OUT}
              </Button>
            </Segment>
          </Grid.Column>
        </Grid>
      </Segment>
    </Sticky>
  ) : null
}

export default UserArea
