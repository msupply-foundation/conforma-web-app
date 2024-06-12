import React from 'react'
import { NavLink } from 'react-router-dom'
import { Button, Header } from 'semantic-ui-react'
import { DownloadButton, MainMenu } from '..'
import { useLanguageProvider } from '../../../contexts/Localisation'

const LookUpMainMenu: React.FC<any> = (props) => {
  const { t } = useLanguageProvider()
  const { tableLabel, tableId } = props

  return (
    <MainMenu
      header={
        <Header
          content={`${t('LOOKUP_TABLE_TITLE')} ${tableLabel}`}
          subheader={t('LOOKUP_TABLE_CONTENTS')}
        />
      }
      actions={
        <Button.Group>
          <Button
            icon="arrow alternate circle left"
            content={t('BUTTON_BACK')}
            as={NavLink}
            labelPosition="left"
            to="../lookup-tables"
          />
          <Button
            icon="upload"
            labelPosition="left"
            content={t('LABEL_IMPORT')}
            as={NavLink}
            color="green"
            to={`../lookup-tables/${tableId}/import`}
          />
          <DownloadButton
            content={t('LABEL_EXPORT')}
            labelPosition="left"
            popUpContent={t('LOOKUP_TABLE_DOWNLOAD', tableLabel)}
            id={tableId}
            name={tableLabel}
          />
        </Button.Group>
      }
    />
  )
}

export default React.memo(LookUpMainMenu)
