import React from 'react'
import { Icon, SemanticICONS } from 'semantic-ui-react'
import { FullStructure } from '../../utils/types'
// @ts-ignore -- no types provided
import { Stepper, Step, StepTitle } from 'react-progress-stepper'
import { ApplicationOutcome } from '../../utils/generated/graphql'

const ReviewProgress: React.FC<{
  structure: FullStructure
}> = ({ structure: fullStructure }) => {
  const {
    stages,
    info: {
      outcome,
      current: { stage: currentStage },
    },
  } = fullStructure

  const [currentStageClass, currentStageIcon]: [string, SemanticICONS] =
    outcome === ApplicationOutcome.Rejected ? ['rejected', 'remove'] : ['', 'circle']

  const steps = [
    <Step key="first">
      <StepTitle>Submitted</StepTitle>
    </Step>,
    ...stages.map((stage) =>
      stage.number === currentStage.number ? (
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
        <Stepper id="stepper" step={currentStage.number} numbered={false}>
          {steps}
        </Stepper>
      </div>
    </div>
  )
}

export default ReviewProgress
