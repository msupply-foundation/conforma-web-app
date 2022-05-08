import React, { useState } from 'react'

import { Header, Modal } from 'semantic-ui-react'
import { Loading } from '../../../../../components'
import {
  PermissionJoin,
  PermissionName,
  PermissionPolicy,
  PostgresRowLevel,
  TemplateAction,
  TemplateElement,
  TemplatePermission,
  TemplateStatus,
  useGetPermissionStatisticsQuery,
} from '../../../../../utils/generated/graphql'
import ButtonWithFallback from '../../../shared/ButtonWidthFallback'
import CheckboxIO from '../../../shared/CheckboxIO'
import {
  PermissionActionInfo,
  PermissionUserAndOrganisationInfo,
  TemplateElementInfo,
  TemplatePermissionInfo,
} from './InfoComponents'

import PermissionPolicyInfo from './PermissionPolicyInfo'

type PermissionNameInfoProps = {
  permissionName: PermissionName | null
  onClose: () => void
}

const PermissionNameInfoWrapper: React.FC<PermissionNameInfoProps> = (props) => {
  if (!props.permissionName) return null

  return <PermissionNameInfo {...props} />
}

export const stringSort = (s1: string, s2: string) => (s1 === s2 ? 0 : s1 > s2 ? 1 : -1)

const PermissionNameInfo: React.FC<PermissionNameInfoProps> = ({ permissionName, onClose }) => {
  const name = permissionName?.name || ''
  const { data } = useGetPermissionStatisticsQuery({
    variables: {
      id: permissionName?.id || 0,
      name,
      rowLeveSearch: `pp${permissionName?.permissionPolicy?.id}`,
    },
  })
  const [showInactiveTemplates, setShowInactiveTemplates] = useState(false)

  const permissionJoins = data?.permissionName?.permissionJoins?.nodes || []
  const templateActions = [...(data?.templateActions?.nodes || [])].sort((ta1, ta2) =>
    stringSort(ta1?.template?.name || '', ta2?.template?.name || '')
  )
  const templateElements = [...(data?.templateElements?.nodes || [])].sort((te1, te2) =>
    stringSort(te1?.section?.template?.name || '', te2?.section?.template?.name || '')
  )
  const rowLevelPolicies = (data?.postgresRowLevels?.nodes as PostgresRowLevel[]) || []
  const templatePermissions = [...(data?.permissionName?.templatePermissions?.nodes || [])].sort(
    (tp1, tp2) => stringSort(tp1?.template?.name || '', tp2?.template?.name || '')
  )

  return (
    <Modal open={true} onClose={onClose} className="config-modal">
      {!data && <Loading />}
      {data && (
        <div className="config-modal-container">
          <Header as="h1"> {`Statistics for ${name}`} </Header>
          <div className="flex-column-start-center">
            <div className="flex-column-start-stretch" style={{ marginBottom: 20 }}>
              <Header as="h2">Users and Organisations</Header>
              {permissionJoins.length === 0 &&
                'Permission name is not linked to any users or user-organisations'}
              {permissionJoins.map((permissionJoin) => (
                <PermissionUserAndOrganisationInfo
                  key={permissionJoin?.id}
                  permissionJoin={permissionJoin as PermissionJoin}
                />
              ))}
            </div>
            <div className="flex-column-start-stretch">
              <div className="flex-row-space-between">
                <Header as="h2">Linked Templates</Header>
                <CheckboxIO
                  value={!showInactiveTemplates}
                  title="Show active templates only"
                  setValue={(current) => setShowInactiveTemplates(!current)}
                />
              </div>
              {templatePermissions.length === 0 && 'Permission name is not used by any templates'}
              {templatePermissions
                .filter(
                  (templatePermission) =>
                    showInactiveTemplates ||
                    templatePermission?.template?.status === TemplateStatus.Available
                )
                .map((templatePermission) => (
                  <TemplatePermissionInfo
                    key={templatePermission?.id}
                    templatePermission={templatePermission as TemplatePermission}
                  />
                ))}
              <Header as="h2">Template Actions</Header>
              {templateActions.length === 0 &&
                'Permission name is not directly referenced in any actions'}
              {templateActions
                .filter(
                  (templateAction) =>
                    showInactiveTemplates ||
                    templateAction?.template?.status === TemplateStatus.Available
                )
                .map((templateAction) => (
                  <PermissionActionInfo
                    key={templateAction?.id}
                    templateAction={templateAction as TemplateAction}
                  />
                ))}
              <Header as="h2">Template Elements</Header>
              {templateElements.length === 0 &&
                'Permission name is not directly referenced in any template elements'}
              {templateElements.map((templateElement) => (
                <TemplateElementInfo
                  key={templateElement?.id}
                  templateElement={templateElement as TemplateElement}
                />
              ))}
              <Header as="h2">Permission Policy</Header>
              <PermissionPolicyInfo
                permissionPolicy={permissionName?.permissionPolicy as PermissionPolicy}
                rowLevelPolicies={rowLevelPolicies}
              />
            </div>
          </div>
          <div className="spacer-10" />
          <ButtonWithFallback title="close" onClick={onClose} />
        </div>
      )}
    </Modal>
  )
}

export default PermissionNameInfoWrapper
