import React, { SyntheticEvent, useEffect, useState } from 'react'
import {
  Button,
  Container,
  Image,
  List,
  Dropdown,
  Modal,
  Header,
  Form,
  Icon,
} from 'semantic-ui-react'
import { useUserState } from '../../contexts/UserState'
import { useLanguageProvider } from '../../contexts/Localisation'
import { attemptLoginOrg } from '../../utils/helpers/attemptLogin'
import { Link } from 'react-router-dom'
import { OrganisationSimple, User, LoginPayload, TemplateInList } from '../../utils/types'
import useListTemplates from '../../utils/hooks/useListTemplates'
import { useOutcomesList } from '../../utils/hooks/useOutcomes'
import { useRouter } from '../../utils/hooks/useRouter'
import config from '../../config'
import { getFullUrl } from '../../utils/helpers/utilityFunctions'
import { UiLocation } from '../../utils/generated/graphql'
const brandLogo = require('../../../images/logos/conforma_logo_wide_white_1024.png').default

const UserArea: React.FC = () => {
  const {
    userState: { currentUser, orgList, templatePermissions },
    onLogin,
  } = useUserState()
  const {
    templatesData: { templates },
  } = useListTemplates(templatePermissions, false)
  const { outcomesList } = useOutcomesList()

  if (!currentUser || currentUser?.username === config.nonRegisteredUser) return null

  return (
    <Container id="user-area" fluid>
      <BrandArea />
      <div id="user-area-left">
        <MainMenuBar templates={templates} outcomes={outcomesList} />
        {orgList.length > 0 && <OrgSelector user={currentUser} orgs={orgList} onLogin={onLogin} />}
      </div>
      <UserMenu
        user={currentUser as User}
        templates={templates.filter(({ templateCategory: { uiLocation } }) =>
          uiLocation.includes(UiLocation.User)
        )}
      />
    </Container>
  )
}
interface MainMenuBarProps {
  templates: TemplateInList[]
  outcomes: { tableName: string; title: string; code: string }[]
}
interface DropdownsState {
  dashboard: { active: boolean }
  templates: { active: boolean; selection: string }
  outcomes: { active: boolean; selection: string }
  admin: { active: boolean; selection: string }
}
const MainMenuBar: React.FC<MainMenuBarProps> = ({ templates, outcomes }) => {
  const { strings } = useLanguageProvider()
  const [dropdownsState, setDropDownsState] = useState<DropdownsState>({
    dashboard: { active: false },
    templates: { active: false, selection: '' },
    outcomes: { active: false, selection: '' },
    admin: { active: false, selection: '' },
  })
  const { push, pathname } = useRouter()
  const {
    userState: { isAdmin },
  } = useUserState()

  // Ensures the "selected" state of other dropdowns gets disabled
  useEffect(() => {
    const basepath = pathname.split('/')?.[1]
    setDropDownsState((currState) => getNewDropdownsState(basepath, currState))
  }, [pathname])

  const outcomeOptions = outcomes.map(({ code, title, tableName }) => ({
    key: code,
    text: title,
    value: tableName,
  }))

  const templateOptions = templates
    .filter(({ templateCategory: { uiLocation } }) => uiLocation.includes(UiLocation.List))
    .sort((t1, t2) => (t1.templateCategory.title > t2.templateCategory.title ? 1 : -1))
    .map((template) => ({
      key: template.code,
      text: template.name,
      value: template.code,
    }))

  const adminOptions: any = [
    { key: 'templates', text: strings.MENU_ITEM_ADMIN_TEMPLATES, value: '/admin/templates' },
    {
      key: 'lookup_tables',
      text: strings.MENU_ITEM_ADMIN_LOOKUP_TABLES,
      value: '/admin/lookup-tables',
    },
    { key: 'outcomes', text: strings.MENU_ITEM_ADMIN_OUTCOME_CONFIG, value: '/admin/outcomes' },
    { key: 'permissions', text: strings.MENU_ITEM_ADMIN_PERMISSIONS, value: '/admin/permissions' },
    { key: 'plugins', text: strings.MENU_ITEM_ADMIN_PLUGINS, value: '/admin/plugins' },
    {
      key: 'localisations',
      text: strings.MENU_ITEM_ADMIN_LOCALISATION,
      value: '/admin/localisations',
    },
  ]
  // Only include Snapshots menu item in Dev mode
  if (process.env.NODE_ENV === 'development')
    adminOptions.splice(1, 0, {
      key: 'snapshots',
      text: 'Snapshots',
      value: '/admin/snapshots',
    })

  // Add Admin templates to Admin menu
  adminOptions.push(
    ...templates
      .filter(({ templateCategory: { uiLocation } }) => uiLocation.includes(UiLocation.Admin))
      .map((template) => ({
        key: template.code,
        text: template.name,
        value: `/application/new?type=${template.code}`,
      }))
  )

  const handleOutcomeChange = (_: SyntheticEvent, { value }: any) => {
    setDropDownsState({ ...dropdownsState, outcomes: { active: true, selection: value } })
    push(`/outcomes/${value}`)
  }

  const handleTemplateChange = (_: SyntheticEvent, { value }: any) => {
    setDropDownsState({ ...dropdownsState, templates: { active: true, selection: value } })
    push(`/applications?type=${value}`)
  }

  const handleAdminChange = (_: SyntheticEvent, { value }: any) => {
    setDropDownsState({ ...dropdownsState, admin: { active: true, selection: value } })
    push(value)
  }

  return (
    <div id="menu-bar">
      <List horizontal>
        <List.Item className={dropdownsState.dashboard.active ? 'selected-link' : ''}>
          <Link to="/">{strings.MENU_ITEM_DASHBOARD}</Link>
        </List.Item>
        {templateOptions.length > 0 && (
          <List.Item className={dropdownsState.templates.active ? 'selected-link' : ''}>
            <Dropdown
              text={strings.MENU_ITEM_APPLICATION_LIST}
              options={templateOptions}
              onChange={handleTemplateChange}
              value={dropdownsState.templates.selection}
            />
          </List.Item>
        )}
        {outcomeOptions.length > 1 && (
          <List.Item className={dropdownsState.outcomes.active ? 'selected-link' : ''}>
            <Dropdown
              text={strings.MENU_ITEM_OUTCOMES}
              options={outcomeOptions}
              onChange={handleOutcomeChange}
              value={dropdownsState.outcomes.selection}
            />
          </List.Item>
        )}
        {isAdmin && (
          <List.Item className={dropdownsState.admin.active ? 'selected-link' : ''}>
            <Dropdown
              text={strings.MENU_ITEM_ADMIN_CONFIG}
              options={adminOptions}
              onChange={handleAdminChange}
              value={dropdownsState.admin.selection}
            />
          </List.Item>
        )}
      </List>
    </div>
  )
}

const BrandArea: React.FC = () => {
  const { strings } = useLanguageProvider()
  return (
    <div id="brand-area" className="hide-on-mobile">
      <Link to="/">
        <Image src={brandLogo} />
      </Link>
      <div>
        {/* <Link to="/">
          <h2 className="brand-area-text">{strings._APP_NAME}</h2>
          <h3 className="brand-area-text">{strings._APP_NAME_SUBHEADER}</h3>
        </Link> */}
      </div>
    </div>
  )
}

const OrgSelector: React.FC<{ user: User; orgs: OrganisationSimple[]; onLogin: Function }> = ({
  user,
  orgs,
  onLogin,
}) => {
  const { strings } = useLanguageProvider()
  const LOGIN_AS_NO_ORG = 0 // Ensures server returns no organisation

  const JWT = localStorage.getItem(config.localStorageJWTKey) as string

  const handleChange = async (_: SyntheticEvent, { value: orgId }: any) => {
    await attemptLoginOrg({ orgId, onLoginOrgSuccess })
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
  // Only add "No Org" option if user not part of "Admin" org (e.g. FDA)
  if (!orgs.some(({ isSystemOrg }) => isSystemOrg))
    dropdownOptions.push({
      key: LOGIN_AS_NO_ORG,
      text: `> ${strings.LABEL_NO_ORG_SELECT}`,
      value: LOGIN_AS_NO_ORG,
    })
  return (
    <div id="org-selector">
      {user?.organisation?.logoUrl && (
        <Image src={getFullUrl(user?.organisation?.logoUrl, config.serverREST + '/public')} />
      )}
      <div>
        {dropdownOptions.length === 1 ? (
          user?.organisation?.orgName || strings.LABEL_NO_ORG
        ) : (
          <Dropdown
            text={user?.organisation?.orgName || strings.LABEL_NO_ORG}
            options={dropdownOptions}
            onChange={handleChange}
          ></Dropdown>
        )}
      </div>
    </div>
  )
}

const UserMenu: React.FC<{ user: User; templates: TemplateInList[] }> = ({ user, templates }) => {
  const { strings, selectedLanguage, languageOptions } = useLanguageProvider()
  const { logout } = useUserState()
  const { push } = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  return (
    <div id="user-menu">
      <Modal
        onClose={() => setIsOpen(false)}
        onOpen={() => setIsOpen(true)}
        open={isOpen}
        id="language-modal"
      >
        <LanguageSelector />
      </Modal>
      <Button>
        <Button.Content visible>
          <Dropdown
            text={`${selectedLanguage?.flag} ${user?.firstName || ''} ${user?.lastName || ''}`}
          >
            <Dropdown.Menu>
              {templates.map(({ code, name, icon, templateCategory: { icon: catIcon } }) => (
                <Dropdown.Item
                  key={code}
                  icon={icon || catIcon}
                  text={name}
                  onClick={() => push(`/application/new?type=${code}`)}
                />
              ))}
              <Dropdown.Item icon="log out" text={strings.MENU_LOGOUT} onClick={() => logout()} />
              {languageOptions.length > 1 && (
                <Dropdown.Item
                  icon="globe"
                  text={strings.MENU_CHANGE_LANGUAGE}
                  onClick={() => setIsOpen(true)}
                />
              )}
            </Dropdown.Menu>
          </Dropdown>
        </Button.Content>
      </Button>
    </div>
  )
}

const LanguageSelector: React.FC = () => {
  const { strings, selectedLanguage, languageOptions, setLanguage } = useLanguageProvider()
  return (
    <Container>
      <div className="flex-centered">
        <Header as="h3">{strings.MENU_LANGUAGE_SELECT}</Header>
      </div>
      <Form>
        <List celled relaxed="very" className="no-bottom-border">
          {languageOptions.map(({ code, flag, languageName, description }) => (
            <List.Item onClick={() => setLanguage(code)} key={`lang_${code}`}>
              <List.Icon size="big" verticalAlign="middle">
                {flag}
              </List.Icon>
              <List.Content>
                <List.Header as="a">
                  {selectedLanguage?.code === code ? (
                    <>
                      <strong>{languageName}</strong> ({strings.MENU_LANGUAGE_CURRENT})
                    </>
                  ) : (
                    languageName
                  )}
                </List.Header>
                <List.Description as="a">{description}</List.Description>
              </List.Content>
            </List.Item>
          ))}
        </List>
      </Form>
    </Container>
  )
}

export default UserArea

const getNewDropdownsState = (basepath: string, dropdownsState: DropdownsState): DropdownsState => {
  switch (basepath) {
    case '':
      return {
        dashboard: { active: true },
        templates: { active: false, selection: '' },
        outcomes: { active: false, selection: '' },
        admin: { active: false, selection: '' },
      }
    case 'applications':
      return {
        dashboard: { active: false },
        templates: { active: true, selection: dropdownsState.templates.selection },
        outcomes: { active: false, selection: '' },
        admin: { active: false, selection: '' },
      }
    case 'outcomes':
      return {
        dashboard: { active: false },
        templates: { active: false, selection: '' },
        outcomes: { active: true, selection: dropdownsState.outcomes.selection },
        admin: { active: false, selection: '' },
      }
    case 'admin':
      return {
        dashboard: { active: false },
        templates: { active: false, selection: '' },
        outcomes: { active: false, selection: '' },
        admin: { active: true, selection: dropdownsState.admin.selection },
      }
    default:
      return {
        dashboard: { active: false },
        templates: { active: false, selection: '' },
        outcomes: { active: false, selection: '' },
        admin: { active: false, selection: '' },
      }
  }
}
