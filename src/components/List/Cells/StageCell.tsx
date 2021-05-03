import React from 'react'
import { CellProps } from '../../../utils/types'
import { Stage } from '../../Review'

const StageCell: React.FC<CellProps> = ({ application }) => {
  const name = application.stage || ''
  const colour = application.stageColour || ''
  return <Stage name={name} colour={colour} />
}

export default StageCell
