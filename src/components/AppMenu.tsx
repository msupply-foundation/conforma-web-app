import React, { useEffect, useState } from 'react'
import { Menu } from 'semantic-ui-react'
import { MenuItemProps } from 'semantic-ui-react'
import { useQueryState } from '../containers/Main/QueryState'
import { Link, RouteComponentProps, withRouter, useLocation } from 'react-router-dom'

interface AppMenuProps extends RouteComponentProps {
  items: Array<Array<String>>
}

const AppMenu: React.FC<AppMenuProps> = (props: AppMenuProps) => {
  // const [activeItem, setActiveItem] = useState<String>('/')
  const { queryState, setQueryState } = useQueryState()
  const { pathname, search } = useLocation()

  useEffect(() => {
    setQueryState({ type: 'setPathname', pathname: pathname })
  }, [pathname])

  useEffect(() => {
    setQueryState({ type: 'updateParameters', search: search })
  }, [search])

  const handleItemClick = (event: any, { to }: MenuItemProps) => {
    setQueryState({ type: 'setPathname', pathname: to as string })
  }

  let menuItems = []
  for (let i = 0; i < props.items.length; i++) {
    if (props.items[i].length !== 2) {
      console.error('AppMenu: items format should be ["name", "route"]')
      break
    }
    const name = props.items[i][0]
    const route = props.items[i][1]

    menuItems.push(
      <Menu.Item
        header
        key={`app_menu_${name}`}
        active={pathname === route}
        onClick={handleItemClick}
        as={Link}
        to={route}
      >
        {name}
      </Menu.Item>
    )
  }

  return (
    <Menu fluid vertical tabular>
      {menuItems}
    </Menu>
  )
}

export default withRouter(AppMenu)
