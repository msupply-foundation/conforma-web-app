import React from 'react'
import { NavLink } from 'react-router-dom'
import { Button, Header } from 'semantic-ui-react'
import { MainMenu } from '..'
import { useLanguageProvider } from '../../../contexts/Localisation'
import { useRouter } from '../../../utils/hooks/useRouter'
import { LookUpTableListMainMenuType } from '../../types'

const ListMainMenu: React.FC<LookUpTableListMainMenuType> = ({
  headerText,
  subHeaderText = '',
}) => {
  const { t } = useLanguageProvider()
  const {
    match: { path },
  } = useRouter()
  return (
    <MainMenu
      header={
        <Header>
          {headerText}
          {subHeaderText && <Header.Subheader>{subHeaderText}</Header.Subheader>}
        </Header>
      }
      actions={
        <Button primary as={NavLink} to={`${path}/import`} content={t('LOOKUP_TABLE_ADD')} />
      }
    />
  )
}

export default ListMainMenu
