import React, { ReactNode } from 'react'
import { Icon, Label } from 'semantic-ui-react'
import { LanguageStrings } from '../../contexts/Localisation'
import { User } from '../../utils/generated/graphql'
interface ReviewLabelProps {
  reviewer?: User
  message?: string
  strings: LanguageStrings
}

export const ReviewInProgressLabel: React.FC<ReviewLabelProps> = ({ reviewer, strings }) =>
  reviewer ? (
    <LabelWrapper labelContent={`${strings.REVIEW_IN_PROGRESS_BY} `} reviewer={reviewer} />
  ) : (
    <LabelWrapper
      labelContent={strings.LABEL_ASSIGNED_TO_YOU}
      iconNode={<Icon name="circle" size="tiny" color="blue" />}
      showAsRelevantInfo={true}
    />
  )

export const ReviewLockedLabel: React.FC<ReviewLabelProps> = ({ reviewer, strings }) => (
  <LabelWrapper
    labelContent={`${strings.LABEL_ASSIGNMENT_LOCKED} ${
      reviewer ? '' : strings.ASSIGNMENT_YOURSELF
    }`}
    iconNode={<Icon name="ban" size="small" color="pink" />}
    reviewer={reviewer}
  />
)

export const ReviewLabel: React.FC<ReviewLabelProps> = ({ reviewer, message, strings }) => (
  <LabelWrapper labelContent={message || strings.REVIEW_NOT_FOUND} reviewer={reviewer} />
)

export const ReviewCanMakeDecisionLabel: React.FC<ReviewLabelProps> = ({ reviewer, strings }) => {
  const doneByYourself = !reviewer
  const consolidationLabel = `${strings.LABEL_REVIEW_MAKE_DECISION_BY} ${
    doneByYourself ? strings.ASSIGNMENT_YOURSELF : ''
  }`
  return <LabelWrapper labelContent={consolidationLabel} reviewer={reviewer} />
}

export const ReviewSelfAssignmentLabel: React.FC<ReviewLabelProps> = ({ reviewer, strings }) => (
  <LabelWrapper
    labelContent={
      reviewer ? `${strings.LABEL_ASSIGNMENT_AVAILABLE} ` : strings.LABEL_ASSIGNMENT_SELF
    }
    reviewer={reviewer}
  />
)

export const ReviewByLabel: React.FC<{
  user?: User
  strings: LanguageStrings
  isSubmitted?: boolean
}> = ({ user, strings, isSubmitted = false }) => {
  const doneByYourself = !user
  const reviewLabel = `${isSubmitted ? strings.REVIEW_DONE_BY : strings.REVIEW_IN_PROGRESS_BY} ${
    doneByYourself ? strings.ASSIGNMENT_YOURSELF : ''
  }`
  return <LabelWrapper labelContent={reviewLabel} reviewer={user} />
}

export const ConsolidationByLabel: React.FC<{
  user?: User
  strings: LanguageStrings
  isSubmitted?: boolean
}> = ({ user, strings, isSubmitted = false }) => {
  const doneByYourself = !user
  const consolidationLabel = `${
    isSubmitted ? strings.CONSOLIDATION_DONE_BY : strings.CONSOLIDATION_IN_PROGRESS_BY
  } ${doneByYourself ? strings.ASSIGNMENT_YOURSELF : ''}`
  return <LabelWrapper labelContent={consolidationLabel} reviewer={user} />
}

interface LabelWrapperProps {
  reviewer?: User
  iconNode?: ReactNode
  labelContent: string
  showAsRelevantInfo?: boolean
}

const LabelWrapper: React.FC<LabelWrapperProps> = ({
  iconNode,
  labelContent,
  reviewer,
  showAsRelevantInfo = false,
}) => (
  <Label
    className={`simple-label ${showAsRelevantInfo ? 'relevant-text' : ''}`}
    icon={iconNode}
    content={
      <>
        {labelContent}
        {reviewer && <ReviewerLabel {...reviewer} />}
      </>
    }
  />
)

const ReviewerLabel: React.FC<User> = ({ firstName, lastName }) => (
  <Label className="simple-label info-text" content={`${firstName || ''} ${lastName || ''}`} />
)
