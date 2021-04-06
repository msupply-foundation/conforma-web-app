import React from 'react'
import { NavLink } from 'react-router-dom'
import { Button, Header } from 'semantic-ui-react'
import { MainMenu } from '..'
import { LookUpTableImportCsvContext } from '../../contexts'
import { LookUpTableListMainMenuType } from '../../types'

const ListMainMenu: React.FC<LookUpTableListMainMenuType> = ({
  headerText,
  subHeaderText = '',
}) => {
  const { dispatch } = React.useContext(LookUpTableImportCsvContext)

  return (
    <MainMenu
      header={
        <Header>
          {headerText}
          {subHeaderText && <Header.Subheader>{subHeaderText}</Header.Subheader>}
        </Header>
      }
      actions={
        <Button primary as={NavLink} to="/lookup-tables/import">
          Add new Lookup-table
        </Button>
      }
    />
  )
}

export default ListMainMenu
