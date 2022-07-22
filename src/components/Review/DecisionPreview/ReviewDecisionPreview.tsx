import React, { useState } from 'react'
import { Form, Button } from 'semantic-ui-react'
import { useLanguageProvider } from '../../../contexts/Localisation'
import { useToast } from '../../../contexts/Toast'
import useLocalisedEnums from '../../../utils/hooks/useLocalisedEnums'
import { Decision } from '../../../utils/generated/graphql'
import { FullStructure } from '../../../utils/types'
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
        applicationDataOverride={{ reviewData: { latestDecision: { decision } } }}
      />
      <Form.Field>
        <Button
          primary
          inverted
          className="wide-button"
          onClick={() => {
            if (decision === Decision.NoDecision)
              toast({
                title: strings.REVIEW_DECISION_PREVIEW_NOTHING_SELECTED_TITLE,
                text: strings.REVIEW_DECISION_PREVIEW_NOTHING_SELECTED_TITLE,
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
