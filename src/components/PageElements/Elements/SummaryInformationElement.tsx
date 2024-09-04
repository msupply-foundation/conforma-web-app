import React from 'react'
import { SummaryViewWrapper } from '../../../formElementPlugins'
import { SummaryViewWrapperProps } from '../../../formElementPlugins/types'

const SummaryInformationElement: React.FC<SummaryViewWrapperProps> = (summaryViewProps) => (
  <div className={`response-container information`}>
    <SummaryViewWrapper {...summaryViewProps} />
  </div>
)

export default SummaryInformationElement
