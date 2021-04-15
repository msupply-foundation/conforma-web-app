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
    fetchPolicy: 'network-only',
  })
  const [comment, setComment] = useState('')

  if (!reviewDecisionId) return null

  if (error) return <Message error title={strings.ERROR_GENERIC} list={[error]} />

  if (!data) return <Loading />

  if (!isEditable)
    return data?.reviewDecision?.comment ? (
      <Message
        style={inlineStyles.message}
        attached="bottom"
        icon="comment outline"
        header={strings.TITLE_REVIEW_COMMENT}
        content={data?.reviewDecision?.comment}
      />
    ) : null

  const initialComment = data?.reviewDecision?.comment || ''
  return (
    <Form style={inlineStyles.form}>
      <TextArea
        style={inlineStyles.commentArea}
        rows="1"
        fluid
        placeHolder={strings.LABEL_REVIEW_OVERALL_COMMENT}
        defaultValue={initialComment}
        onChange={(_, { value }) => setComment(String(value))}
        onBlur={() => updateComment({ variables: { reviewDecisionId, comment } })}
      />
    </Form>
  )
}

// Styles - TODO: Move to LESS || Global class style (semantic)
const inlineStyles = {
  message: {
    // Showing too big on mobile
    margin: '10px 20px 10px',
  },
  form: {
    // Showing too big on mobile
    width: 500,
    margin: '10px 20px 10px',
  },
  commentArea: {
    marginLeft: 10,
    resize: 'none',
  },
}

export default ReviewComment
