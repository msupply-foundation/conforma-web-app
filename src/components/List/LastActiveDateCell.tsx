import React from 'react'
import { CellProps } from '../../utils/types'

const LastActiveDateCell: React.FC<CellProps> = ({ application }) => {
  const { stage } = application
  if (stage) {
    return <p>{stage.date}</p>
  }
  return null
}
export default LastActiveDateCell
