import React from 'react'
import { Button, Header, Menu } from 'semantic-ui-react'
import { LookUpTableImportCsvContext } from '../../contexts'
import { LookUpTableListMainMenuType } from '../../types'

const MainMenu: React.FC<LookUpTableListMainMenuType> = ({ headerText, subHeaderText = '' }) => {
  const { dispatch } = React.useContext(LookUpTableImportCsvContext)

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

export default MainMenu
