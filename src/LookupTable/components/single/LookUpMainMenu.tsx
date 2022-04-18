import React from 'react'
import { NavLink } from 'react-router-dom'
import { Button, Header } from 'semantic-ui-react'
import { DownloadButton, MainMenu } from '..'
import { useLanguageProvider } from '../../../contexts/Localisation'
import { useRouter } from '../../../utils/hooks/useRouter'

const LookUpMainMenu: React.FC<any> = (props) => {
  const { strings } = useLanguageProvider()
  const { tableLabel, tableId } = props
  const {
    match: { path },
  } = useRouter()

  return (
    <MainMenu
      header={
        <Header
          content={`${strings.LOOKUP_TABLE_TITLE} ${tableLabel}`}
          subheader={strings.LOOKUP_TABLE_CONTENTS}
        />
      }
      actions={
        <Button.Group>
          <Button
            icon="arrow alternate circle left"
            content={strings.BUTTON_BACK}
            as={NavLink}
            labelPosition="left"
            to="/admin/lookup-tables"
          />
          <Button
            icon="upload"
            labelPosition="left"
            content={strings.LABEL_IMPORT}
            as={NavLink}
            color="green"
            to={`/admin/lookup-tables/${tableId}/import`}
          />
          <DownloadButton
            content={strings.LABEL_EXPORT}
            labelPosition="left"
            popUpContent={strings.LOOKUP_TABLE_DOWNLOAD.replace('%1', tableLabel)}
            id={tableId}
            name={tableLabel}
          />
        </Button.Group>
      }
    />
  )
}

export default React.memo(LookUpMainMenu)
