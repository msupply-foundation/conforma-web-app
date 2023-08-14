import React, { ReactNode } from 'react'
import { Icon, Label } from 'semantic-ui-react'
import { TranslateMethod } from '../../contexts/Localisation'
import { User } from '../../utils/generated/graphql'
interface ReviewLabelProps {
  reviewer?: User
  message?: string
  t: TranslateMethod
}

export const ReviewInProgressLabel: React.FC<ReviewLabelProps> = ({ reviewer, t }) =>
  reviewer ? (
    <LabelWrapper labelContent={`${t('REVIEW_IN_PROGRESS_BY')} `} reviewer={reviewer} />
  ) : (
    <LabelWrapper
      labelContent={t('LABEL_ASSIGNED_TO_YOU')}
      iconNode={<Icon name="circle" size="tiny" color="blue" />}
      showAsRelevantInfo={true}
    />
  )

export const ReviewLockedLabel: React.FC<ReviewLabelProps> = ({ reviewer, t }) => (
  <LabelWrapper
    labelContent={`${t('LABEL_ASSIGNMENT_LOCKED')} ${reviewer ? '' : t('ASSIGNMENT_YOURSELF')}`}
    iconNode={<Icon name="ban" size="small" color="pink" />}
    reviewer={reviewer}
  />
)

export const ReviewLabel: React.FC<ReviewLabelProps> = ({ reviewer, message, t }) => (
  <LabelWrapper labelContent={message || t('REVIEW_NOT_FOUND')} reviewer={reviewer} />
)

export const ReviewCanMakeDecisionLabel: React.FC<ReviewLabelProps> = ({ reviewer, t }) => {
  const doneByYourself = !reviewer
  const consolidationLabel = `${t('LABEL_REVIEW_MAKE_DECISION_BY')} ${
    doneByYourself ? t('ASSIGNMENT_YOURSELF') : ''
  }`
  return <LabelWrapper labelContent={consolidationLabel} reviewer={reviewer} />
}

export const ReviewSelfAssignmentLabel: React.FC<ReviewLabelProps> = ({ reviewer, t }) => (
  <LabelWrapper
    labelContent={reviewer ? `${t('LABEL_ASSIGNMENT_AVAILABLE')} ` : t('LABEL_ASSIGNMENT_SELF')}
    reviewer={reviewer}
  />
)

export const ReviewByLabel: React.FC<{
  user?: User
  t: TranslateMethod
  isSubmitted?: boolean
}> = ({ user, t, isSubmitted = false }) => {
  const doneByYourself = !user
  const reviewLabel = `${isSubmitted ? t('REVIEW_DONE_BY') : t('REVIEW_IN_PROGRESS_BY')} ${
    doneByYourself ? t('ASSIGNMENT_YOURSELF') : ''
  }`
  return <LabelWrapper labelContent={reviewLabel} reviewer={user} />
}

export const ConsolidationByLabel: React.FC<{
  user?: User
  t: TranslateMethod
  isSubmitted?: boolean
}> = ({ user, t, isSubmitted = false }) => {
  const doneByYourself = !user
  const consolidationLabel = `${
    isSubmitted ? t('CONSOLIDATION_DONE_BY') : t('CONSOLIDATION_IN_PROGRESS_BY')
  } ${doneByYourself ? t('ASSIGNMENT_YOURSELF') : ''}`
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
