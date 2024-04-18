import React, { useState } from 'react'
import {
  PermissionName,
  PermissionPolicyType,
  TemplateStage,
  TemplateStageReviewLevel,
} from '../../../../utils/generated/graphql'

import { IconButton } from '../../shared/IconButton'
import { useOperationState } from '../../shared/OperationContext'

import TextIO from '../../shared/TextIO'
import { disabledMessage, useTemplateState } from '../TemplateWrapper'
import PermissionNameInfo from './PermissionNameInfo/PermissionNameInfo'
import { getMatchingTemplatePermission } from './PermissionsHeader'
import ReviewTemplatePermission from './ReviewTemplatePermission'

type PermissionNameListProps = {
  type: PermissionPolicyType
  stageNumber?: number
  levelNumber?: number
  stage?: TemplateStage
  reviewLevel?: TemplateStageReviewLevel
}

const PermissionNameList: React.FC<PermissionNameListProps> = ({
  type,
  // stageNumber,
  // levelNumber,
  stage,
  reviewLevel,
}) => {
  const { template, templatePermissions, templateStages } = useTemplateState()
  const { updateTemplate } = useOperationState()
  const [permissionNameInfo, setPermissionNameInfo] = useState<PermissionName | null>(null)
  const { canEdit } = template

  const stageNumber = stage?.number ?? 1
  const levelNumber = reviewLevel?.number

  const removeTemplatePermission = (id: number) => {
    updateTemplate(template, { templatePermissionsUsingId: { deleteById: [{ id }] } })
  }
  return (
    <div className="flex-column-start-stretch">
      {getMatchingTemplatePermission({ type, stageNumber, templatePermissions, levelNumber }).map(
        (templatePermission) => (
          <div key={templatePermission?.id} className="config-container">
            <div className="flex-row-start-center">
              <TextIO
                title="Permission Name"
                text={templatePermission?.permissionName?.name || ''}
                icon="info circle"
                iconColor="blue"
                onIconClick={() =>
                  setPermissionNameInfo(templatePermission?.permissionName as PermissionName)
                }
              />
              <TextIO
                title="Permission Policy"
                text={templatePermission?.permissionName?.permissionPolicy?.name || ''}
              />
              <IconButton
                name="window close"
                disabled={!canEdit}
                disabledMessage={disabledMessage}
                onClick={() => removeTemplatePermission(templatePermission?.id || 0)}
              />
            </div>
            {type === PermissionPolicyType.Review && levelNumber && (
              <ReviewTemplatePermission
                templatePermission={templatePermission}
                stage={stage}
                levelNumber={levelNumber}
                isLastLevel={levelNumber === stage?.templateStageReviewLevelsByStageId.nodes.length}
                singleReviewerAllSections={reviewLevel?.singleReviewerAllSections ?? false}
              />
            )}
          </div>
        )
      )}
      <PermissionNameInfo
        permissionName={permissionNameInfo}
        onClose={() => setPermissionNameInfo(null)}
      />
    </div>
  )
}

export default PermissionNameList
