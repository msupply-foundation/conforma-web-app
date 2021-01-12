import React, { useEffect, useState } from 'react'
import { Button, Grid, Header, Label, Menu, MenuProps, Segment, Sticky } from 'semantic-ui-react'
import strings from '../../utils/constants'
import { useUserState } from '../../contexts/UserState'
import UserSelection from './UserSelection'
import { useRouter } from '../../utils/hooks/useRouter'
import useListTemplates from '../../utils/hooks/useListTemplates'

const UserArea: React.FC = () => {
  const {
    userState: { currentUser, isLoading, templatePermissions },
    logout,
  } = useUserState()
  const {
    replace,
    push,
    query: { type },
  } = useRouter()
  const [menuItems, setMenuItems] = useState<MenuProps>()
  const { error, loading, filteredTemplates } = useListTemplates(templatePermissions, isLoading)

  useEffect(() => {
    if (filteredTemplates) {
      const items = filteredTemplates.map(({ name, code, permissions }) => ({
        key: `app_menu_${name}`,
        content: <Header as="h5" inverted content={name} />,
        active: type === code,
        onClick: () => push(`/applications?type=${code}&user-role=${permissions[0]}`),
      }))
      const homeItem = {
        key: `app_menu_home`,
        content: <Header as="h5" inverted icon="home" />,
        active: location.pathname === '/',
        onClick: () => push('/'),
      }
      setMenuItems({ items: [homeItem, ...items] })
    }
  }, [loading, filteredTemplates, type])

  const handleLogOut = async () => {
    await logout()
    replace('/login')
  }

  return (
    <Sticky>
      <Segment inverted vertical>
        <Grid inverted>
          <Grid.Column style={{ width: '80%' }}>
            {error}
            {menuItems && <Menu fluid inverted pointing secondary {...menuItems} />}
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
