import React from 'react'
import { CellProps } from '../../../utils/types'
import getSimplifiedTimeDifference from '../../../utils/dateAndTime/getSimplifiedTimeDifference'

const LastActiveDateCell: React.FC<CellProps> = ({ application }) => {
  return (
    <p className="slightly-smaller-text">
      {getSimplifiedTimeDifference(application.lastActiveDate)}
    </p>
  )
}
export default LastActiveDateCell
