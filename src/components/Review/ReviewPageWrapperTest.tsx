import React from 'react'
import { Header } from 'semantic-ui-react'
import { Loading } from '../../components'
import ReviewPage from '../../containers/Review/ReviewPage'
import { ReviewAssignment, useGetReviewAssingmentTestQuery } from '../../utils/generated/graphql'
import useGetFullReviewStructure from '../../utils/hooks/useGetFullReviewStructure'
import { FullStructure } from '../../utils/types'

const ReviewPageWrapperTest: React.FC<{ structure: FullStructure }> = ({ structure }) => {
  const { data, error } = useGetReviewAssingmentTestQuery({ variables: { id: 1020 } })

  if (!data) return null

  const reviewAssignment = data.reviewAssignment

  if (!reviewAssignment) return null

  return <ReviewPage structure={structure} reviewAssignment={reviewAssignment} />
}

const ReviewPageTest: React.FC<{
  reviewAssignment: ReviewAssignment
  structure: FullStructure
}> = ({ reviewAssignment, structure }) => {
  const { fullStructure, error } = useGetFullReviewStructure({ reviewAssignment, structure })

  if (error) return <Header>Error</Header>
  if (!fullStructure) return <Loading />
  return <pre>{JSON.stringify(fullStructure, null, '  ')}</pre>
}

export default ReviewPageWrapperTest
