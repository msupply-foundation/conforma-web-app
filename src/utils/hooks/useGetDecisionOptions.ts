import { useState, useEffect } from 'react'
import { Decision, ReviewStatus } from '../generated/graphql'
import { TranslateMethod, useLanguageProvider } from '../../contexts/Localisation'
import { DecisionOption, ReviewAssignment, ReviewDetails } from '../types'

const getInitialDecisionOptions = (
  t: TranslateMethod,
  canApplicantMakeChanges: boolean
): DecisionOption[] => {
  let availableOptions = [
    {
      code: Decision.NonConform,
      title: t('DECISION_NON_CONFORM'),
      isVisible: false,
      value: false,
    },
    {
      code: Decision.Conform,
      title: t('DECISION_CONFORM'),
      isVisible: false,
      value: false,
    },
    {
      code: Decision.ChangesRequested,
      title: t('DECISION_CHANGES_REQUESTED'),
      isVisible: false,
      value: false,
    },
  ]

  // Only display LOQ options if template is interactive with Applicant
  if (canApplicantMakeChanges)
    availableOptions.push({
      code: Decision.ListOfQuestions,
      title: t('DECISION_LIST_OF_QUESTIONS'),
      isVisible: false,
      value: false,
    })

  return availableOptions
}

// hook used to manage state of options shown in review submit, as per type definition below
type UseGetDecisionOptions = (
  canApplicantMakeChanges: boolean,
  assignment?: ReviewAssignment,
  thisReview?: ReviewDetails | null
) => {
  decisionOptions: DecisionOption[]
  getDecision: () => Decision
  setDecision: (decision: Decision) => void
  getAndSetDecisionError: () => boolean // may set decision error, which is reset automatically
  isDecisionError: boolean
}

const useGetDecisionOptions: UseGetDecisionOptions = (
  canApplicantMakeChanges,
  assignment,
  thisReview
) => {
  const { t } = useLanguageProvider()
  const { isLastLevel, isMakeDecision, canSubmitReviewAs } = assignment as ReviewAssignment
  const [decisionOptions, setDecisionOptions] = useState<DecisionOption[]>(
    getInitialDecisionOptions(t, canApplicantMakeChanges)
  )
  const [isDecisionError, setIsDecisionError] = useState(false)

  const isDraft = thisReview?.current.reviewStatus === ReviewStatus.Draft
  const decisionInStructure = thisReview?.reviewDecision?.decision || Decision.NoDecision
  const reviewerNeedsToMakeDecision = isLastLevel || (thisReview?.level || 0) > 1

  useEffect(() => {
    setIsDecisionError(false)
    const updatedOptions = decisionOptions.map(({ code, title }) => {
      let isVisible = false
      let value = false
      // if review is NOT DRAFT then use decision from DB (and make it the only one visible)
      if (!isDraft) isVisible = value = code === decisionInStructure
      else if (isMakeDecision) {
        isVisible = code === Decision.NonConform || code === Decision.Conform
        value = false
      }
      // if review IS DRAFT, can can submit review with non conform decision and reviewer has
      // ability to make a decsion, present them with NonConform or LOQ, both unchecked
      else if (canSubmitReviewAs === Decision.NonConform && reviewerNeedsToMakeDecision) {
        isVisible = code === Decision.NonConform || code === Decision.ListOfQuestions
        value = false
      }
      // if review IS DRAFT and other then non conform decision or reviewer can't make a decision
      // then use computed decision for the state of review
      else isVisible = value = code === canSubmitReviewAs

      return {
        code,
        title,
        isVisible,
        value,
      }
    })
    setDecisionOptions(updatedOptions)
  }, [canSubmitReviewAs, thisReview])

  const getDecision = () =>
    decisionOptions.find((option) => option.value)?.code || Decision.NoDecision

  const setDecision = (decision: Decision) => {
    if (decision === Decision.NonConform || decision == Decision.ListOfQuestions)
      setIsDecisionError(false)
    setDecisionOptions(
      decisionOptions.map((option) => ({ ...option, value: option.code === decision }))
    )
  }

  const getAndSetDecisionError = () => {
    if (!reviewerNeedsToMakeDecision) return false
    const isDecisionError =
      canSubmitReviewAs === Decision.NonConform && getDecision() === Decision.NoDecision

    setIsDecisionError(isDecisionError)
    return isDecisionError
  }

  return { decisionOptions, getDecision, setDecision, getAndSetDecisionError, isDecisionError }
}

export default useGetDecisionOptions
