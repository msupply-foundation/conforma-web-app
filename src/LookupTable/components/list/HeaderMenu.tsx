import React from 'react'
import { Button, Container, Header, Menu } from 'semantic-ui-react'
import { LookUpTableContext } from '../../contexts/context'

interface LookUpTableMainMenu {
  headerText: string
  subHeaderText?: string
}

const LookUpTableMainMenu: React.FC<LookUpTableMainMenu> = ({ headerText, subHeaderText = '' }) => {
  const { dispatch } = React.useContext(LookUpTableContext)

  return (
    <Menu borderless secondary>
      <Menu.Item>
        <Header>
          {headerText}
          {subHeaderText && <Header.Subheader>{subHeaderText}</Header.Subheader>}
        </Header>
      </Menu.Item>
      <Menu.Item position="right">
        <Button primary as="button" onClick={() => dispatch({ type: 'OPEN_MODAL' })}>
          Add new Lookup-table
        </Button>
      </Menu.Item>
    </Menu>
  )
}

export default LookUpTableMainMenu
