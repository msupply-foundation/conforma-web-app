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
    <div id="org-selector" style={inlineStyles.left}>
      <Image size="tiny" src="/images/temp_logo.png" circular />
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
      <Button animated style={inlineStyles.user} onClick={() => logout()}>
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

// Styles - TODO: Move to LESS || Global class style (semantic)
const inlineStyles = {
  top: { display: 'flex', flexDirection: 'column' } as CSSProperties,
  link: { color: 'rgb(240,240,240)', fontSize: 14, letterSpacing: 1 } as CSSProperties,
  left: { marginTop: 10, display: 'flex', alignItems: 'center' } as CSSProperties,
  company: {
    marginLeft: 20,
    color: 'rgb(200,200,200)',
    fontSize: 27,
    fontWeight: 500,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  } as CSSProperties,
  image: { height: 60, width: 60, boxShadow: '0px 0px 3px rgb(240,240,240)' } as CSSProperties,
  user: {
    background: 'rgb(248,248,248)',
    border: 'none',
    borderRadius: 20,
    fontSize: 14,
    color: 'rgb(50,50,50)',
    paddingRight: 5,
  } as CSSProperties,
}

export default UserArea
