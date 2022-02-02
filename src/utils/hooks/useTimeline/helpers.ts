import { LanguageStrings } from '../../../contexts/Localisation'
import { ActivityLog } from '../../generated/graphql'
import { FullStructure, SectionsStructure } from '../../types'
import { TimelineEventType, MapOutput, Section } from './types'

export const getReviewDecision = (event: ActivityLog, fullLog: ActivityLog[], index: number) => {
  const previousEvent = fullLog?.[index - 1]
  if (
    previousEvent.type === 'REVIEW_DECISION' &&
    previousEvent.details.reviewId === event.details.reviewId
  )
    return previousEvent.details
  // Review decision SHOULD be previous event, but there's nothing in the
  // database to *guarantee* the decision record gets written first, so we'll
  // check the next event just in case
  const nextEvent = fullLog?.[index + 1]
  if (
    nextEvent.type === 'REVIEW_DECISION' &&
    nextEvent.details.reviewer.id === event.details.reviewer.id
  )
    return nextEvent.details
  return null
}

export const checkResubmission = (event: ActivityLog, fullLog: ActivityLog[]) =>
  !!fullLog.find(
    (e) =>
      e.type === 'REVIEW' &&
      e.value === 'SUBMITTED' &&
      e.timestamp < event.timestamp &&
      e.details.reviewId === event.details.reviewId
  )

export const stringifySections = (sections: Section[], sectionsStructure: SectionsStructure) =>
  sections.length === Object.keys(sectionsStructure).length
    ? '*All Sections*'
    : `*${sections.map((section: Section) => section.title).join(', ')}*`
