import React from 'react'
import strings from '../utils/constants'
import usePageTitle from '../utils/hooks/usePageTitle'

export const AdminLocalisations: React.FC = () => {
  usePageTitle(strings.PAGE_TITLE_LOCALISATION)
  return (
    <div>
      <h1>Localisations Management page</h1>
      not implemented
    </div>
  )
}

export const AdminPlugins: React.FC = () => {
  usePageTitle(strings.PAGE_TITLE_PLUGINS)
  return (
    <div>
      <h1>Plugin Management page </h1>
      not implemented
    </div>
  )
}

export const AdminPermissions: React.FC = () => {
  usePageTitle(strings.PAGE_TITLE_PERMISSIONS)
  return (
    <div>
      <h1>Permissions Management page</h1>
      not implemented
    </div>
  )
}

export const AdminOutcomes: React.FC = () => {
  usePageTitle(strings.PAGE_TITLE_OUTCOMES)
  return (
    <div>
      <h1>Outcome Configuration Page</h1>
      not implemented
    </div>
  )
}
