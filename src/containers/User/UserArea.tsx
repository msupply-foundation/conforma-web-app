import React, { useEffect } from 'react'
import { Button, Grid, Label, Segment, Sticky } from 'semantic-ui-react'
import { logOut } from '../User/Login'
import strings from '../../utils/constants'
import { useUserState } from '../../contexts/UserState'
import useGetUserInfo from '../../utils/hooks/useGetUserInfo'
import UserSelection from './UserSelection'

const UserArea: React.FC = () => {
  const {
    userState: { currentUser },
    setUserState,
  } = useUserState()
  const { user, templatePermissions } = useGetUserInfo()

  // Set userinfo to context after receiving it from endpoint
  useEffect(() => {
    if (!currentUser && user)
      setUserState({
        type: 'setCurrentUser',
        newUser: user,
      })
  }, [user])

  useEffect(() => {
    if (!templatePermissions) return
    setUserState({ type: 'setTemplatePermissions', templatePermissions })
  }, [templatePermissions])

  return (
    <Sticky>
      <Segment inverted vertical>
        <Grid inverted>
          <Grid.Column fluid style={{ width: '30%' }}>
            <Segment inverted>{strings.TITLE_COMPANY_PLACEHOLDER}</Segment>
          </Grid.Column>
          <Grid.Column fluid style={{ width: '50%' }}>
            <Segment inverted />
          </Grid.Column>
          <Grid.Column fluid style={{ width: '20%' }}>
            <Segment inverted floated="right">
              <Label as="Button" color="grey" style={{ width: '100%', padding: 10 }}>
                {currentUser?.firstName}
                <UserSelection />
              </Label>
              <Button basic color="blue" onClick={logOut}>
                {strings.LABEL_LOG_OUT}
              </Button>
            </Segment>
          </Grid.Column>
        </Grid>
      </Segment>
    </Sticky>
  )
}

export default UserArea
