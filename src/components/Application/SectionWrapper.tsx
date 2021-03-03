import React from 'react'
import { ElementStateNEW, ResponsesByCode } from '../../utils/types'

interface SectionProps {
  [key: string]: any
}

const SectionWrapper: React.FC<SectionProps> = ({
  elements,
  responsesByCode,
  isStrictPage,
  isEditable,
  isReview,
}) => {
  return <p>Section goes here</p>
}

export default SectionWrapper
