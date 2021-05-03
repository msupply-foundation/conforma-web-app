import React, { ReactNode } from 'react'
import { Menu } from 'semantic-ui-react'

type MainMenuProps = {
  header: ReactNode
  actions?: ReactNode
}

const MainMenu: React.FC<MainMenuProps> = ({ header, actions }) => {
  return (
    <Menu borderless secondary>
      <Menu.Item>{header}</Menu.Item>
      {actions && <Menu.Item position="right">{actions}</Menu.Item>}
    </Menu>
  )
}

export default MainMenu
