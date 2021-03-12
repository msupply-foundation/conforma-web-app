import React, { useState } from 'react'
import { Form, TextArea } from 'semantic-ui-react'
import useUpdateReviewDecisionComment from '../../utils/hooks/useUpdateReviewDecisionComment'

type ReviewCommentProps = {
  initialComment: string
  reviewDecisionId: number
  isEditable: boolean
}

const ReviewComment: React.FC<ReviewCommentProps> = ({
  reviewDecisionId,
  initialComment,
  isEditable,
}) => {
  const submitComment = useUpdateReviewDecisionComment(reviewDecisionId)
  const [comment, setComment] = useState(initialComment)

  if (!isEditable) return <p>{comment}</p>

  return (
    <Form>
      <TextArea
        defaultValue={initialComment}
        onChange={(_, { value }) => setComment(String(value))}
        onBlur={() => submitComment(comment)}
      />
    </Form>
  )
}

export default ReviewComment
