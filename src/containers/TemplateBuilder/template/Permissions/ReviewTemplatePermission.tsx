import React from 'react'
import { TemplatePermission, TemplateStage } from '../../../../utils/generated/graphql'
import CheckboxIO from '../../shared/CheckboxIO'
import { useOperationState } from '../../shared/OperationContext'
import { useTemplateState, disabledMessage } from '../TemplateWrapper'

type ReviewTemplatePermissionProps = {
  templatePermission: TemplatePermission
  stage?: TemplateStage
  levelNumber: number
  isLastLevel: boolean
  singleReviewerAllSections: boolean
}

type SetAllowedSection = (sectionCode: string, isAllowed: boolean) => boolean
type SetMakeDecision = (canMakeDecision: boolean) => void
type SetSelfAssign = (canSelfAssign: boolean) => void

type SortSections = (sections: string[] | null) => string[] | null

const sortSections: SortSections = (sections) =>
  sections &&
  [...sections].sort((first, second) => (first === second ? 0 : first > second ? 1 : -1))

const ReviewTemplatePermission: React.FC<ReviewTemplatePermissionProps> = ({
  templatePermission,
  stage,
  levelNumber,
  isLastLevel,
  singleReviewerAllSections,
}) => {
  const { updateTemplate, updateTemplateStage } = useOperationState()
  const { template, sections } = useTemplateState()
  const { isDraft } = template

  const stageNumber = stage?.number ?? 1

  const sectionCodes = sections.map((section) => section?.code || '')
  const selfAssignDisabled = levelNumber > 1
  const makeDecisionDisabled = levelNumber > 1 || stageNumber === 1

  const allowedSections = sortSections(
    (templatePermission?.allowedSections ? [...templatePermission?.allowedSections] : null) as
      | string[]
      | null
  )

  const setMakeDecision: SetMakeDecision = (canMakeDecision) => {
    updateTemplate(template, {
      templatePermissionsUsingId: {
        updateById: [
          {
            id: templatePermission?.id || 0,
            patch: {
              canMakeFinalDecision: canMakeDecision,
              canSelfAssign: true,
              allowedSections: null,
            },
          },
        ],
      },
    })
  }

  const setSelfAssign: SetSelfAssign = (canSelfAssign) => {
    updateTemplate(template, {
      templatePermissionsUsingId: {
        updateById: [
          { id: templatePermission?.id || 0, patch: { canSelfAssign, allowedSections: null } },
        ],
      },
    })
  }

  const setSingleReviewer: SetSelfAssign = (value) => {
    if (!stage) return
    const level = stage?.templateStageReviewLevelsByStageId.nodes.find(
      (l) => l?.number === levelNumber
    )
    if (!level) return
    updateTemplateStage(stage.id, {
      templateStageReviewLevelsUsingId: {
        updateById: [{ id: level.id, patch: { singleReviewerAllSections: value } }],
      },
    })
  }

  const allowedSectionsDisabledMessage = !isDraft
    ? disabledMessage
    : selfAssignDisabled
    ? 'Level above one is only self assignable'
    : templatePermission?.canSelfAssign
    ? 'Self assignable review is for all sections'
    : ''

  const makeDecisionDisableMessage = !isDraft
    ? disabledMessage
    : makeDecisionDisabled
    ? 'Make decision only available for level 1 in stages higher than 1'
    : ''

  const selfAssignedDisabledMessage = !isDraft
    ? disabledMessage
    : selfAssignDisabled
    ? 'Level above one is only self assignable'
    : templatePermission?.canMakeFinalDecision
    ? 'Make final decision is always self-assignable'
    : ''

  const singleReviewerDisabledMessage = !isDraft
    ? disabledMessage
    : isLastLevel
    ? 'Always single reviewer for last level'
    : ''

  const setAllowedSection: SetAllowedSection = (sectionCode, isAllowed) => {
    const getNewSections = () => {
      if (isAllowed) {
        if (!allowedSections) return [sectionCode]
        if (allowedSections.includes(sectionCode)) return null
        return [...allowedSections, sectionCode]
      } else {
        if (!allowedSections)
          return sectionCodes.filter((_sectionCode) => _sectionCode !== sectionCode)
        if (!allowedSections.includes(sectionCode)) return allowedSections
        if (allowedSections.length === 1) return null
        const index = allowedSections.indexOf(sectionCode)
        allowedSections.splice(index, 1)
        return allowedSections
      }
    }

    const newAllowedSections = sortSections(getNewSections())
    updateTemplate(template, {
      templatePermissionsUsingId: {
        updateById: [
          {
            id: templatePermission?.id || 0,
            patch: { allowedSections: newAllowedSections },
          },
        ],
      },
    })

    if (newAllowedSections === null) return true
    return newAllowedSections.includes(sectionCode)
  }

  return (
    <div className="flex-column-start">
      <div className="flex-row-start-center">
        <CheckboxIO
          title="Self Assignable"
          setValue={(canSelfAssign) => setSelfAssign(canSelfAssign)}
          disabled={!!selfAssignedDisabledMessage}
          disabledMessage={selfAssignedDisabledMessage}
          value={!!templatePermission?.canSelfAssign}
        />
        <CheckboxIO
          title="Make Decision"
          setValue={(canMakeDecision) => setMakeDecision(canMakeDecision)}
          disabled={!!makeDecisionDisableMessage}
          disabledMessage={makeDecisionDisableMessage}
          value={!!templatePermission?.canMakeFinalDecision}
        />
        {
          <CheckboxIO
            title="Assign single reviewer to all sections"
            setValue={(singleReviewer) => setSingleReviewer(singleReviewer)}
            disabled={!!singleReviewerDisabledMessage}
            disabledMessage={singleReviewerDisabledMessage}
            value={isLastLevel ? true : singleReviewerAllSections}
          />
        }
      </div>
      <div className="flex-row-start-center-wrap">
        {sectionCodes.map((sectionCode) => (
          <CheckboxIO
            key={sectionCode}
            title={sectionCode}
            isPropUpdated={true}
            setValue={(isAllowed) => setAllowedSection(sectionCode, isAllowed)}
            disabled={!!allowedSectionsDisabledMessage}
            disabledMessage={allowedSectionsDisabledMessage}
            value={allowedSections === null || allowedSections.includes(sectionCode)}
          />
        ))}
      </div>
    </div>
  )
}

export default ReviewTemplatePermission
