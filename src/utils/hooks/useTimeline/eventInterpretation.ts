import { LanguageStrings } from '../../../contexts/Localisation'
import { ActivityLog, Decision } from '../../generated/graphql'
import { FullStructure } from '../../types'
import { TimelineEventType, EventOutput } from './types'
import {
  getAssociatedReviewDecision,
  checkResubmission,
  stringifySections,
  getReviewLinkString,
} from './helpers'
import { DateTime } from 'luxon'
import config from '../../../config'

const getStatusEvent = (
  { value, timestamp, details: { prevStatus } }: ActivityLog,
  fullLog: ActivityLog[],
  strings: LanguageStrings
): EventOutput => {
  const changesRequiredEvent = fullLog.find(
    (e) => e.type === 'STATUS' && e.value === 'CHANGES_REQUIRED'
  )

  switch (true) {
    case value === 'DRAFT' && !prevStatus:
      return {
        eventType: TimelineEventType.ApplicationStarted,
        displayString: strings.TIMELINE_APPLICATION_STARTED,
      }
    case value === 'DRAFT' && prevStatus === 'CHANGES_REQUIRED':
      return {
        eventType: TimelineEventType.Ignore,
        displayString: strings.TIMELINE_APPLICATION_RESTARTED,
      }
    case value === 'SUBMITTED' && prevStatus === 'COMPLETED':
      // New stage, no need to display
      return {
        eventType: TimelineEventType.Ignore,
        displayString: '',
      }
    case value === 'SUBMITTED' &&
      changesRequiredEvent &&
      changesRequiredEvent.timestamp < timestamp:
      return {
        eventType: TimelineEventType.ApplicationResubmitted,
        displayString: strings.TIMELINE_APPLICATION_RESUBMITTED,
      }
    case value === 'SUBMITTED':
      return {
        eventType: TimelineEventType.ApplicationSubmitted,
        displayString: strings.TIMELINE_APPLICATION_SUBMITTED,
      }
    case value === 'COMPLETED':
      // Outcome change will be used instead
      return {
        eventType: TimelineEventType.Ignore,
        displayString: '',
      }
    case value === 'CHANGES_REQUIRED':
      // Mostly ignored, only shows when event is *last* in list (see
      // buildTimeline function)
      return {
        eventType: TimelineEventType.ApplicationChangesRequired,
        displayString: `*> ${strings.TIMELINE_WAITING_FOR_APPLICANT}*`,
      }
    default:
      return {
        eventType: TimelineEventType.Error,
        displayString: strings.TIMELINE_ERROR_MESSAGE,
      }
  }
}

const getOutcomeEvent = ({ value }: ActivityLog, strings: LanguageStrings): EventOutput => {
  switch (value) {
    case 'PENDING':
      // Don't display PENDING as its covered by other types of events
      return {
        eventType: TimelineEventType.Ignore,
        displayString: '',
      }
    case 'EXPIRED':
      return {
        eventType: TimelineEventType.ApplicationExpired,
        displayString: strings.TIMELINE_APPLICATION_EXPIRED,
      }
    case 'WITHDRAWN':
      return {
        eventType: TimelineEventType.ApplicationWithdrawn,
        displayString: strings.TIMELINE_APPLICATION_WITHDRAWN,
      }
    case 'APPROVED':
      return {
        eventType: TimelineEventType.ApplicationApproved,
        displayString: strings.TIMELINE_APPLICATION_APPROVED,
      }
    case 'REJECTED':
      return {
        eventType: TimelineEventType.ApplicationRejected,
        displayString: strings.TIMELINE_APPLICATION_REJECTED,
      }
    default:
      return {
        eventType: TimelineEventType.Error,
        displayString: strings.TIMELINE_ERROR_MESSAGE,
      }
  }
}

const getExtensionEvent = (
  { value, details }: ActivityLog,
  strings: LanguageStrings
): EventOutput => {
  if (value !== config.applicantDeadlineCode)
    return {
      eventType: TimelineEventType.Ignore,
      displayString: '',
    }
  return {
    eventType: TimelineEventType.ApplicantDeadlineExtended,
    displayString: `${strings.TIMELINE_DEADLINE_EXTENDED} ${DateTime.fromISO(
      details.newDeadline
    ).toLocaleString(DateTime.DATETIME_SHORT)}`,
  }
}

const getAssignmentEvent = (
  { value, details: { reviewer, assigner, sections, reviewLevel } }: ActivityLog,
  structure: FullStructure,
  strings: LanguageStrings
): EventOutput => {
  const isConsolidation = reviewLevel > 1
  switch (value) {
    case 'Assigned':
      return {
        eventType: !isConsolidation
          ? TimelineEventType.AssignedReviewByAnother
          : TimelineEventType.AssignedConsolidationByAnother,
        displayString: (!isConsolidation
          ? strings.TIMELINE_REVIEW_ASSIGNED
          : strings.TIMELINE_CONSOLIDATION_ASSIGNED
        )
          .replace('%1', `**${reviewer?.name}**`)
          .replace('%2', stringifySections(sections, structure.sections, strings))
          .replace('%3', `**${assigner?.name}**`),
      }
    case 'Self-Assigned':
      return {
        eventType: !isConsolidation
          ? TimelineEventType.SelfAssignedReview
          : TimelineEventType.SelfAssignedConsolidation,
        displayString: (!isConsolidation
          ? strings.TIMELINE_REVIEW_SELF_ASSIGNED
          : strings.TIMELINE_CONSOLIDATION_SELF_ASSIGNED
        )
          .replace('%1', `**${reviewer?.name}**`)
          .replace('%2', stringifySections(sections, structure.sections, strings)),
      }
    case 'Unassigned':
      return {
        eventType: TimelineEventType.Unassigned,
        displayString: strings.TIMELINE_UNASSIGNED.replace('%1', `**${reviewer?.name}**`)
          .replace('%2', stringifySections(sections, structure.sections, strings))
          .replace('%3', `**${assigner?.name}**`),
      }
    default:
      return {
        eventType: TimelineEventType.Error,
        displayString: strings.TIMELINE_ERROR_MESSAGE,
      }
  }
}

const getReviewEvent = (
  event: ActivityLog,
  fullLog: ActivityLog[],
  structure: FullStructure,
  index: number,
  strings: LanguageStrings,
  decisionStrings: { [key in Decision]: string }
): EventOutput => {
  const {
    value,
    details: { prevStatus, reviewer, level },
  } = event

  const isConsolidation = level > 1
  const reviewDecision = value === 'SUBMITTED' ? getAssociatedReviewDecision(event, fullLog) : null
  const isResubmission = value === 'SUBMITTED' ? checkResubmission(event, fullLog) : false
  const hyperlinkReplaceString = isConsolidation
    ? strings.TIMELINE_CONSOLIDATION
    : strings.TIMELINE_REVIEW

  switch (true) {
    case value === 'CHANGES_REQUESTED':
      // Mostly ignored, only shows when event is *last* in list
      return {
        eventType: TimelineEventType.ReviewChangesRequested,
        displayString: `*> ${strings.TIMELINE_WAITING_FOR_REVIEWER}*`.replace(
          '%1',
          `**${reviewer?.name}**`
        ),
      }
    case value === 'PENDING' || value === 'LOCKED':
      return {
        eventType: TimelineEventType.Ignore,
        displayString: '',
      }
    case value === 'DISCONTINUED':
      return {
        eventType: TimelineEventType.ReviewDiscontinued,
        displayString: strings.TIMELINE_REVIEW_DISCONTINUED.replace('%1', `**${reviewer?.name}**`),
      }
    case value === 'DRAFT' && !prevStatus:
      return {
        eventType: !isConsolidation
          ? TimelineEventType.ReviewStarted
          : TimelineEventType.ConsolidationStarted,
        displayString: (!isConsolidation
          ? strings.TIMELINE_REVIEW_STARTED
          : strings.TIMELINE_CONSOLIDATION_STARTED
        ).replace('%1', `**${reviewer?.name}**`),
      }
    case value === 'DRAFT' && (prevStatus === 'CHANGES_REQUESTED' || prevStatus === 'PENDING'):
      return {
        eventType: !isConsolidation
          ? TimelineEventType.ReviewRestarted
          : TimelineEventType.ConsolidationRestarted,
        displayString: (!isConsolidation
          ? strings.TIMELINE_REVIEW_RESTARTED
          : strings.TIMELINE_CONSOLIDATION_RESTARTED
        ).replace('%1', `**${reviewer?.name}**`),
      }
    case value === 'SUBMITTED' && !reviewDecision && !isResubmission:
      return {
        eventType: !isConsolidation
          ? TimelineEventType.ReviewSubmitted
          : TimelineEventType.ConsolidationSubmitted,
        displayString: (!isConsolidation
          ? strings.TIMELINE_REVIEW_SUBMITTED
          : strings.TIMELINE_CONSOLIDATION_SUBMITTED
        )
          .replace('%1', `**${reviewer?.name}**`)
          .replace(hyperlinkReplaceString, 'LINK'),
      }
    case value === 'SUBMITTED' && reviewDecision && !isResubmission:
      return {
        extras: { reviewDecision },
        eventType: !isConsolidation
          ? TimelineEventType.ReviewSubmittedWithDecision
          : TimelineEventType.ConsolidationSubmittedWithDecision,
        displayString: (!isConsolidation
          ? strings.TIMELINE_REVIEW_SUBMITTED_DECISION
          : strings.TIMELINE_CONSOLIDATION_SUBMITTED_DECISION
        )
          .replace('%1', `**${reviewer?.name}**`)
          .replace(
            '%2',
            `**${decisionStrings[reviewDecision.decision as Decision]}**${
              reviewDecision?.comment
                ? ` (${strings.TIMELINE_COMMENT} *${reviewDecision?.comment}*)`
                : ''
            }`
          )
          .replace(
            hyperlinkReplaceString,
            getReviewLinkString(hyperlinkReplaceString, structure, event, fullLog)
          ),
      }
    case value === 'SUBMITTED' && !reviewDecision && isResubmission:
      return {
        eventType: !isConsolidation
          ? TimelineEventType.ReviewSubmitted
          : TimelineEventType.ConsolidationSubmitted,
        displayString: (!isConsolidation
          ? strings.TIMELINE_REVIEW_RESUBMITTED
          : strings.TIMELINE_CONSOLIDATION_RESUBMITTED
        ).replace('%1', `**${reviewer?.name}**`),
      }
    case value === 'SUBMITTED' && reviewDecision && isResubmission:
      return {
        extras: { reviewDecision },
        eventType: !isConsolidation
          ? TimelineEventType.ReviewResubmittedWithDecision
          : TimelineEventType.ConsolidationResubmittedWithDecision,
        displayString: (!isConsolidation
          ? strings.TIMELINE_REVIEW_RESUBMITTED_DECISION
          : strings.TIMELINE_CONSOLIDATION_RESUBMITTED_DECISION
        )
          .replace('%1', `**${reviewer?.name}**`)
          .replace(
            '%2',
            `**${decisionStrings[reviewDecision.decision as Decision]}**${
              reviewDecision?.comment
                ? ` (${strings.TIMELINE_COMMENT} *${reviewDecision?.comment}*)`
                : ''
            }`
          )
          .replace(
            hyperlinkReplaceString,
            getReviewLinkString(hyperlinkReplaceString, structure, event, fullLog)
          ),
      }
    default:
      return {
        eventType: TimelineEventType.Error,
        displayString: strings.TIMELINE_ERROR_MESSAGE,
      }
  }
}

export { getStatusEvent, getOutcomeEvent, getExtensionEvent, getAssignmentEvent, getReviewEvent }
