import React, { SyntheticEvent } from 'react'
import { Button, Container, Icon, Image, List, Dropdown } from 'semantic-ui-react'
import { useUserState } from '../../contexts/UserState'
import { attemptLoginOrg } from '../../utils/helpers/attemptLogin'
import { Link } from 'react-router-dom'
import strings from '../../utils/constants'
import { OrganisationSimple, User, LoginPayload, TemplateInList } from '../../utils/types'
import useGetOutcomeDisplays from '../../utils/hooks/useGetOutcomeDisplays'
import useListTemplates from '../../utils/hooks/useListTemplates'
import { AllLookupTableStructuresType } from '../../LookupTable/types'
import { useGetAllTableStructures } from '../../LookupTable/hooks'
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
  const {
    templatesData: { templates },
  } = useListTemplates(templatePermissions, false)

  const { displays } = useGetOutcomeDisplays()

  const { allTableStructures } = useGetAllTableStructures()

  if (!currentUser || currentUser?.username === strings.USER_NONREGISTERED) return null

  return (
    <Container id="user-area" fluid>
      <BrandArea />
      <div id="user-area-left">
        <MainMenuBar
          templates={templates}
          outcomes={(displays?.outcomeDisplays as OutcomeDisplay[]) || []}
          showLookupTables={(allTableStructures && allTableStructures?.length > 0) || false}
        />
        {orgList.length > 0 && <OrgSelector user={currentUser} orgs={orgList} onLogin={onLogin} />}
      </div>
      <UserMenu user={currentUser as User} />
    </Container>
  )
}
interface MainMenuBarProps {
  templates: TemplateInList[]
  outcomes: OutcomeDisplay[]
  showLookupTables: boolean
}
const MainMenuBar: React.FC<MainMenuBarProps> = ({ outcomes, templates, showLookupTables }) => {
  const { push, pathname } = useRouter()
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

  const templateOptions = templates.map((template) => ({
    key: template.code,
    text: template.name,
    value: template.code,
  }))

  const handleTemplateChange = (_: SyntheticEvent, { value }: any) => {
    push(`/applications?type=${value}`)
  }

  const getSelectedLinkClass = (link: string) => {
    const basepath = pathname.split('/')?.[1]
    return link === basepath ? 'selected-link' : ''
  }

const MainMenuBar: React.FC = () => {
  // TO-DO: Logic for deducing what should show in menu bar
  // Probably passed in as props
  const {
    userState: { isAdmin },
  } = useUserState()

  return (
    <div id="menu-bar">
      <List horizontal>
        <List.Item>
          <Link to="/" className="selected-link">
            {/* <Icon name="home" /> */}
            {strings.MENU_ITEM_DASHBOARD}
          </Link>
        </List.Item>
        <List.Item>
          <Link to="/outcomes">Outcomes</Link>
        </List.Item>
        <List.Item>
          <Link to="/application/new?type=UserEdit">Edit User Account</Link>
        </List.Item>
        {isAdmin && (
          <List.Item>
            <Link to="/admin">Admin Configurations</Link>
          </List.Item>
        )}
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
  const onLoginOrgSuccess = async ({
    user,
    orgList,
    templatePermissions,
    JWT,
    isAdmin,
  }: LoginPayload) => {
    await onLogin(JWT, user, templatePermissions, orgList, isAdmin)
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
  const { push } = useRouter()
  return (
    <div id="user-menu">
      <Button>
        <Button.Content visible>
          <Dropdown text={`${user?.firstName || ''} ${user?.lastName || ''}`}>
            <Dropdown.Menu>
              <Dropdown.Item
                icon="edit"
                text={strings.MENU_EDIT_USER}
                onClick={() => push('/application/new?type=UserEdit')}
              />
              <Dropdown.Item icon="log out" text={strings.MENU_LOGOUT} onClick={() => logout()} />
            </Dropdown.Menu>
          </Dropdown>
        </Button.Content>
      </Button>
    </div>
  )
}

export default UserArea
