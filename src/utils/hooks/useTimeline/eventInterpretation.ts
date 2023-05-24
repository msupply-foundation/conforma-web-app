import { TranslateMethod } from '../../../contexts/Localisation'
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
  t: TranslateMethod
): EventOutput => {
  const changesRequiredEvent = fullLog.find(
    (e) => e.type === 'STATUS' && e.value === 'CHANGES_REQUIRED'
  )

  switch (true) {
    case value === 'DRAFT' && !prevStatus:
      return {
        eventType: TimelineEventType.ApplicationStarted,
        displayString: t('TIMELINE_APPLICATION_STARTED'),
      }
    case value === 'DRAFT' && prevStatus === 'CHANGES_REQUIRED':
      return {
        eventType: TimelineEventType.Ignore,
        displayString: t('TIMELINE_APPLICATION_RESTARTED'),
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
        displayString: t('TIMELINE_APPLICATION_RESUBMITTED'),
      }
    case value === 'SUBMITTED':
      return {
        eventType: TimelineEventType.ApplicationSubmitted,
        displayString: t('TIMELINE_APPLICATION_SUBMITTED'),
      }
    case value === 'COMPLETED':
      // Outcome change will be used instead
      return {
        eventType: TimelineEventType.Ignore,
        displayString: '',
      }
    case value === 'CHANGES_REQUIRED':
      // Mostly ignored, only shows when event reflects the *current* state
      return {
        eventType: TimelineEventType.ApplicationChangesRequired,
        displayString: `*> ${t('TIMELINE_WAITING_FOR_APPLICANT')}*`,
      }
    default:
      return {
        eventType: TimelineEventType.Error,
        displayString: t('TIMELINE_ERROR_MESSAGE'),
      }
  }
}

const getOutcomeEvent = ({ value }: ActivityLog, t: TranslateMethod): EventOutput => {
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
        displayString: t('TIMELINE_APPLICATION_EXPIRED'),
      }
    case 'WITHDRAWN':
      return {
        eventType: TimelineEventType.ApplicationWithdrawn,
        displayString: t('TIMELINE_APPLICATION_WITHDRAWN'),
      }
    case 'APPROVED':
      return {
        eventType: TimelineEventType.ApplicationApproved,
        displayString: t('TIMELINE_APPLICATION_APPROVED'),
      }
    case 'REJECTED':
      return {
        eventType: TimelineEventType.ApplicationRejected,
        displayString: t('TIMELINE_APPLICATION_REJECTED'),
      }
    default:
      return {
        eventType: TimelineEventType.Error,
        displayString: t('TIMELINE_ERROR_MESSAGE'),
      }
  }
}

const getExtensionEvent = (
  { value, details }: ActivityLog,
  t: TranslateMethod,
  locale: string
): EventOutput => {
  if (value !== config.applicantDeadlineCode)
    return {
      eventType: TimelineEventType.Ignore,
      displayString: '',
    }
  const {
    newDeadline,
    extendedBy: { name },
  } = details
  return {
    eventType: TimelineEventType.ApplicantDeadlineExtended,
    displayString: `${t('TIMELINE_DEADLINE_EXTENDED', `**${name}**`)} ${DateTime.fromISO(
      newDeadline
    )
      .setLocale(locale)
      .toLocaleString(DateTime.DATETIME_SHORT)}`,
  }
}

const getAssignmentEvent = (
  { value, details: { reviewer, assigner, sections, reviewLevel } }: ActivityLog,
  structure: FullStructure,
  t: TranslateMethod
): EventOutput => {
  const isConsolidation = reviewLevel > 1
  switch (value) {
    case 'Assigned': {
      const stringValues = {
        reviewer: `**${reviewer?.name}**`,
        sections: stringifySections(sections, structure.sections, t),
        assigner: `**${assigner?.name}**`,
      }
      return {
        eventType: !isConsolidation
          ? TimelineEventType.AssignedReviewByAnother
          : TimelineEventType.AssignedConsolidationByAnother,
        displayString: !isConsolidation
          ? t('TIMELINE_REVIEW_ASSIGNED', stringValues)
          : t('TIMELINE_CONSOLIDATION_ASSIGNED', stringValues),
      }
    }
    case 'Self-Assigned': {
      const stringValues = {
        reviewer: `**${reviewer?.name}**`,
        sections: stringifySections(sections, structure.sections, t),
      }
      return {
        eventType: !isConsolidation
          ? TimelineEventType.SelfAssignedReview
          : TimelineEventType.SelfAssignedConsolidation,
        displayString: !isConsolidation
          ? t('TIMELINE_REVIEW_SELF_ASSIGNED', stringValues)
          : t('TIMELINE_CONSOLIDATION_SELF_ASSIGNED', stringValues),
      }
    }
    case 'Unassigned':
      return {
        eventType: TimelineEventType.Unassigned,
        displayString: t('TIMELINE_UNASSIGNED', {
          reviewer: `**${reviewer?.name}**`,
          sections: stringifySections(sections, structure.sections, t),
          assigner: `**${assigner?.name}**`,
        }),
      }
    default:
      return {
        eventType: TimelineEventType.Error,
        displayString: t('TIMELINE_ERROR_MESSAGE'),
      }
  }
}

const getReviewEvent = (
  event: ActivityLog,
  fullLog: ActivityLog[],
  structure: FullStructure,
  index: number,
  t: TranslateMethod,
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
    ? t('TIMELINE_CONSOLIDATION')
    : t('TIMELINE_REVIEW')

  switch (true) {
    case value === 'CHANGES_REQUESTED':
      // Mostly ignored, only shows when event reflects the *current* state
      return {
        eventType: TimelineEventType.ReviewChangesRequested,
        displayString: `*> ${t('TIMELINE_WAITING_FOR_REVIEWER', `**${reviewer?.name}**`)}*`,
      }
    case value === 'PENDING' || value === 'LOCKED':
      return {
        eventType: TimelineEventType.Ignore,
        displayString: '',
      }
    case value === 'DISCONTINUED':
      return {
        eventType: TimelineEventType.ReviewDiscontinued,
        displayString: t('TIMELINE_REVIEW_DISCONTINUED', `**${reviewer?.name}**`),
      }
    case value === 'DRAFT' && !prevStatus:
      return {
        eventType: !isConsolidation
          ? TimelineEventType.ReviewStarted
          : TimelineEventType.ConsolidationStarted,
        displayString: !isConsolidation
          ? t('TIMELINE_REVIEW_STARTED', `**${reviewer?.name}**`)
          : t('TIMELINE_CONSOLIDATION_STARTED', `**${reviewer?.name}**`),
      }
    case value === 'DRAFT' && ['CHANGES_REQUESTED', 'PENDING', 'DISCONTINUED'].includes(prevStatus):
      return {
        eventType: !isConsolidation
          ? TimelineEventType.ReviewRestarted
          : TimelineEventType.ConsolidationRestarted,
        displayString: !isConsolidation
          ? t('TIMELINE_REVIEW_RESTARTED', `**${reviewer?.name}**`)
          : t('TIMELINE_CONSOLIDATION_RESTARTED', `**${reviewer?.name}**`),
      }
    case value === 'SUBMITTED' && !reviewDecision && !isResubmission:
      return {
        eventType: !isConsolidation
          ? TimelineEventType.ReviewSubmitted
          : TimelineEventType.ConsolidationSubmitted,
        displayString: (!isConsolidation
          ? t('TIMELINE_REVIEW_SUBMITTED', `**${reviewer?.name}**`)
          : t('TIMELINE_CONSOLIDATION_SUBMITTED', `**${reviewer?.name}**`)
        ).replace(
          hyperlinkReplaceString,
          getReviewLinkString(hyperlinkReplaceString, structure, event, fullLog)
        ),
      }
    case value === 'SUBMITTED' && reviewDecision && !isResubmission: {
      const stringValues = {
        name: `**${reviewer?.name}**`,
        decision: `**${decisionStrings[reviewDecision.decision as Decision]}**${
          reviewDecision?.comment ? ` (${t('TIMELINE_COMMENT')} *${reviewDecision?.comment}*)` : ''
        }`,
      }
      return {
        extras: { reviewDecision },
        eventType: !isConsolidation
          ? TimelineEventType.ReviewSubmittedWithDecision
          : TimelineEventType.ConsolidationSubmittedWithDecision,
        displayString: (!isConsolidation
          ? t('TIMELINE_REVIEW_SUBMITTED_DECISION', stringValues)
          : t('TIMELINE_CONSOLIDATION_SUBMITTED_DECISION', stringValues)
        ).replace(
          hyperlinkReplaceString,
          getReviewLinkString(hyperlinkReplaceString, structure, event, fullLog)
        ),
      }
    }
    case value === 'SUBMITTED' && !reviewDecision && isResubmission:
      return {
        eventType: !isConsolidation
          ? TimelineEventType.ReviewSubmitted
          : TimelineEventType.ConsolidationSubmitted,
        displayString: !isConsolidation
          ? t('TIMELINE_REVIEW_RESUBMITTED', `**${reviewer?.name}**`)
          : t('TIMELINE_CONSOLIDATION_RESUBMITTED', `**${reviewer?.name}**`),
      }
    case value === 'SUBMITTED' && reviewDecision && isResubmission: {
      const stringValues = {
        name: `**${reviewer?.name}**`,
        decision: `**${decisionStrings[reviewDecision.decision as Decision]}**${
          reviewDecision?.comment ? ` (${t('TIMELINE_COMMENT')} *${reviewDecision?.comment}*)` : ''
        }`,
      }
      return {
        extras: { reviewDecision },
        eventType: !isConsolidation
          ? TimelineEventType.ReviewResubmittedWithDecision
          : TimelineEventType.ConsolidationResubmittedWithDecision,
        displayString: (!isConsolidation
          ? t('TIMELINE_REVIEW_RESUBMITTED_DECISION', stringValues)
          : t('TIMELINE_CONSOLIDATION_RESUBMITTED_DECISION', stringValues)
        ).replace(
          hyperlinkReplaceString,
          getReviewLinkString(hyperlinkReplaceString, structure, event, fullLog)
        ),
      }
    }
    default:
      return {
        eventType: TimelineEventType.Error,
        displayString: t('TIMELINE_ERROR_MESSAGE'),
      }
  }
}

export { getStatusEvent, getOutcomeEvent, getExtensionEvent, getAssignmentEvent, getReviewEvent }
