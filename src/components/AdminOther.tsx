import React from 'react'
import { useLanguageProvider } from '../contexts/Localisation'
import usePageTitle from '../utils/hooks/usePageTitle'

export const AdminLocalisations: React.FC = () => {
  const { strings } = useLanguageProvider()
  usePageTitle(strings.PAGE_TITLE_LOCALISATION)
  return (
    <div>
      <h1>Localisations Management page</h1>
      not implemented
    </div>
  )
}

export const AdminPlugins: React.FC = () => {
  const { strings } = useLanguageProvider()
  usePageTitle(strings.PAGE_TITLE_PLUGINS)
  return (
    <div>
      <h1>Plugin Management page </h1>
      not implemented
    </div>
  )
}

export const AdminPermissions: React.FC = () => {
  const { strings } = useLanguageProvider()
  usePageTitle(strings.PAGE_TITLE_PERMISSIONS)
  return (
    <div>
      <h1>Permissions Management page</h1>
      not implemented
    </div>
  )
}

export const AdminDataDisplays: React.FC = () => {
  const { strings } = useLanguageProvider()
  usePageTitle(strings.PAGE_TITLE_DATA_DISPLAY)
  return (
    <div>
      <h1>Data Display Configuration Page</h1>
      not implemented
    </div>
  )
}
