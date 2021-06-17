import React, { SyntheticEvent } from 'react'
import { Button, Container, Icon, Image, List, Dropdown } from 'semantic-ui-react'
import { useUserState } from '../../contexts/UserState'
import { attemptLogin, attemptLoginOrg } from '../../utils/helpers/attemptLogin'
import { Link } from 'react-router-dom'
import strings from '../../utils/constants'
import { OrganisationSimple, User, LoginPayload } from '../../utils/types'
import config from '../../config.json'
import { getFullUrl } from '../../utils/helpers/utilityFunctions'

const UserArea: React.FC = () => {
  const {
    userState: { currentUser, orgList },
    onLogin,
  } = useUserState()

  console.log('User', currentUser)

  if (!currentUser || currentUser?.username === strings.USER_NONREGISTERED) return null

  return (
    <Container id="user-area">
      <div id="user-area-left">
        <MainMenuBar />
        {currentUser?.organisation?.orgName && (
          <OrgSelector user={currentUser} orgs={orgList} onLogin={onLogin} />
        )}
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
      <List horizontal>
        <List.Item>
          <Link to="/" className="selected-link">
            {/* <Icon name="home" /> */}
            {strings.MENU_ITEM_DASHBOARD}
          </Link>
        </List.Item>
        {/* <List.Item>
          <Link to="/layout">Layout helpers</Link>
        </List.Item> */}
        <List.Item>
          <Link to="/lookup-tables">Lookup Tables</Link>
        </List.Item>
        <List.Item>
          <Link to="/outcomes">Outcomes</Link>
        </List.Item>
        <List.Item>
          <Link to="/application/new?type=UserEdit">Edit User Account</Link>
        </List.Item>
      </List>
    </div>
  )
}

const OrgSelector: React.FC<{ user: User; orgs: OrganisationSimple[]; onLogin: Function }> = ({
  user,
  orgs,
  onLogin,
}) => {
  // TO-DO: Make into Dropdown so Org can be selected
  console.log('orgs', orgs)
  const onLoginOrgSuccess = async ({ user, orgList, templatePermissions, JWT }: any) => {
    console.log('RESULT', JWT)
    onLogin({ JWT, user, permissions: templatePermissions, orgList })
  }
  const JWT = localStorage.getItem('persistJWT') as string
  const handleChange = async (_: SyntheticEvent, { value: orgId }: any) => {
    console.log('data', orgId)
    await attemptLoginOrg({ orgId, JWT, onLoginOrgSuccess })
  }

  const dropdownOptions = orgs.map(({ orgId, orgName }) => ({
    key: orgId,
    text: orgName,
    value: orgId,
  }))
  dropdownOptions.push({ key: 0, text: 'No Organisation', value: 0 })
  return (
    <div id="org-selector">
      {user?.organisation?.logoUrl && (
        <Image src={getFullUrl(user?.organisation?.logoUrl, config.serverREST)} />
      )}
      <div>
        <Dropdown
          text={user?.organisation?.orgName || 'No Org'}
          options={dropdownOptions}
          fluid
          direction="right"
          onChange={handleChange}
        ></Dropdown>
      </div>
    </div>
  )
}

const UserMenu: React.FC<{ user: User }> = ({ user }) => {
  const { logout } = useUserState()
  return (
    <div id="user-menu">
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
