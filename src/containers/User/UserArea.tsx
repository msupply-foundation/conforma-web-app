import React, { SyntheticEvent, useEffect, useState } from 'react'
import { Button, Container, Image, List, Dropdown, Modal, Header, Form } from 'semantic-ui-react'
import { useUserState } from '../../contexts/UserState'
import { useLanguageProvider } from '../../contexts/Localisation'
import { attemptLoginOrg } from '../../utils/helpers/attemptLogin'
import { Link } from 'react-router-dom'
import {
  OrganisationSimple,
  User,
  LoginPayload,
  TemplateInList,
  DataViewsResponse,
} from '../../utils/types'
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
import { useViewport } from './../../contexts/ViewportState'
import useConfirmationModal from '../../utils/hooks/useConfirmationModal'

const UserArea: React.FC = () => {
  const { preferences } = usePrefs()
  const {
    userState: { currentUser, orgList, templatePermissions },
    onLogin,
  } = useUserState()
  const {
    templatesData: { templates },
  } = useListTemplates(templatePermissions, false)
  const { dataViewsList } = useDataViewsList()
  const { intReferenceDocs, extReferenceDocs } = useReferenceDocs(currentUser)
  const [hamburgerActive, setHamburgerActive] = useState(false)
  const { isMobile } = useViewport()

  const hamburgerClickHandler = (close?: boolean) => {
    if (close === undefined) setHamburgerActive(!hamburgerActive)
    else setHamburgerActive(close)
  }

  if (!currentUser || currentUser?.username === config.nonRegisteredUser) return null

  return (
    <Container id="user-area" fluid>
      <BrandArea />
      <div id="user-area-left">
        <MainMenuBar
          templates={templates}
          dataViews={dataViewsList}
          referenceDocs={{ intReferenceDocs, extReferenceDocs }}
          hamburgerActive={hamburgerActive}
          closeHamburger={() => {
            hamburgerClickHandler(false)
          }}
        />
        {orgList.length > 0 && <OrgSelector user={currentUser} orgs={orgList} onLogin={onLogin} />}
      </div>
      {!isMobile && (
        <UserMenu
          user={currentUser as User}
          templates={templates.filter(({ templateCategory: { uiLocation } }) =>
            uiLocation.includes(UiLocation.User)
          )}
        />
      )}
      {isMobile && <Hamburger active={hamburgerActive} clickHandler={hamburgerClickHandler} />}
    </Container>
  )
}
interface MainMenuBarProps {
  templates: TemplateInList[]
  dataViews: DataViewsResponse
  referenceDocs: {
    intReferenceDocs: { uniqueId: string; description: string }[]
    extReferenceDocs: { uniqueId: string; description: string }[]
  }
  hamburgerActive: Boolean
  closeHamburger: () => void
}
interface DropdownsState {
  dashboard: { active: boolean }
  applicationList: { active: boolean; selection: string }
  dataViews: { active: boolean; selection: string }
  config: { active: boolean; selection: string }
  manage: { active: boolean; selection: string }
  intRefDocs: { active: boolean }
  extRefDocs: { active: boolean }
}
const MainMenuBar: React.FC<MainMenuBarProps> = ({
  templates,
  dataViews,
  referenceDocs: { intReferenceDocs, extReferenceDocs },
  hamburgerActive,
  closeHamburger,
}) => {
  const { t, selectedLanguage, languageOptions } = useLanguageProvider()
  const [dropdownsState, setDropDownsState] = useState<DropdownsState>({
    dashboard: { active: false },
    applicationList: { active: false, selection: '' },
    dataViews: { active: false, selection: '' },
    config: { active: false, selection: '' },
    manage: { active: false, selection: '' },
    intRefDocs: { active: false },
    extRefDocs: { active: false },
  })
  const { push, pathname } = useRouter()
  const {
    userState: { currentUser },
    logout,
  } = useUserState()
  const { isMobile } = useViewport()

  // Ensures the "selected" state of other dropdowns gets disabled
  useEffect(() => {
    const basepath = pathname.split('/')?.[1]
    setDropDownsState((currState) => getNewDropdownsState(basepath, currState))
    closeHamburger() //To close menu bar when navigation occurs
  }, [pathname])

  const dataViewOptions = constructNestedMenuOptions(dataViews, {
    filterMethod: () => true,
    mapMethod: (dataView) => {
      const { code, urlSlug, title, defaultFilter } = dataView
      return {
        key: code,
        text: title,
        value: '/data/' + urlSlug + (defaultFilter ? `?${defaultFilter}` : ''),
      }
    },
    getSubmenuMethod: (dataView) => dataView.submenu,
    onClick: (value) => handleMenuSelect(value, 'DataView'),
  })

  const getTemplateSubmenu = (template: TemplateInList) =>
    template.templateCategory.isSubmenu ? template.templateCategory.title : null

  const applicationListOptions = constructNestedMenuOptions(templates, {
    filterMethod: ({ templateCategory: { uiLocation } }) => uiLocation.includes(UiLocation.List),
    mapMethod: (template) => ({
      key: template.code,
      text: template.name,
      value: `/applications?type=${template.code}`,
    }),
    getSubmenuMethod: getTemplateSubmenu,
    onClick: (value) => handleMenuSelect(value, 'List'),
  })

  const configOptions: (StandardMenuOption | NestedMenuOption)[] = [
    { key: 'templates', text: t('MENU_ITEM_ADMIN_TEMPLATES'), value: '/admin/templates' },
    {
      key: 'dataViews',
      text: t('MENU_ITEM_ADMIN_DATA_VIEW_CONFIG'),
      value: '/admin/data-views',
    },
    // { key: 'permissions', text: t('MENU_ITEM_ADMIN_PERMISSIONS'), value: '/admin/permissions' },
    // { key: 'plugins', text: t('MENU_ITEM_ADMIN_PLUGINS'), value: '/admin/plugins' },
    {
      key: 'localisations',
      text: t('MENU_ITEM_ADMIN_LOCALISATION'),
      value: '/admin/localisations',
    },
    {
      key: 'prefs',
      text: t('MENU_ITEM_ADMIN_PREFS'),
      value: '/admin/preferences',
    },
  ]
  // Only include Snapshots menu item in Dev mode
  if (process.env.NODE_ENV === 'development')
    configOptions.splice(1, 0, {
      key: 'snapshots',
      text: 'Snapshots',
      value: '/admin/snapshots',
    })

  // Add Config/Admin templates to Config menu (requires Admin permission)
  configOptions.push(
    ...constructNestedMenuOptions(templates, {
      filterMethod: ({ templateCategory: { uiLocation } }) => uiLocation.includes(UiLocation.Admin),
      mapMethod: (template) => ({
        key: template.code,
        text: template.name,
        value: `/application/new?type=${template.code}`,
      }),
      getSubmenuMethod: getTemplateSubmenu,
      onClick: (value) => handleMenuSelect(value, 'Config'),
    })
  )

  const managementOptions = constructNestedMenuOptions(templates, {
    filterMethod: ({ templateCategory: { uiLocation } }) =>
      uiLocation.includes(UiLocation.Management),
    mapMethod: (template) => ({
      key: template.code,
      text: template.name,
      value: `/application/new?type=${template.code}`,
    }),
    getSubmenuMethod: getTemplateSubmenu,
    onClick: (value) => handleMenuSelect(value, 'Manage'),
  })

  // Lookup table menu item goes in "Manage" menu, unless the user is Admin and
  // NOT Manager, in which case it goes in "Config" menu
  const lookUpTableOption = {
    key: 'lookup_tables',
    text: t('MENU_ITEM_ADMIN_LOOKUP_TABLES'),
    value: '/admin/lookup-tables',
  }
  if (currentUser?.isManager) {
    managementOptions.push(lookUpTableOption)
  } else if (currentUser?.isAdmin) {
    configOptions.push(lookUpTableOption)
  }

  const handleMenuSelect = (value: string, menu: 'List' | 'DataView' | 'Manage' | 'Config') => {
    let changedDropDown
    let linkStateData
    switch (menu) {
      case 'List':
        changedDropDown = { templates: { active: true, selection: value } }
        break
      case 'DataView':
        changedDropDown = { dataViews: { active: true, selection: value } }
        linkStateData = {
          title: dataViewOptions.find((option) => (option as StandardMenuOption)?.value === value)
            ?.text,
          resetFilters: true,
        }
        break
      case 'Manage':
        changedDropDown = { manage: { active: true, selection: value } }
        break
      case 'Config':
        changedDropDown = { config: { active: true, selection: value } }
        break
    }
    setDropDownsState({ ...dropdownsState, ...changedDropDown } as DropdownsState)
    push(value, linkStateData)
  }

  return (
    <div id="menu-bar" className={hamburgerActive ? 'open' : ''}>
      <List>
        {isMobile && (
          <>
            <List.Item>
              {`${selectedLanguage?.flag} ${currentUser?.firstName || ''} ${
                currentUser?.lastName || ''
              }`}
            </List.Item>
            <List.Item>
              <div className="ui divider menu-divider"></div>
            </List.Item>
          </>
        )}
        <List.Item className={dropdownsState.dashboard.active ? 'selected-link' : ''}>
          <Link to="/">{t('MENU_ITEM_DASHBOARD')}</Link>
        </List.Item>
        {applicationListOptions.length > 0 && (
          <List.Item className={dropdownsState.applicationList.active ? 'selected-link' : ''}>
            <Dropdown
              text={t('MENU_ITEM_APPLICATION_LIST')}
              options={applicationListOptions}
              onChange={(_, { value }) => handleMenuSelect(value as string, 'List')}
              value={dropdownsState.applicationList.selection}
              selectOnBlur={false}
            />
          </List.Item>
        )}
        {dataViewOptions.length > 1 && (
          <List.Item className={dropdownsState.dataViews.active ? 'selected-link' : ''}>
            <Dropdown
              text={t('MENU_ITEM_DATA')}
              options={dataViewOptions}
              onChange={(_, { value }) => handleMenuSelect(value as string, 'DataView')}
              value={dropdownsState.dataViews.selection}
              selectOnBlur={false}
            />
          </List.Item>
        )}
        {managementOptions.length > 0 && (
          <List.Item className={dropdownsState.manage.active ? 'selected-link' : ''}>
            <Dropdown
              text={t('MENU_ITEM_MANAGE')}
              options={managementOptions}
              onChange={(_, { value }) => handleMenuSelect(value as string, 'Manage')}
              value={dropdownsState.manage.selection}
              selectOnBlur={false}
            />
          </List.Item>
        )}
        {currentUser?.isAdmin && (
          <List.Item className={dropdownsState.config.active ? 'selected-link' : ''}>
            <Dropdown
              text={t('MENU_ITEM_CONFIG')}
              options={configOptions}
              onChange={(_, { value }) => handleMenuSelect(value as string, 'Config')}
              value={dropdownsState.config.selection}
              selectOnBlur={false}
            />
          </List.Item>
        )}
        {extReferenceDocs.length > 0 && (
          <List.Item className={dropdownsState.extRefDocs.active ? 'selected-link' : ''}>
            <Dropdown text={t('MENU_ITEM_HELP')}>
              <Dropdown.Menu>
                {extReferenceDocs.map((doc) => (
                  <Dropdown.Item
                    key={doc.uniqueId}
                    onClick={() => window.open(getServerUrl('file', { fileId: doc.uniqueId }))}
                    text={doc.description}
                  />
                ))}
              </Dropdown.Menu>
            </Dropdown>
          </List.Item>
        )}
        {intReferenceDocs.length > 0 && (
          <List.Item className={dropdownsState.intRefDocs.active ? 'selected-link' : ''}>
            <Dropdown text={t('MENU_ITEM_REF_DOCS')}>
              <Dropdown.Menu>
                {intReferenceDocs.map((doc) => (
                  <Dropdown.Item
                    key={doc.uniqueId}
                    onClick={() => window.open(getServerUrl('file', { fileId: doc.uniqueId }))}
                    text={doc.description}
                  />
                ))}
              </Dropdown.Menu>
            </Dropdown>
          </List.Item>
        )}
        {isMobile && (
          <List.Item onClick={() => logout()}>
            <div className="ui divider menu-divider"></div>
            <UserMenu
              user={currentUser as User}
              templates={templates.filter(({ templateCategory: { uiLocation } }) =>
                uiLocation.includes(UiLocation.User)
              )}
            />
          </List.Item>
        )}
      </List>
    </div>
  )
}

const Hamburger: React.FC<{ active: Boolean; clickHandler: () => void }> = ({
  active,
  clickHandler,
}) => {
  return (
    <div className={active ? 'hamburger active' : 'hamburger'} onClick={() => clickHandler()}>
      <span className="hamburger-bun"></span>
      <span className="hamburger-patty"></span>
      <span className="hamburger-bun"></span>
    </div>
  )
}

const BrandArea: React.FC = () => {
  const { preferences } = usePrefs()

  const logoUrl = preferences?.brandLogoOnDarkFileId
    ? getServerUrl('file', { fileId: preferences.brandLogoOnDarkFileId })
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
  const { t } = useLanguageProvider()
  const LOGIN_AS_NO_ORG = 0 // Ensures server returns no organisation

  const handleChange = async (_: SyntheticEvent, { value: orgId }: any) => {
    await attemptLoginOrg({ orgId, onLoginOrgSuccess })
  }

  const onLoginOrgSuccess = async ({ user, orgList, templatePermissions, JWT }: LoginPayload) => {
    await onLogin(JWT, user, templatePermissions, orgList)
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
      text: `> ${t('LABEL_NO_ORG_SELECT')}`,
      value: LOGIN_AS_NO_ORG,
    })
  return (
    <div id="org-selector">
      {user?.organisation?.logoUrl && (
        <Image src={getFullUrl(user?.organisation?.logoUrl, getServerUrl('public'))} />
      )}
      <div id="org-label">
        {dropdownOptions.length === 1 ? (
          user?.organisation?.orgName || t('LABEL_NO_ORG')
        ) : (
          <Dropdown
            text={user?.organisation?.orgName || t('LABEL_NO_ORG')}
            options={dropdownOptions}
            onChange={handleChange}
          ></Dropdown>
        )}
      </div>
    </div>
  )
}

const UserMenu: React.FC<{ user: User; templates: TemplateInList[] }> = ({ user, templates }) => {
  const { t, selectedLanguage, languageOptions } = useLanguageProvider()
  const { logout } = useUserState()
  const { push } = useRouter()
  const { isMobile } = useViewport()
  const [isOpen, setIsOpen] = useState(false)

  const { ConfirmModal: LogoutModal, showModal: showLogoutModal } = useConfirmationModal({
    type: 'warning',
    title: t('MENU_LOGOUT_WARNING'),
    message: t('MENU_LOGOUT_MESSAGE', t('_APP_NAME')),
  })

  // Same on both Mobile and Desktop
  const CommonMenu = (
    <Dropdown.Menu>
      <LogoutModal />
      {templates.map(({ code, name, icon, templateCategory: { icon: catIcon } }) => (
        <Dropdown.Item
          key={code}
          icon={icon || catIcon}
          text={name}
          onClick={() => push(`/application/new?type=${code}`)}
        />
      ))}
      <Dropdown.Item
        icon="log out"
        text={t('MENU_LOGOUT')}
        onClick={() => (isMobile ? showLogoutModal({ onConfirm: logout }) : logout())}
      />
      {languageOptions.length > 1 && (
        <Dropdown.Item
          icon="globe"
          text={t('MENU_CHANGE_LANGUAGE')}
          onClick={() => setIsOpen(true)}
        />
      )}
    </Dropdown.Menu>
  )

  return (
    <>
      <Modal
        onClose={() => setIsOpen(false)}
        onOpen={() => setIsOpen(true)}
        open={isOpen}
        id="language-modal"
      >
        <LanguageSelector />
      </Modal>

      {isMobile && <Dropdown text={t('MENU_USER_OPTIONS')}>{CommonMenu}</Dropdown>}

      {!isMobile && (
        <div id="user-menu">
          <Button>
            <Button.Content visible>
              <Dropdown
                text={
                  (
                    <div
                      style={{ overflow: 'hidden', textOverflow: 'ellipsis', lineHeight: '1.2em' }}
                    >
                      <span style={{ fontSize: '150%', marginRight: 5 }}>
                        {selectedLanguage?.flag}
                      </span>
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{`${
                        user?.firstName || ''
                      } ${user?.lastName || ''}`}</span>
                    </div>
                  ) as any
                }
              >
                {CommonMenu}
              </Dropdown>
            </Button.Content>
          </Button>
        </div>
      )}
    </>
  )
}

const LanguageSelector: React.FC = () => {
  const { t, selectedLanguage, languageOptions, setLanguage } = useLanguageProvider()
  return (
    <Container>
      <div className="flex-centered">
        <Header as="h3">{t('MENU_LANGUAGE_SELECT')}</Header>
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
                      <strong>{languageName}</strong> ({t('MENU_LANGUAGE_CURRENT')})
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
        applicationList: { active: false, selection: '' },
        dataViews: { active: false, selection: '' },
        manage: { active: false, selection: '' },
        config: { active: false, selection: '' },
        intRefDocs: { active: false },
        extRefDocs: { active: false },
      }
    case 'applications':
      return {
        dashboard: { active: false },
        applicationList: { active: true, selection: dropdownsState.applicationList.selection },
        dataViews: { active: false, selection: '' },
        manage: { active: false, selection: '' },
        config: { active: false, selection: '' },
        intRefDocs: { active: false },
        extRefDocs: { active: false },
      }
    case 'data':
      return {
        dashboard: { active: false },
        applicationList: { active: false, selection: '' },
        dataViews: { active: true, selection: dropdownsState.dataViews.selection },
        manage: { active: false, selection: '' },
        config: { active: false, selection: '' },
        intRefDocs: { active: false },
        extRefDocs: { active: false },
      }
    case 'manage':
      return {
        dashboard: { active: false },
        applicationList: { active: false, selection: '' },
        dataViews: { active: true, selection: dropdownsState.dataViews.selection },
        manage: { active: true, selection: dropdownsState.manage.selection },
        config: { active: false, selection: '' },
        intRefDocs: { active: false },
        extRefDocs: { active: false },
      }
    case 'admin':
      return {
        dashboard: { active: false },
        applicationList: { active: false, selection: '' },
        dataViews: { active: false, selection: '' },
        manage: { active: false, selection: '' },
        config: { active: true, selection: dropdownsState.config.selection },
        intRefDocs: { active: false },
        extRefDocs: { active: false },
      }
    // Don't need one for ref docs because they open in new tab
    default:
      return {
        dashboard: { active: false },
        applicationList: { active: false, selection: '' },
        dataViews: { active: false, selection: '' },
        manage: { active: false, selection: '' },
        config: { active: false, selection: '' },
        intRefDocs: { active: false },
        extRefDocs: { active: false },
      }
  }
}

interface StandardMenuOption {
  key: string
  text: string
  value: string
}

interface NestedMenuOption {
  key: string
  text: string
  content: JSX.Element
}

interface MenuInput<T> {
  filterMethod: (e: T) => boolean
  mapMethod: (e: T) => StandardMenuOption
  getSubmenuMethod: (e: T) => string | null
  onClick: (value: string) => void
}

function constructNestedMenuOptions<T>(
  items: T[],
  { filterMethod, mapMethod, getSubmenuMethod, onClick }: MenuInput<T>
): (StandardMenuOption | NestedMenuOption)[] {
  const menus: (StandardMenuOption | NestedMenuOption)[] = []
  const subMenus: Record<string, StandardMenuOption[]> = {}

  items.filter(filterMethod).forEach((item) => {
    const submenu = getSubmenuMethod(item)
    if (!submenu) menus.push(mapMethod(item))
    else {
      if (submenu in subMenus) subMenus[submenu].push(mapMethod(item))
      else subMenus[submenu] = [mapMethod(item)]
    }
  })

  Object.entries(subMenus).forEach(([submenu, items]) => {
    menus.push({
      key: submenu,
      text: submenu,
      content: (
        <Dropdown item text={submenu}>
          <Dropdown.Menu style={{ transform: 'translateY(-25px)' }}>
            {items.map((item) => {
              const { key, text, value } = item
              return (
                <Dropdown.Item
                  key={key}
                  text={text}
                  value={value}
                  onClick={(_, data) => onClick(data.value as string)}
                />
              )
            })}
          </Dropdown.Menu>
        </Dropdown>
      ),
    })
  })

  return menus
}
