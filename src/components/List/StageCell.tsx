import React from 'react'
import { Label } from 'semantic-ui-react'
import { CellProps } from '../../utils/types'

const StageCell: React.FC<CellProps> = ({ application }) => {
  const { stage } = application
  if (stage) {
    return <Label>{stage.name}</Label>
  }
  return null
}

export default StageCell
