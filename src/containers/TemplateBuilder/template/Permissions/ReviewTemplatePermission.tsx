import React from 'react'
import { TemplatePermission } from '../../../../utils/generated/graphql'
import CheckboxIO from '../../shared/CheckboxIO'
import { useOperationState } from '../../shared/OperationContext'
import { useTemplateState, disabledMessage } from '../TemplateWrapper'

type ReviewTemplatePermssionProps = {
  templatePermission: TemplatePermission
  stageNumber?: number
  levelNumber: number
}

type SetAllowedSection = (sectionCode: string, isAllowed: boolean) => boolean
type SetMakeDecision = (canMakeDecision: boolean) => void
type SetSelfAssign = (canSelfAssign: boolean) => void

type SortSections = (sections: string[] | null) => string[] | null

const sortSections: SortSections = (sections) =>
  sections &&
  [...sections].sort((first, second) => (first === second ? 0 : first > second ? 1 : -1))

const ReviewTemplatePermission: React.FC<ReviewTemplatePermssionProps> = ({
  templatePermission,
  stageNumber = 1,
  levelNumber,
}) => {
  const { updateTemplate } = useOperationState()
  const { template, sections } = useTemplateState()
  const { isDraft } = template

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

  const allowedSectionsDisabledMessage = !isDraft
    ? disabledMessage
    : selfAssignDisabled
    ? 'Level above one is only self assignable'
    : templatePermission?.canSelfAssign
    ? 'Self assignable review is for all sections'
    : ''

  const makeDecisionDisbaleMessage = !isDraft
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
          disabled={!!makeDecisionDisbaleMessage}
          disabledMessage={makeDecisionDisbaleMessage}
          value={!!templatePermission?.canMakeFinalDecision}
        />
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
