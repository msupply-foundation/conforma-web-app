import React from 'react'
import { CellProps } from '../../../utils/types'
import { Label } from 'semantic-ui-react'
import strings from '../../../utils/constants'
import { ApplicationOutcome } from '../../../utils/generated/graphql'

const OutcomeCell: React.FC<CellProps> = ({ application }) => {
  const { outcome } = application
  switch (outcome) {
    case ApplicationOutcome.Pending:
      return null
    case ApplicationOutcome.Approved:
      return <Label icon="check circle" color="green" content={strings.OUTCOME_APPROVED} />
    case ApplicationOutcome.Rejected:
      return <Label icon="cancel" color="pink" content={strings.OUTCOME_REJECTED} />
    case ApplicationOutcome.Expired:
      return <Label icon="time" color="orange" content={strings.OUTCOME_EXPIRED} />
    case ApplicationOutcome.Withdrawn:
      return <Label icon="user cancel" color="yellow" content={strings.OUTCOME_WITHDRAWN} />
  }
  return <p>{application.outcome}</p>
}

export default OutcomeCell
