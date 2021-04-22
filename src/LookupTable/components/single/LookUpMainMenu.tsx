import React from 'react'
import { NavLink } from 'react-router-dom'
import { Button, Header, Icon } from 'semantic-ui-react'
import { MainMenu } from '..'

const LookUpMainMenu: React.FC<any> = (props) => {
  const { tableLabel, tableId } = props

  return (
    <MainMenu
      header={
        <Header>
          Lookup Table: {tableLabel}
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
            as={NavLink}
            color="green"
            to={`/lookup-tables/${tableId}/import`}
          >
            <Icon name="upload" />
            Import
          </Button>
          <Button icon as={NavLink} labelPosition="right" to={`/lookup-tables/${tableId}/export`}>
            <Icon name="download" />
            Export
          </Button>
        </Button.Group>
      }
    />
  )
}

export default React.memo(LookUpMainMenu)
