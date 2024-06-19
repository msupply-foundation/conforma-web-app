import { useEffect, useState } from 'react'
import {
  TemplateElement,
  useGetHistoryForApplicantQuery,
  useGetHistoryForReviewerQuery,
  UserList as User,
} from '../generated/graphql'
import { HistoryElement } from '../types'
import { useLanguageProvider } from '../../contexts/Localisation'
import useLocalisedEnums from './useLocalisedEnums'

interface UseGetQuestionHistoryProps {
  serial: string
  templateCode: string
  templateVersionId: string
  questionCode: string
  userId: number
  // userLevel: number
  isApplicant: boolean
}

type HistoryElementsByStage = StageHistoryElements[]

interface StageHistoryElements {
  stageNumber: number
  historyElements: HistoryElement[]
}

interface ResponsesByStage {
  [stage: string]: HistoryElement[]
}

const useGetQuestionReviewHistory = ({ isApplicant, ...variables }: UseGetQuestionHistoryProps) => {
  const { t } = useLanguageProvider()
  const { ReviewResponse } = useLocalisedEnums()
  const [historyList, setHistoryList] = useState<HistoryElementsByStage>([])
  const { data, error, loading } = isApplicant
    ? useGetHistoryForApplicantQuery({ variables })
    : useGetHistoryForReviewerQuery({ variables })

  useEffect(() => {
    if (!data) return
    // Organise ReviewResponse and Applicant Responses from latest to oldest
    const { applicationResponses, reviewResponses, elementTypePluginCode, parameters } =
      data?.templateElementByTemplateCodeAndCodeAndTemplateVersion as TemplateElement

    const allResponsesByStage: ResponsesByStage = {}

    applicationResponses.nodes.forEach((applicantResponse) => {
      if (!applicantResponse) return
      const { stageNumber } = applicantResponse
      const { timeUpdated, application, value, evaluatedParameters } = applicantResponse
      const { firstName, lastName } = application?.user as User

      if (stageNumber) {
        if (!allResponsesByStage[stageNumber]) allResponsesByStage[stageNumber] = []

        allResponsesByStage[stageNumber].push({
          author: firstName || '' + ' ' + lastName || '',
          title: t('TITLE_HISTORY_SUBMITTED_BY_APPLICANT'),
          // TODO translated message, that nothing is entered
          message: value?.text,
          response: { ...value, evaluatedParameters },
          elementTypePluginCode,
          parameters,
          timeUpdated,
        })
      }
    })

    reviewResponses.nodes.forEach((reviewResponse) => {
      if (!reviewResponse) return
      const { stageNumber } = reviewResponse
      const { timeUpdated, decision, comment, review } = reviewResponse
      // Avoid breaking app when review is restricted so not returned in query (for Applicant)
      const { levelNumber, reviewer } = review ? review : { levelNumber: 1, reviewer: null }

      // Set each entry using HistoryElement values
      if (stageNumber) {
        if (!allResponsesByStage[stageNumber]) allResponsesByStage[stageNumber] = []
        allResponsesByStage[stageNumber].push({
          author: reviewer ? reviewer?.firstName || '' + ' ' + reviewer?.lastName || '' : '',
          title:
            (levelNumber || 1) > 1 ? t('TITLE_HISTORY_CONSOLIDATION') : t('TITLE_HISTORY_REVIEW'),
          message: !!decision ? ReviewResponse[decision] : '',
          timeUpdated,
          reviewerComment: comment || '',
        })
      }
    })

    // Order by latest per stage
    const orderedHistoryElementsByStage: HistoryElementsByStage = []

    Object.entries(allResponsesByStage)
      .reverse()
      .forEach(([stage, elements]) => {
        const stageHistoryElementsList: HistoryElement[] = []

        elements
          .sort((a, b) => {
            const bTime = new Date(b.timeUpdated).getTime()
            const aTime = new Date(a.timeUpdated).getTime()
            // It's possible for timestamps to be equal if applicationResponse
            // created at the same time as its reviewResponse (happens with
            // optional review elements), so we need to make sure the
            // reviewResponse comes first
            if (aTime === bTime) {
              return a.reviewerComment ? -1 : 1
            }
            return bTime - aTime
          })
          .forEach((e) => stageHistoryElementsList.push(e))

        orderedHistoryElementsByStage.push({
          stageNumber: Number(stage),
          historyElements: stageHistoryElementsList,
        })
      })

    setHistoryList(orderedHistoryElementsByStage)
  }, [data])

  return {
    error,
    loading,
    historyList,
  }
}

export default useGetQuestionReviewHistory
