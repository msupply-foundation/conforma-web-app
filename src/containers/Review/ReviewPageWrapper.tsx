import React, { useEffect, useState } from 'react'
import { useRouter } from '../../utils/hooks/useRouter'

const ReviewPageWrapper: React.FC = () => {
  // Page will present the list of visible questions in Summary view, with additional "Reviewing" controls beneath each question.
  // Will also need to useGetTriggers hook to wait until Review(Assignment) and Application records have Null triggers before loading

  const {
    params: { serialNumber, reviewId },
  } = useRouter()

  return (
    <div>
      <p>
        This is the Review page for Review ID#{reviewId} of Application {serialNumber}
      </p>
    </div>
  )
}

export default ReviewPageWrapper
