import React, { useState } from 'react'
import { Header, Menu, MenuProps } from 'semantic-ui-react'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import { useRouter } from '../../utils/hooks/useRouter'
import { TemplatesDetails } from '../../utils/types'

interface AppMenuProps extends RouteComponentProps {
  templatePermissions: TemplatesDetails
}

// THIS IS NOT WORKING YET - Code is in UserArea. To be moved here.

const AppMenu: React.FC<AppMenuProps> = ({ templatePermissions }) => {
  const {
    pathname,
    push,
    query: { type },
  } = useRouter()
  const [menuItems, setMenuItems] = useState<MenuProps>()

  const items = templatePermissions.map(({ name, code, permissions }) => ({
    key: `app_menu_${name}`,
    content: <Header as="h5" inverted content={name} />,
    active: type === code,
    onClick: () => push(`/applications?type=${code}&user-role=${permissions[0]}`),
  }))
  const homeItem = {
    key: `app_menu_home`,
    content: <Header as="h5" inverted icon="home" />,
    active: pathname === '/',
    onClick: () => push('/'),
  }
  setMenuItems({ items: [homeItem, ...items] })

  console.log('menuItems', menuItems)

  return menuItems ? <Menu fluid inverted pointing secondary {...menuItems} /> : null
}

export default withRouter(AppMenu)
