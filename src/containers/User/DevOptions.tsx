import React from 'react'
import { Dropdown, Menu } from 'semantic-ui-react'
import { AppMenu } from '../../components'
import { useUserState } from '../../contexts/UserState'
import useListTemplates from '../../utils/hooks/useListTemplates'
import UserSelection from './UserSelection'

const DevOptions: React.FC = () => {
  const {
    userState: { isLoading, templatePermissions },
  } = useUserState()

  const { filteredTemplates } = useListTemplates(templatePermissions, isLoading)
  return (
    <Menu vertical size="tiny" fixed="right" floated="right" style={{ zIndex: 0 }}>
      <Dropdown item icon="user">
        <UserSelection />
      </Dropdown>
      <Dropdown item icon="map">
        <AppMenu templatePermissions={filteredTemplates} />
      </Dropdown>
    </Menu>
  )
}

export default DevOptions
