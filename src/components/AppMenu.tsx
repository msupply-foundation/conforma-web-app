import React from 'react'
import { List } from 'semantic-ui-react'
import { Link, RouteComponentProps, withRouter } from 'react-router-dom'

interface AppMenuProps extends RouteComponentProps {
    items: Array<Array<String>>
}

const AppMenu: React.FC<AppMenuProps> = (props: AppMenuProps) => {
    let menuItems = []
    for (let i = 0; i < props.items.length; i++) {
        if (props.items[i].length !== 2) {
            console.error(
                'AppMenu: items format should be ["name", "route"]'
            )
            break
        }
    const name = props.items[i][0]
    const route = props.items[i][1]
    menuItems.push(
        <List.Item 
            key={`app_menu_${name}`}
            as={Link}
            to={route}>
                {name}
        </List.Item>)

    return (
        <List link>
            {menuItems}
        </List>
    )
  }
}
  
export default withRouter(AppMenu)