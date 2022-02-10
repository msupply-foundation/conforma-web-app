import { LanguageStrings } from '../../../contexts/Localisation'
import { ActivityLog, Decision } from '../../generated/graphql'
import { FullStructure, SectionsStructure } from '../../types'
import { Section } from './types'
import { DateTime } from 'luxon'

export const getAssociatedReviewDecision = (event: ActivityLog, fullLog: ActivityLog[]) => {
  const possibleDecisions = fullLog.filter(
    (e) => e.type === 'REVIEW_DECISION' && e.details.reviewId === event.details.reviewId
  )
  if (possibleDecisions.length === 0) return null
  // If there is more than one Decision, choose the one with the closest
  // timestamp to the review submission
  const reviewDecision = possibleDecisions.reduce((closest, e) => {
    const reviewUnixTimestamp = DateTime.fromISO(event.timestamp).toMillis()
    return Math.abs(DateTime.fromISO(e.timestamp).toMillis() - reviewUnixTimestamp) <
      Math.abs(DateTime.fromISO(closest.timestamp).toMillis() - reviewUnixTimestamp)
      ? e
      : closest
  })

  return reviewDecision.details
}

export const checkResubmission = (event: ActivityLog, fullLog: ActivityLog[]) =>
  !!fullLog.find(
    (e) =>
      e.type === 'REVIEW' &&
      e.value === 'SUBMITTED' &&
      e.timestamp < event.timestamp &&
      e.details.reviewId === event.details.reviewId
  )

export const stringifySections = (
  sections: Section[],
  sectionsStructure: SectionsStructure,
  strings: LanguageStrings
) => {
  if (!sections) return '---'
  return sections.length === Object.keys(sectionsStructure).length
    ? `*${strings.TIMELINE_ALL_SECTIONS}*`
    : `${strings.TIMELINE_SECTIONS}: *${sections
        .map((section: Section) => section.title)
        .join(', ')}*`
}

export const getReviewLinkString = (
  hyperlinkReplaceString: string,
  structure: FullStructure,
  event: ActivityLog,
  fullLog: ActivityLog[]
) => {
  if (!isLastSubmission(event, fullLog)) return hyperlinkReplaceString

  const sections = Object.keys(structure.sections)
  const sectionString =
    event.details.sections.length === sections.length ? 'all' : sections.join(',')
  return `[${hyperlinkReplaceString}](/application/${structure.info.serial}/review/${event.details?.reviewId}?activeSections=${sectionString})`
}

const isLastSubmission = (event: ActivityLog, fullLog: ActivityLog[]) =>
  !fullLog.find(
    (e) =>
      e.type === 'REVIEW' &&
      e.value === 'SUBMITTED' &&
      e.timestamp > event.timestamp &&
      e.details.reviewId === event.details.reviewId
  )

export const getDecisionIcon = (decision: Decision) => {
  switch (decision) {
    case Decision.NonConform:
      return '❌'
    case Decision.ListOfQuestions:
      return '❓'
    case Decision.Conform:
      return '✅'
    default:
      // Shouldn't happen
      return '❗'
  }
}
