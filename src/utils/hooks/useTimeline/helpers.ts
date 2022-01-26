import { LanguageStrings } from '../../../contexts/Localisation'
import { ActivityLog } from '../../generated/graphql'
import { TimelineEventType, MapOutput, Section } from './types'

const getApplicationSubmittedVariant = (
  event: ActivityLog,
  fullLog: ActivityLog[],
  strings: LanguageStrings
): MapOutput => {
  const changesRequiredEvent = fullLog.find(
    (e) => e.type === 'STATUS' && e.value === 'CHANGES_REQUIRED'
  )
  if (changesRequiredEvent && changesRequiredEvent.timestamp < event.timestamp)
    return {
      eventType: TimelineEventType.ApplicationResubmitted,
      displayString: () => strings.TIMELINE_APPLICATION_RESUBMITTED,
    }
  return {
    eventType: TimelineEventType.ApplicationSubmitted,
    displayString: () => strings.TIMELINE_APPLICATION_SUBMITTED,
  }
}
const getReviewVariant = (
  status: string,
  event: ActivityLog,
  fullLog: ActivityLog[],
  index: number,
  strings: LanguageStrings
): MapOutput => {
  const { details } = event
  const isConsolidation = details.level > 1
  const reviewDecision = status === 'SUBMITTED' ? getReviewDecision(event, fullLog, index) : null
  const isResubmission = status === 'SUBMITTED' ? checkResubmission(event, fullLog) : false

  switch (true) {
    case status === 'Started':
      return {
        eventType: !isConsolidation
          ? TimelineEventType.ReviewStarted
          : TimelineEventType.ConsolidationStarted,
        displayString: ({ reviewer, sections }) =>
          !isConsolidation
            ? strings.TIMELINE_REVIEW_STARTED.replace('%1', `**${reviewer?.name}**`).replace(
                '%2',
                stringifySections(sections)
              )
            : strings.TIMELINE_CONSOLIDATION_STARTED.replace('%1', `**${reviewer?.name}**`),
      }
    case status === 'Re-started':
      return {
        eventType: !isConsolidation
          ? TimelineEventType.ReviewRestarted
          : TimelineEventType.ConsolidationRestarted,
        displayString: ({ reviewer, sections }) =>
          !isConsolidation
            ? strings.TIMELINE_REVIEW_RESTARTED.replace('%1', `**${reviewer?.name}**`).replace(
                '%2',
                stringifySections(sections)
              )
            : strings.TIMELINE_CONSOLIDATION_RESTARTED.replace('%1', `**${reviewer?.name}**`),
      }
    case status === 'SUBMITTED' && !reviewDecision && !isResubmission:
      return {
        eventType: !isConsolidation
          ? TimelineEventType.ReviewSubmitted
          : TimelineEventType.ConsolidationSubmitted,
        displayString: ({ reviewer, sections }) =>
          !isConsolidation
            ? strings.TIMELINE_REVIEW_SUBMITTED.replace('%1', `**${reviewer?.name}**`).replace(
                '%2',
                stringifySections(sections)
              )
            : strings.TIMELINE_CONSOLIDATION_SUBMITTED.replace(
                '%1',
                `**${reviewer?.name}**`
              ).replace('%2', stringifySections(sections)),
      }
    case status === 'SUBMITTED' && reviewDecision && !isResubmission:
      return {
        extras: { reviewDecision },
        eventType: !isConsolidation
          ? TimelineEventType.ReviewSubmittedWithDecision
          : TimelineEventType.ConsolidationSubmittedWithDecision,
        displayString: ({ reviewer, sections }) =>
          !isConsolidation
            ? strings.TIMELINE_REVIEW_SUBMITTED_DECISION.replace('%1', `**${reviewer?.name}**`)
                .replace('%2', stringifySections(sections))
                .replace('%3', `**${reviewDecision.decision}** (${reviewDecision?.comment})`)
            : strings.TIMELINE_CONSOLIDATION_SUBMITTED_DECISION.replace(
                '%1',
                `**${reviewer?.name}**`
              ).replace('%2', stringifySections(sections)),
      }
    case status === 'SUBMITTED' && !reviewDecision && isResubmission:
      return {
        eventType: !isConsolidation
          ? TimelineEventType.ReviewSubmitted
          : TimelineEventType.ConsolidationSubmitted,
        displayString: ({ reviewer, sections }) =>
          !isConsolidation
            ? strings.TIMELINE_REVIEW_SUBMITTED.replace('%1', `**${reviewer?.name}**`).replace(
                '%2',
                stringifySections(sections)
              )
            : strings.TIMELINE_CONSOLIDATION_SUBMITTED.replace(
                '%1',
                `**${reviewer?.name}**`
              ).replace('%2', stringifySections(sections)),
      }
    case status === 'SUBMITTED' && reviewDecision && isResubmission:
      return {
        extras: { reviewDecision },
        eventType: !isConsolidation
          ? TimelineEventType.ReviewResubmittedWithDecision
          : TimelineEventType.ConsolidationResubmittedWithDecision,
        displayString: ({ reviewer, sections }) =>
          !isConsolidation
            ? strings.TIMELINE_REVIEW_RESUBMITTED_DECISION.replace('%1', `**${reviewer?.name}**`)
                .replace('%2', stringifySections(sections))
                .replace('%3', `**${reviewDecision.decision}** (${reviewDecision?.comment})`)
            : strings.TIMELINE_CONSOLIDATION_RESUBMITTED_DECISION.replace(
                '%1',
                `**${reviewer?.name}**`
              ).replace('%2', stringifySections(sections)),
      }
    default:
      return {
        eventType: TimelineEventType.Error,
        displayString: () => 'Problem parsing this review event',
      }
  }
}

const getReviewDecision = (event: ActivityLog, fullLog: ActivityLog[], index: number) => {
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

const checkResubmission = (event: ActivityLog, fullLog: ActivityLog[]) =>
  !!fullLog.find(
    (e) =>
      e.type === 'REVIEW' &&
      e.value === 'SUBMITTED' &&
      e.timestamp < event.timestamp &&
      e.details.reviewId === event.details.reviewId
  )

const stringifySections = (sections: Section[]) => {
  return `*${sections.map((section: Section) => section.title).join(', ')}*`
}

export { getApplicationSubmittedVariant, getReviewVariant, stringifySections }
