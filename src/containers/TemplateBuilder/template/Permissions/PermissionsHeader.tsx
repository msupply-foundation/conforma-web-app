import React, { useState } from 'react'
import { Header } from 'semantic-ui-react'
import { PermissionPolicyType, TemplatePermission } from '../../../../utils/generated/graphql'
import DropdownIO from '../../shared/DropdownIO'
import { IconButton } from '../../shared/IconButton'
import { useOperationState } from '../../shared/OperationContext'
import { useTemplateState, disabledMessage } from '../TemplateWrapper'
import { usePermissionNameState } from './PermissionNamesContext'

type PermissionsHeaderProps = {
  type: PermissionPolicyType
  header: string
  stageNumber?: number
  levelNumber?: number
  labelNegative?: boolean
}

type GetMatchingTemplatePermissions = (props: {
  templatePermissions: TemplatePermission[]
  stageNumber?: number
  levelNumber?: number
  type: PermissionPolicyType
}) => TemplatePermission[]

export const getMatchingTemplatePermission: GetMatchingTemplatePermissions = ({
  templatePermissions,
  type,
  levelNumber,
  stageNumber,
}) =>
  templatePermissions.filter((templatePermission) => {
    if (templatePermission.permissionName?.permissionPolicy?.type !== type) return false
    if (!stageNumber || !templatePermission?.stageNumber) return true
    if (templatePermission?.stageNumber !== stageNumber) return false
    if (!levelNumber) return true
    return templatePermission?.levelNumber === levelNumber
  })

const PermissionsHeader: React.FC<PermissionsHeaderProps> = ({
  type,
  header,
  stageNumber,
  levelNumber,
  labelNegative,
}) => {
  const [selectedPermissionNameId, setSelectedPermissionNameId] = useState(-1)
  const { template, templatePermissions } = useTemplateState()
  const { updateTemplate } = useOperationState()
  const { permissionNames } = usePermissionNameState()
  const { canEdit } = template

  const matchingTemplatePermissions = getMatchingTemplatePermission({
    type,
    stageNumber,
    templatePermissions,
    levelNumber,
  })

  const availablePermissionNames = permissionNames[type].filter(
    (permissionName) =>
      !matchingTemplatePermissions.find(
        (templatePermission) => permissionName?.id === templatePermission?.permissionName?.id
      )
  )

  const addPermission = async () => {
    await updateTemplate(template, {
      templatePermissionsUsingId: {
        create: [
          {
            permissionNameId: selectedPermissionNameId,
            stageNumber,
            levelNumber,
            canSelfAssign: true,
          },
        ],
      },
    })
    setSelectedPermissionNameId(-1)
  }

  return (
    <div className="flex-row-start-center">
      <Header as="h5" className="no-margin-no-padding right-margin-space-10">
        {header}
      </Header>
      <DropdownIO
        title="Permission Name"
        isPropUpdated={true}
        value={selectedPermissionNameId}
        getKey={'id'}
        getValue={'id'}
        getText={'name'}
        disabled={!canEdit}
        labelNegative={labelNegative}
        placeholder={
          availablePermissionNames.length === 0
            ? 'No Permission Names Available'
            : 'Select Permission Name To Add'
        }
        disabledMessage={disabledMessage}
        setValue={(value) => {
          setSelectedPermissionNameId(Number(value))
        }}
        options={availablePermissionNames}
      />
      {selectedPermissionNameId !== -1 && (
        <IconButton
          name="add square"
          onClick={addPermission}
          disabled={!canEdit}
          disabledMessage={disabledMessage}
        />
      )}
    </div>
  )
}

export default PermissionsHeader
