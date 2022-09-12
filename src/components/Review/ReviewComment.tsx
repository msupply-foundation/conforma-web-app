import React, { useState } from 'react'
import { Form, Message, TextArea } from 'semantic-ui-react'
import { useLanguageProvider } from '../../contexts/Localisation'
import {
  useGetReviewDecisionCommentQuery,
  useUpdateReviewDecisionCommentMutation,
} from '../../utils/generated/graphql'
import Loading from '../Loading'
import Tooltip from '../Tooltip'

type ReviewCommentProps = {
  reviewDecisionId?: number
  isEditable: boolean
}

const ReviewComment: React.FC<ReviewCommentProps> = ({ reviewDecisionId, isEditable }) => {
  const { strings } = useLanguageProvider()
  const [updateComment] = useUpdateReviewDecisionCommentMutation()
  const { data, error } = useGetReviewDecisionCommentQuery({
    variables: { reviewDecisionId: reviewDecisionId as number },
    skip: !reviewDecisionId,
    fetchPolicy: 'network-only',
  })
  const [comment, setComment] = useState('')

  if (!reviewDecisionId) return null

  if (error) return <Message error title={strings.ERROR_GENERIC} list={[error]} />

  if (!data) return <Loading />

  if (!isEditable)
    return data?.reviewDecision?.comment ? (
      <Message
        compact
        attached="bottom"
        icon="comment outline"
        header={strings.TITLE_REVIEW_COMMENT}
        content={data?.reviewDecision?.comment}
      />
    ) : null

  const initialComment = data?.reviewDecision?.comment || ''
  return (
    <div>
      <p>
        <strong>{strings.LABEL_REVIEW_OVERALL_COMMENT}:</strong>
        <Tooltip message={strings.LABEL_REVIEW_OVERALL_COMMENT_TOOLTIP} />
      </p>
      <Form.Field id="review-commment-content">
        <TextArea
          defaultValue={initialComment}
          rows={4}
          onChange={(_, { value }) => setComment(String(value))}
          onBlur={() => updateComment({ variables: { reviewDecisionId, comment } })}
        />
      </Form.Field>
    </div>
  )
}

export default ReviewComment
