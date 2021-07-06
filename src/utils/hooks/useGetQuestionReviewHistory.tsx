import { useEffect, useState } from 'react'
import {
  Review,
  ReviewResponseDecision,
  TemplateElement,
  useGetHistoryForApplicantQuery,
  useGetHistoryForReviewerQuery,
  User,
} from '../generated/graphql'
import { HistoryElement } from '../types'
import strings from '../constants'

interface UseGetQuestionHistoryProps {
  serial: string
  templateCode: string
  questionCode: string
  userId: number
  // userLevel: number
  isApplicant: boolean
}

interface ResponsesByStage {
  [stage: string]: HistoryElement[]
}

interface ResponsesByStageByDate {
  [stage: string]: {
    [date: string]: HistoryElement
  }
}

const useGetQuestionReviewHistory = ({ isApplicant, ...variables }: UseGetQuestionHistoryProps) => {
  const [historyList, setHistoryList] = useState<ResponsesByStage>({})
  const { data, error, loading } = isApplicant
    ? useGetHistoryForApplicantQuery({ variables })
    : useGetHistoryForReviewerQuery({ variables })

  useEffect(() => {
    if (!data) return
    // Organise ReviewResponse and Applicant Responses from latest to oldest
    const { applicationResponses, reviewResponses } =
      data?.templateElementByTemplateCodeAndCodeAndTemplateVersion as TemplateElement

    const allResponsesByStage: ResponsesByStageByDate = {}

    applicationResponses.nodes.forEach((applicantResponse) => {
      if (!applicantResponse) return
      const { timeUpdated, application, value } = applicantResponse
      const stageNumber = application?.stageNumber as number
      const { firstName, lastName } = application?.user as User

      if (!allResponsesByStage[stageNumber]) allResponsesByStage[stageNumber] = {}

      // Set each entry using HistoryElement values
      allResponsesByStage[stageNumber][timeUpdated] = {
        author: firstName || '' + ' ' + lastName || '',
        title: strings.TITLE_HISTORY_SUBMITTED_BY_APPLICANT,
        message: value.text,
        timeUpdated,
      }
    })

    reviewResponses.nodes.forEach((reviewResponse) => {
      if (!reviewResponse) return
      const { timeUpdated, decision, comment, review } = reviewResponse
      const { levelNumber, reviewer } = review as Review
      const stageNumber = review?.stageNumber as number
      const { id, firstName, lastName } = reviewer as User

      if (!allResponsesByStage[stageNumber]) allResponsesByStage[stageNumber] = {}

      // Set each entry using HistoryElement values
      allResponsesByStage[stageNumber][timeUpdated] = {
        author: firstName || '' + ' ' + lastName || '',
        title:
          (levelNumber || 1) > 1
            ? strings.TITLE_HISTORY_CONSOLIDATION
            : strings.TITLE_HISTORY_REVIEW,
        message: decision as ReviewResponseDecision, // TODO: Localisation
        timeUpdated,
        reviewerComment: comment || '',
      }
    })

    // Order by latest per stage
    const allResponseByStageOrdered: ResponsesByStage = {}

    Object.entries(allResponsesByStage).map(([stage, elements]) => {
      allResponseByStageOrdered[stage] = []
      Object.keys(elements)
        .sort()
        .reverse()
        .forEach((key) => allResponseByStageOrdered[stage].push(allResponsesByStage[stage][key]))
    })

    setHistoryList(allResponseByStageOrdered)

    // Find stages - Maybe done straight into HistoryPanel - or have in HistoryStructure?
  }, [data])

  return {
    error,
    loading,
    historyList,
  }
}

export default useGetQuestionReviewHistory
