import { LanguageStrings, useLanguageProvider } from '../../../contexts/Localisation'
import { ActivityLog, EventType, useGetActivityLogQuery } from '../../generated/graphql'
import {
  GenericObject,
  TimelineEvent,
  TimelineStage,
  Timeline,
  TimelineEventType,
  MapOutput,
  Section,
} from './types'

const getApplicationSubmittedVariant = (event: ActivityLog, fullLog: ActivityLog[]): MapOutput => {
  const changesRequiredEvent = fullLog.find(
    (e) => e.type === 'STATUS' && e.value === 'CHANGES_REQUIRED'
  )
  if (changesRequiredEvent && changesRequiredEvent.timestamp < event.timestamp)
    return {
      eventType: TimelineEventType.ApplicationResubmitted,
      displayString: () => 'Application re-submitted after making changes',
    }
  return {
    eventType: TimelineEventType.ApplicationSubmitted,
    displayString: () => 'Application submitted',
  }
}
const getReviewVariant = (
  status: string,
  event: ActivityLog,
  fullLog: ActivityLog[],
  index: number
): MapOutput => {
  const { details } = event
  const isConsolidation = details.level > 1
  const reviewDecision = status === 'SUBMITTED' ? getReviewDecision(event, fullLog, index) : null
  if (status === 'Started') {
    return {
      eventType: !isConsolidation
        ? TimelineEventType.ReviewStarted
        : TimelineEventType.ConsolidationStarted,
      displayString: ({ reviewer, sections }) =>
        !isConsolidation
          ? '%1 started their review of Sections %2'
              .replace('%1', `**${reviewer?.name}**`)
              .replace('%2', stringifySections(sections))
          : '%1 started their consolidation'.replace('%1', `**${reviewer?.name}**`),
    }
  } else if (status === 'Re-started') {
    return {
      eventType: !isConsolidation
        ? TimelineEventType.ReviewRestarted
        : TimelineEventType.ConsolidationRestarted,
      displayString: ({ reviewer, sections }) =>
        !isConsolidation
          ? '%1 re-started their review of Sections %2'
              .replace('%1', `**${reviewer?.name}**`)
              .replace('%2', stringifySections(sections))
          : '%1 re-started their consolidation'.replace('%1', `**${reviewer?.name}**`),
    }
  } else if (status === 'SUBMITTED' && !reviewDecision) {
    return {
      eventType: !isConsolidation
        ? TimelineEventType.ReviewSubmitted
        : TimelineEventType.ConsolidationSubmitted,
      displayString: ({ reviewer, sections }) =>
        !isConsolidation
          ? '%1 submitted their review of Sections %2'
              .replace('%1', `**${reviewer?.name}**`)
              .replace('%2', stringifySections(sections))
          : '%1 submitted their consolidation'
              .replace('%1', `**${reviewer?.name}**`)
              .replace('%2', stringifySections(sections)),
    }
  } else if (status === 'SUBMITTED' && reviewDecision) {
    return {
      extras: { reviewDecision },
      eventType: !isConsolidation
        ? TimelineEventType.ReviewSubmittedWithDecision
        : TimelineEventType.ConsolidationSubmittedWithDecision,
      displayString: ({ reviewer, sections }) =>
        !isConsolidation
          ? '%1 submitted their review of Sections %2 with decision %3'
              .replace('%1', `**${reviewer?.name}**`)
              .replace('%2', stringifySections(sections))
              .replace('%3', `**${reviewDecision.decision}** (${reviewDecision?.comment})`)
          : '%1 submitted their consolidation with decision %2'
              .replace('%1', `**${reviewer?.name}**`)
              .replace('%2', stringifySections(sections)),
    }
  }
  return {
    eventType: TimelineEventType.Error,
    displayString: () => 'Problem parsing this review event',
  }
}

const getReviewDecision = (event: ActivityLog, fullLog: ActivityLog[], index: number) => {
  const previousEvent = fullLog?.[index - 1]
  if (
    previousEvent.type === 'REVIEW_DECISION' &&
    previousEvent.details.reviewer.id === event.details.reviewer.id
  )
    return previousEvent.details
  // Review decision SHOULD be previous event, but there's nothing in the
  // database to guarantee the decision record gets written first, so we'll
  // check the next event just in case
  const nextEvent = fullLog?.[index + 1]
  if (
    nextEvent.type === 'REVIEW_DECISION' &&
    nextEvent.details.reviewer.id === event.details.reviewer.id
  )
    return nextEvent.details
  return null
}
// The review decision is

const stringifySections = (sections: Section[]) => {
  return `*${sections.map((section: Section) => section.title).join(', ')}*`
}

export { getApplicationSubmittedVariant, getReviewVariant, stringifySections }
