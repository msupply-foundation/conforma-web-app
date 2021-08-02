import React, { SyntheticEvent } from 'react'
import { Button, Container, Icon, Image, List, Dropdown } from 'semantic-ui-react'
import { useUserState } from '../../contexts/UserState'
import { attemptLoginOrg } from '../../utils/helpers/attemptLogin'
import { Link } from 'react-router-dom'
import strings from '../../utils/constants'
import { OrganisationSimple, User, LoginPayload } from '../../utils/types'
import useGetOutcomeDisplays from '../../utils/hooks/useGetOutcomeDisplays'
import { useRouter } from '../../utils/hooks/useRouter'
import config from '../../config'
import { getFullUrl } from '../../utils/helpers/utilityFunctions'
import { OutcomeDisplay } from '../../utils/generated/graphql'
const brandLogo = require('../../../images/brand_logo.png').default

const UserArea: React.FC = () => {
  const {
    userState: { currentUser, orgList, templatePermissions },
    onLogin,
  } = useUserState()

  const { displays } = useGetOutcomeDisplays()

  if (!currentUser || currentUser?.username === strings.USER_NONREGISTERED) return null

  return (
    <Container id="user-area" fluid>
      <BrandArea />
      <div id="user-area-left">
        <MainMenuBar
          templates={Object.entries(templatePermissions)}
          outcomes={(displays?.outcomeDisplays as OutcomeDisplay[]) || []}
        />
        {orgList.length > 0 && <OrgSelector user={currentUser} orgs={orgList} onLogin={onLogin} />}
      </div>
      <UserMenu user={currentUser as User} />
    </Container>
  )
}

interface MainMenuBarProps {
  templates: Array<[string, unknown]>
  outcomes: OutcomeDisplay[]
}
const MainMenuBar: React.FC<MainMenuBarProps> = ({ outcomes, templates }) => {
  const { push } = useRouter()
  const outcomeOptions = outcomes.map(({ code, title, tableName }): any => ({
    key: code,
    text: title,
    value: tableName,
  }))
  outcomeOptions.push({ key: 'all', text: 'See all', value: '' })

  const handleOutcomeChange = (_: SyntheticEvent, { value }: any) => {
    if (value === '') push('/outcomes')
    else push(`/outcomes/${value}`)
  }

  const templateOptions = templates.map((templatePerm) => ({
    key: templatePerm[0],
    text: templatePerm[0],
    value: templatePerm[0],
  }))

  const handleTemplateChange = (_: SyntheticEvent, { value }: any) => {
    push(`/applications?type=${value}`)
  }

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
        {templateOptions.length > 0 && (
          <List.Item>
            <Dropdown
              text={strings.MENU_ITEM_APPLICATION_LIST}
              // TO-DO: Show template NAME (needs to come from back-end userInfo)
              options={templateOptions}
              onChange={handleTemplateChange}
            ></Dropdown>
          </List.Item>
        )}
        {outcomeOptions.length > 1 && (
          <List.Item>
            <Dropdown
              text={strings.MENU_ITEM_OUTCOMES}
              options={outcomeOptions}
              onChange={handleOutcomeChange}
            ></Dropdown>
          </List.Item>
        )}
        <List.Item>
          <Link to="/lookup-tables">Lookup Tables</Link>
        </List.Item>
        <List.Item>
          <Link to="/application/new?type=UserEdit">Edit User Account</Link>
        </List.Item>
      </List>
    </div>
  )
}

const BrandArea: React.FC = () => {
  return (
    <div id="brand-area">
      <Image src={brandLogo} />
      <div>
        <Link to="/">
          <h2 className="brand-area-text">{strings.APP_NAME}</h2>
          <h3 className="brand-area-text">{strings.APP_NAME_SUBHEADER}</h3>
        </Link>
      </div>
    </div>
  )
}

const OrgSelector: React.FC<{ user: User; orgs: OrganisationSimple[]; onLogin: Function }> = ({
  user,
  orgs,
  onLogin,
}) => {
  const LOGIN_AS_NO_ORG = 0 // Ensures server returns no organisation

  const JWT = localStorage.getItem('persistJWT') as string

  const handleChange = async (_: SyntheticEvent, { value: orgId }: any) => {
    await attemptLoginOrg({ orgId, JWT, onLoginOrgSuccess })
  }
  const onLoginOrgSuccess = async ({ user, orgList, templatePermissions, JWT }: LoginPayload) => {
    await onLogin(JWT, user, templatePermissions, orgList)
  }
  const dropdownOptions = orgs.map(({ orgId, orgName }) => ({
    key: orgId,
    text: orgName,
    value: orgId,
  }))
  dropdownOptions.push({
    key: LOGIN_AS_NO_ORG,
    text: strings.LABEL_NO_ORG,
    value: LOGIN_AS_NO_ORG,
  })
  return (
    <div id="org-selector">
      {user?.organisation?.logoUrl && (
        <Image src={getFullUrl(user?.organisation?.logoUrl, config.serverREST)} />
      )}
      <div>
        <Dropdown
          text={user?.organisation?.orgName || strings.LABEL_NO_ORG}
          options={dropdownOptions}
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
