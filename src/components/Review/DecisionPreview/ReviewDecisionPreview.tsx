import React, { useState } from 'react'
import { Form, Button } from 'semantic-ui-react'
import { useLanguageProvider } from '../../../contexts/Localisation'
import { useToast } from '../../../contexts/Toast'
import useLocalisedEnums from '../../../utils/hooks/useLocalisedEnums'
import { Decision } from '../../../utils/generated/graphql'
import { FullStructure, ReviewDetails } from '../../../utils/types'
import ReviewPreviewModal from './ReviewPreviewModal'

interface ReviewDecisionProps {
  structure: FullStructure
  decision: Decision
}

export const ReviewDecisionPreview: React.FC<ReviewDecisionProps> = ({
  structure: { thisReview },
  decision,
}) => {
  const { strings } = useLanguageProvider()
  const { Decision: LocalisedDecision } = useLocalisedEnums()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const toast = useToast()

  return (
    <>
      <ReviewPreviewModal
        open={isModalOpen}
        setOpen={setIsModalOpen}
        reviewId={thisReview?.id as number}
        decision={LocalisedDecision[decision]}
        previewData={getPreviewData(decision, thisReview as ReviewDetails)}
      />
      <Form.Field>
        <Button
          primary
          inverted
          className="wide-button"
          onClick={() => {
            if (decision === Decision.NoDecision)
              toast({
                title: 'No decision selected',
                text: 'You must select a decision before you can preview the output',
                style: 'error',
              })
            else setIsModalOpen(true)
          }}
          content={strings.BUTTON_PREVIEW_DECISION}
        />
      </Form.Field>
    </>
  )
}

const getPreviewData = (decision: Decision, review: ReviewDetails) => {
  console.log('preview', { reviewData: { latestDecision: { decision } } })
  return { reviewData: { latestDecision: { decision } } }
}
