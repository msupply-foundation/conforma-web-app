import React from 'react'
import { Header } from 'semantic-ui-react'
import { Loading } from '../../components'
import ReviewPage from '../../containers/Review/ReviewPage'
import useGetFullReviewStructure from '../../utils/hooks/useGetFullReviewStructure'
import { FullStructure } from '../../utils/types'

const ReviewPageWrapperTest: React.FC<{ structure: FullStructure }> = ({ structure }) => {
  return <ReviewPage structure={structure} reviewAssignmentId={1020} />
}

const ReviewPageTest: React.FC<{
  reviewAssignmentId: number
  structure: FullStructure
}> = ({ reviewAssignmentId, structure }) => {
  const { fullStructure, error } = useGetFullReviewStructure({ reviewAssignmentId, structure })

  if (error) return <Header>Error</Header>
  if (!fullStructure) return <Loading />
  return <pre>{JSON.stringify(fullStructure, null, '  ')}</pre>
}

export default ReviewPageWrapperTest
