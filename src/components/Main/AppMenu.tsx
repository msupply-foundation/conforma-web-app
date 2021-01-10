import React, { useEffect } from 'react'
import { Menu } from 'semantic-ui-react'
import { Link, RouteComponentProps, withRouter } from 'react-router-dom'
import { useRouter } from '../../utils/hooks/useRouter'
import { useUserState } from '../../contexts/UserState'
import useListTemplates from '../../utils/hooks/useListTemplates'

interface AppMenuProps extends RouteComponentProps {
  items: Array<Array<String>>
}

const AppMenu: React.FC<AppMenuProps> = (props: AppMenuProps) => {
  const { pathname } = useRouter()
  const {
    userState: { isLoading, templatePermissions },
  } = useUserState()

  const { error, filteredTemplates } = useListTemplates(templatePermissions, isLoading)

  useEffect(() => {
    console.log('error', error, 'filteredTemplates', filteredTemplates)
  }, [error, filteredTemplates])

  let menuItems = []
  for (let i = 0; i < props.items.length; i++) {
    if (props.items[i].length !== 2) {
      console.error('AppMenu: items format should be ["name", "route"]')
      break
    }
    const name = props.items[i][0]
    const route = props.items[i][1]

    menuItems.push(
      <Menu.Item header key={`app_menu_${name}`} active={pathname === route} as={Link} to={route}>
        {name}
      </Menu.Item>
    )
  }

  return (
    <Menu fluid vertical tabular>
      {menuItems}
      {filteredTemplates.map((template) => (
        <Menu.Item>{template}</Menu.Item>
      ))}
    </Menu>
  )
}

export default withRouter(AppMenu)
