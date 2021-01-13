import React from 'react'
import { Button, Grid, Label, Message, Segment, Sticky } from 'semantic-ui-react'
import strings from '../../utils/constants'
import { useUserState } from '../../contexts/UserState'
import UserSelection from './UserSelection'
import { useRouter } from '../../utils/hooks/useRouter'
import useListTemplates from '../../utils/hooks/useListTemplates'
import { AppMenu } from '../../components'

const UserArea: React.FC = () => {
  const {
    userState: { currentUser, isLoading, templatePermissions },
    logout,
  } = useUserState()
  const { replace } = useRouter()
  const { error, loading, filteredTemplates } = useListTemplates(templatePermissions, isLoading)

  const handleLogOut = async () => {
    await logout()
    replace('/login')
  }

  return (
    <Sticky>
      <Segment inverted vertical>
        <Grid inverted>
          <Grid.Column style={{ width: '80%' }}>
            {error ? <Message></Message> : <AppMenu templatePermissions={filteredTemplates} />}

            <Segment inverted>{strings.TITLE_COMPANY_PLACEHOLDER}</Segment>
          </Grid.Column>
          <Grid.Column style={{ width: '20%' }}>
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
