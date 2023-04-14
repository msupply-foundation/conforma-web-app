import React from 'react'
import { useLanguageProvider } from '../../contexts/Localisation'
import usePageTitle from '../../utils/hooks/usePageTitle'

export const AdminPlugins: React.FC = () => {
  const { t } = useLanguageProvider()
  usePageTitle(t('PAGE_TITLE_PLUGINS'))
  return (
    <div>
      <h1>Plugin Management page </h1>
      not implemented
    </div>
  )
}

export const AdminPermissions: React.FC = () => {
  const { t } = useLanguageProvider()
  usePageTitle(t('PAGE_TITLE_PERMISSIONS'))
  return (
    <div>
      <h1>Permissions Management page</h1>
      not implemented
    </div>
  )
}

export const AdminDataViews: React.FC = () => {
  const { t } = useLanguageProvider()
  usePageTitle(t('PAGE_TITLE_DATA_VIEW'))
  return (
    <div>
      <h1>Data View Configuration Page</h1>
      not implemented
    </div>
  )
}
