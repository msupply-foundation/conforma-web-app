import React from 'react'
import { Segment } from 'semantic-ui-react'
import { CellProps } from '../../../utils/types'

const OutcomeCell: React.FC<CellProps> = ({ application }) => <p>{application.outcome}</p>

export default OutcomeCell
