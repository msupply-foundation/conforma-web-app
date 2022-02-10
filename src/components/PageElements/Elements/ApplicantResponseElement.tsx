import React from 'react'
import { SummaryViewWrapper } from '../../../formElementPlugins'
import { SummaryViewWrapperProps } from '../../../formElementPlugins/types'
import { ApplicationResponse } from '../../../utils/generated/graphql'
import { UpdatedLabel } from '../PageElements'

interface ApplicantResponseElementProps {
  applicationResponse: ApplicationResponse
  summaryViewProps: SummaryViewWrapperProps
  isResponseUpdated?: boolean
}

const ApplicantResponseElement: React.FC<ApplicantResponseElementProps> = ({
  summaryViewProps,
  isResponseUpdated = false,
  children,
}) => {
  const backgroundClass = isResponseUpdated ? 'highlight-background' : ''
  return (
    <div className={`response-container ${backgroundClass}`}>
      <div className="flex-grow-1 summary-width">
        <SummaryViewWrapper {...summaryViewProps} />
      </div>
      <div className="action-container">
        {isResponseUpdated && <UpdatedLabel />}
        {children}
      </div>
    </div>
  )
}

export default ApplicantResponseElement
