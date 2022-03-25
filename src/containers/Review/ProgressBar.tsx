import React from 'react'
import { Icon, SemanticICONS } from 'semantic-ui-react'
import { FullStructure } from '../../utils/types'
import { useLanguageProvider } from '../../contexts/Localisation'
// @ts-ignore -- no types provided
import { Stepper, Step, StepTitle } from 'react-progress-stepper'
import { ApplicationOutcome, ApplicationStatus } from '../../utils/generated/graphql'

const ReviewProgress: React.FC<{
  structure: FullStructure
}> = ({ structure: fullStructure }) => {
  const { strings } = useLanguageProvider()
  const {
    stages,
    info: {
      outcome,
      current: { stage: currentStage, status },
    },
  } = fullStructure

  const [currentStageClass, currentStageIcon]: [string, SemanticICONS] =
    outcome === ApplicationOutcome.Rejected
      ? ['rejected', 'remove']
      : status === ApplicationStatus.ChangesRequired
      ? ['loq', 'circle']
      : ['', 'circle']

  const isApproved = outcome === ApplicationOutcome.Approved

  const steps = [
    <Step key="first">
      <StepTitle>{strings.REVIEW_PROGRESS_BAR_SUBMITTED}</StepTitle>
    </Step>,
    ...stages.map(({ stage }) =>
      stage.number === currentStage.number && !isApproved ? (
        <Step
          key={stage.name}
          customContent={() => (
            <div className={`step-custom-content ${currentStageClass}`}>
              <Icon name={currentStageIcon} />
            </div>
          )}
        >
          <StepTitle>{stage.name}</StepTitle>
        </Step>
      ) : (
        <Step key={stage.name}>
          <StepTitle>{stage.name}</StepTitle>
        </Step>
      )
    ),
  ]

  return (
    <div id="review-progress">
      <div id="stepper-wrapper">
        <Stepper id="stepper" step={currentStage.number + Number(isApproved)} numbered={false}>
          {steps}
        </Stepper>
      </div>
    </div>
  )
}

export default ReviewProgress
