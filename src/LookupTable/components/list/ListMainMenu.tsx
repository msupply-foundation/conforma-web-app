import React from 'react'
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
        <Button primary as="button" onClick={() => dispatch({ type: 'OPEN_MODAL' })}>
          Add new Lookup-table
        </Button>
      }
    />
  )
}

export default ListMainMenu
