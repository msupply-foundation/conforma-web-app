import React from 'react'
import { Button, Grid, Label, Message, Segment, Sticky } from 'semantic-ui-react'
import strings from '../../utils/constants'
import { useUserState } from '../../contexts/UserState'
import UserSelection from './UserSelection'
import useListTemplates from '../../utils/hooks/useListTemplates'
import { AppMenu } from '../../components'

const UserArea: React.FC = () => {
  const {
    userState: { currentUser, isLoading, templatePermissions },
    logout,
  } = useUserState()
  const { error, loading, filteredTemplates } = useListTemplates(templatePermissions, isLoading)

  const handleLogOut = async () => {
    await logout()
    window.location.href = '/login'
  }

  return (
    <Sticky>
      <Segment inverted vertical>
        <Grid inverted>
          <Grid.Column width={12}>
            {error ? (
              <Message error list={[error]} />
            ) : (
              <AppMenu templatePermissions={filteredTemplates} />
            )}

            <Segment inverted>
              {currentUser?.organisation?.orgName || strings.TITLE_NO_ORGANISATION}
            </Segment>
          </Grid.Column>
          <Grid.Column width={4}>
            {currentUser && (
              <Segment inverted floated="right">
                <Label as="button" color="grey" style={{ width: '100%', padding: 10 }}>
                  {currentUser?.firstName}
                  <UserSelection />
                </Label>
                <Button basic color="blue" onClick={handleLogOut}>
                  {strings.LABEL_LOG_OUT}
                </Button>
              </Segment>
            )}
          </Grid.Column>
        </Grid>
      </Segment>
    </Sticky>
  )
}

export default UserArea
