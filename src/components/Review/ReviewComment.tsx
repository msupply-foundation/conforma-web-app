import React, { useState } from 'react'
import { Form, Message, TextArea } from 'semantic-ui-react'
import strings from '../../utils/constants'
import {
  useGetReviewDecisionCommentQuery,
  useUpdateReviewDecisionCommentMutation,
} from '../../utils/generated/graphql'
import Loading from '../Loading'

type ReviewCommentProps = {
  reviewDecisionId?: number
  isEditable: boolean
}

const ReviewComment: React.FC<ReviewCommentProps> = ({ reviewDecisionId, isEditable }) => {
  const [updateComment] = useUpdateReviewDecisionCommentMutation()
  const { data, error } = useGetReviewDecisionCommentQuery({
    variables: { reviewDecisionId: reviewDecisionId as number },
    skip: !reviewDecisionId,
  })
  const [comment, setComment] = useState('')

  if (!reviewDecisionId) return null

  if (error) return <Message error title={strings.ERROR_GENERIC} list={[error]} />

  if (!data) return <Loading />

  const initialComment = data?.reviewDecision?.comment || ''

  if (!isEditable)
    return (
      <Message
        compact
        attached="bottom"
        icon="comment outline"
        header={strings.TITLE_REVIEW_COMMENT}
        content={initialComment}
      />
    )

  return (
    <Form>
      <TextArea
        defaultValue={initialComment}
        onChange={(_, { value }) => setComment(String(value))}
        onBlur={() => updateComment({ variables: { reviewDecisionId, comment } })}
      />
    </Form>
  )
}

export default ReviewComment
