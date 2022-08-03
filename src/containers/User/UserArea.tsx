import React, { SyntheticEvent, useEffect, useState } from 'react'
import { Button, Container, Image, List, Dropdown, Modal, Header, Form } from 'semantic-ui-react'
import { useUserState } from '../../contexts/UserState'
import { useLanguageProvider } from '../../contexts/Localisation'
import { attemptLoginOrg } from '../../utils/helpers/attemptLogin'
import { Link } from 'react-router-dom'
import { OrganisationSimple, User, LoginPayload, TemplateInList } from '../../utils/types'
import useListTemplates from '../../utils/hooks/useListTemplates'
import { useDataViewsList } from '../../utils/hooks/useDataViews'
import { useReferenceDocs } from '../../utils/hooks/useReferenceDocs'
import { useRouter } from '../../utils/hooks/useRouter'
import { usePrefs } from '../../contexts/SystemPrefs'
import config from '../../config'
import { getFullUrl } from '../../utils/helpers/utilityFunctions'
import getServerUrl from '../../utils/helpers/endpoints/endpointUrlBuilder'
import { UiLocation } from '../../utils/generated/graphql'
const defaultBrandLogo = require('../../../images/logos/conforma_logo_wide_white_1024.png').default

const UserArea: React.FC = () => {
  const {
    userState: { currentUser, orgList, templatePermissions, isAdmin },
    onLogin,
  } = useUserState()
  const {
    templatesData: { templates },
  } = useListTemplates(templatePermissions, false)
  const { dataViewsList } = useDataViewsList()
  const { intReferenceDocs, extReferenceDocs } = useReferenceDocs(currentUser, isAdmin)

  if (!currentUser || currentUser?.username === config.nonRegisteredUser) return null

  return (
    <Container id="user-area" fluid>
      <BrandArea />
      <div id="user-area-left">
        <MainMenuBar
          templates={templates}
          dataViews={dataViewsList}
          referenceDocs={{ intReferenceDocs, extReferenceDocs }}
        />
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
  dataViews: { tableName: string; title: string; code: string }[]
  referenceDocs: {
    intReferenceDocs: { uniqueId: string; description: string }[]
    extReferenceDocs: { uniqueId: string; description: string }[]
  }
}
interface DropdownsState {
  dashboard: { active: boolean }
  templates: { active: boolean; selection: string }
  dataViews: { active: boolean; selection: string }
  admin: { active: boolean; selection: string }
  intRefDocs: { active: boolean }
  extRefDocs: { active: boolean }
}
const MainMenuBar: React.FC<MainMenuBarProps> = ({
  templates,
  dataViews,
  referenceDocs: { intReferenceDocs, extReferenceDocs },
}) => {
  const { strings } = useLanguageProvider()
  const [dropdownsState, setDropDownsState] = useState<DropdownsState>({
    dashboard: { active: false },
    templates: { active: false, selection: '' },
    dataViews: { active: false, selection: '' },
    admin: { active: false, selection: '' },
    intRefDocs: { active: false },
    extRefDocs: { active: false },
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

  const dataViewOptions = dataViews.map(({ code, title, tableName }) => ({
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
    // {
    //   key: 'dataViews',
    //   text: strings.MENU_ITEM_ADMIN_DATA_VIEW_CONFIG,
    //   value: '/admin/data',
    // },
    // { key: 'permissions', text: strings.MENU_ITEM_ADMIN_PERMISSIONS, value: '/admin/permissions' },
    // { key: 'plugins', text: strings.MENU_ITEM_ADMIN_PLUGINS, value: '/admin/plugins' },
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

  const handleDataViewChange = (_: SyntheticEvent, { value }: any) => {
    setDropDownsState({ ...dropdownsState, dataViews: { active: true, selection: value } })
    push(`/data/${value}`)
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
              selectOnBlur={false}
            />
          </List.Item>
        )}
        {dataViewOptions.length > 1 && (
          <List.Item className={dropdownsState.dataViews.active ? 'selected-link' : ''}>
            <Dropdown
              text={strings.MENU_ITEM_DATA}
              options={dataViewOptions}
              onChange={handleDataViewChange}
              value={dropdownsState.dataViews.selection}
              selectOnBlur={false}
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
              selectOnBlur={false}
            />
          </List.Item>
        )}
        {extReferenceDocs.length && (
          <List.Item className={dropdownsState.extRefDocs.active ? 'selected-link' : ''}>
            <Dropdown text={strings.MENU_ITEM_HELP}>
              <Dropdown.Menu>
                {extReferenceDocs.map((doc) => (
                  <Dropdown.Item
                    key={doc.uniqueId}
                    onClick={() => window.open(getServerUrl('file', doc.uniqueId))}
                    text={doc.description}
                  />
                ))}
              </Dropdown.Menu>
            </Dropdown>
          </List.Item>
        )}
        {intReferenceDocs.length && (
          <List.Item className={dropdownsState.intRefDocs.active ? 'selected-link' : ''}>
            <Dropdown text={strings.MENU_ITEM_REF_DOCS}>
              <Dropdown.Menu>
                {intReferenceDocs.map((doc) => (
                  <Dropdown.Item
                    key={doc.uniqueId}
                    onClick={() => window.open(getServerUrl('file', doc.uniqueId))}
                    text={doc.description}
                  />
                ))}
              </Dropdown.Menu>
            </Dropdown>
          </List.Item>
        )}
      </List>
    </div>
  )
}

const BrandArea: React.FC = () => {
  const { preferences } = usePrefs()

  const logoUrl = preferences?.brandLogoOnDarkFileId
    ? getServerUrl('file', preferences?.brandLogoOnDarkFileId)
    : defaultBrandLogo

  return (
    <div id="brand-area" className="hide-on-mobile">
      <Link to="/">
        <Image src={logoUrl} />
      </Link>
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
        <Image src={getFullUrl(user?.organisation?.logoUrl, getServerUrl('public'))} />
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
        dataViews: { active: false, selection: '' },
        admin: { active: false, selection: '' },
        intRefDocs: { active: false },
        extRefDocs: { active: false },
      }
    case 'applications':
      return {
        dashboard: { active: false },
        templates: { active: true, selection: dropdownsState.templates.selection },
        dataViews: { active: false, selection: '' },
        admin: { active: false, selection: '' },
        intRefDocs: { active: false },
        extRefDocs: { active: false },
      }
    case 'data':
      return {
        dashboard: { active: false },
        templates: { active: false, selection: '' },
        dataViews: { active: true, selection: dropdownsState.dataViews.selection },
        admin: { active: false, selection: '' },
        intRefDocs: { active: false },
        extRefDocs: { active: false },
      }
    case 'admin':
      return {
        dashboard: { active: false },
        templates: { active: false, selection: '' },
        dataViews: { active: false, selection: '' },
        admin: { active: true, selection: dropdownsState.admin.selection },
        intRefDocs: { active: false },
        extRefDocs: { active: false },
      }
    // Don't need one for ref docs because they open in new tab
    default:
      return {
        dashboard: { active: false },
        templates: { active: false, selection: '' },
        dataViews: { active: false, selection: '' },
        admin: { active: false, selection: '' },
        intRefDocs: { active: false },
        extRefDocs: { active: false },
      }
  }
}
