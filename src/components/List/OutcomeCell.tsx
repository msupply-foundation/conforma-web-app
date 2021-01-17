import React from 'react'
import { Label } from 'semantic-ui-react'
import { CellProps } from '../../utils/types'

const OutcomeCell: React.FC<CellProps> = ({ application }) => <Label>{application.outcome}</Label>

export default OutcomeCell
