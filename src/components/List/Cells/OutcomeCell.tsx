import React from 'react'
import { CellProps } from '../../../utils/types'
import { Label, SemanticCOLORS, SemanticICONS } from 'semantic-ui-react'
import { useLanguageProvider } from '../../../contexts/Localisation'
import { ApplicationOutcome } from '../../../utils/generated/graphql'

const useOutcomeDisplayMap = () => {
  const { strings } = useLanguageProvider()
  const outcomeDisplayMap: {
    [key in ApplicationOutcome]: { icon: SemanticICONS; color: SemanticCOLORS; text: string }
  } = {
    PENDING: { icon: 'hourglass half', color: 'grey', text: '' }, // Not used
    APPROVED: { icon: 'check circle', color: 'green', text: strings.OUTCOME_APPROVED },
    REJECTED: { icon: 'cancel', color: 'pink', text: strings.OUTCOME_REJECTED },
    EXPIRED: { icon: 'time', color: 'orange', text: strings.OUTCOME_EXPIRED },
    WITHDRAWN: { icon: 'user cancel', color: 'yellow', text: strings.OUTCOME_WITHDRAWN },
  }
  return outcomeDisplayMap
}

const OutcomeCell: React.FC<CellProps> = ({ application }) => {
  const outcomeDisplayMap = useOutcomeDisplayMap()
  const { outcome } = application

  if (outcome === ApplicationOutcome.Pending || outcome === null) return null
  // Only show label if no longer in progress
  else {
    const { icon, color, text } = outcomeDisplayMap[outcome as ApplicationOutcome]
    return <Label className="stage-label" icon={icon} color={color} content={text} />
  }
}

export default OutcomeCell
