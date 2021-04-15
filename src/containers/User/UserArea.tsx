import React, { CSSProperties } from 'react'
import { Button, Container, Icon, Image } from 'semantic-ui-react'
import { useUserState } from '../../contexts/UserState'
import { Link } from 'react-router-dom'
import strings from '../../utils/constants'
import { User } from '../../utils/types'

const UserArea: React.FC = () => {
  const {
    userState: { currentUser },
  } = useUserState()
  return (
    <Container id="user-area">
      <div id="user-area-left">
        <MainMenuBar />
        {currentUser?.organisation?.orgName && <OrgSelector user={currentUser} />}
      </div>
      <UserMenu user={currentUser as User} />
    </Container>
  )
}

const MainMenuBar: React.FC = () => {
  // TO-DO: Logic for deducing what should show in menu bar
  // Probably passed in as props
  return (
    <div id="menu-bar">
      <Link to="/">
        {/* <Icon name="home" /> */}
        {strings.MENU_ITEM_DASHBOARD}
      </Link>
    </div>
  )
}

const OrgSelector: React.FC<{ user: User }> = ({ user }) => {
  // TO-DO: Make into Dropdown so Org can be selected
  return (
    <div id="org-selector">
      <Image src="/images/temp_logo.png" />
      <div>
        {user?.organisation?.orgName || ''}
        <Icon size="small" name="angle down" />
      </div>
    </div>
  )
}

const UserMenu: React.FC<{ user: User }> = ({ user }) => {
  const { logout } = useUserState()
  return (
    <div id="user-area-user-menu">
      <Button animated onClick={() => logout()}>
        <Button.Content visible>
          {user?.firstName || ''} {user?.lastName || ''}
        </Button.Content>
        <Button.Content hidden>
          <Icon name="log out" />
        </Button.Content>
      </Button>
    </div>
  )
}

export default UserArea
