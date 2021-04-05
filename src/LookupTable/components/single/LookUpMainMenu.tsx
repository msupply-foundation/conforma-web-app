import React from 'react'
import { NavLink } from 'react-router-dom'
import { Button, Header, Icon } from 'semantic-ui-react'
import { MainMenu } from '..'
import { LookUpTableImportCsvContext } from '../../contexts'

interface ILookUpMainMenu {
  tableName: string
}

const LookUpMainMenu: React.FC<ILookUpMainMenu> = (props) => {
  const { tableName } = props
  const { dispatch } = React.useContext(LookUpTableImportCsvContext)

  return (
    <MainMenu
      header={
        <Header>
          Lookup Table: {tableName}
          <Header.Subheader>View individual lookup-table and its contents</Header.Subheader>
        </Header>
      }
      actions={
        <Button.Group>
          <Button icon as={NavLink} labelPosition="left" to="/lookup-tables">
            <Icon name="arrow alternate circle left" />
            Back
          </Button>
          <Button
            icon
            labelPosition="left"
            as="button"
            color="green"
            onClick={() => dispatch({ type: 'OPEN_MODAL' })}
          >
            <Icon name="upload" />
            Import
          </Button>
          <Button icon labelPosition="right" href="#">
            <Icon name="download" />
            Export
          </Button>
        </Button.Group>
      }
    />
  )
}

export default LookUpMainMenu
