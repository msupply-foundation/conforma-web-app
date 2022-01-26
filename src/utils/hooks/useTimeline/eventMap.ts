import { LanguageStrings } from '../../../contexts/Localisation'
import { ActivityLog, EventType } from '../../generated/graphql'
import {
  GenericObject,
  TimelineEvent,
  TimelineStage,
  Timeline,
  TimelineEventType,
  MapOutput,
  Section,
} from './types'
import { getApplicationSubmittedVariant, getReviewVariant, stringifySections } from './helpers'

class EventMap {
  fullLog: ActivityLog[]
  strings: LanguageStrings

  constructor(fullActivityLog: ActivityLog[], strings: LanguageStrings) {
    this.fullLog = fullActivityLog
    this.strings = strings
  }

  getTimelineEvent(event: ActivityLog, index: number): TimelineEvent {
    const { id, timestamp, type, value, details } = event
    const mapOutput = this.eventMap?.[type]?.[value] || {
      eventType: TimelineEventType.Error,
      displayString: () => `Problem loading this event: See console for details`,
    }
    const {
      eventType,
      displayString: display,
      reviewDecision,
    } = typeof mapOutput === 'function' ? mapOutput(event, index) : mapOutput
    if (eventType === TimelineEventType.Error) console.error('Problem with event:', event)
    const displayString =
      typeof display === 'function' ? display(event.details) : 'Problem loading this event'
    return { id, timestamp, eventType, displayString, details: { ...details, reviewDecision } }
  }

  private eventMap: {
    [key in EventType]: {
      [key: string]: MapOutput | ((event: ActivityLog, index: number) => MapOutput)
    }
  } = {
    // Map activity-log entries to timeline-specific events
    STAGE: {}, // Already handled above
    STATUS: {
      Started: {
        eventType: TimelineEventType.ApplicationStarted,
        displayString: () => this.strings.TIMELINE_APPLICATION_STARTED,
      },
      'New Stage': { eventType: TimelineEventType.Ignore },
      'Re-started': {
        eventType: TimelineEventType.ApplicationRestarted,
        displayString: () => 'Application restarted',
      },
      SUBMITTED: (event) => getApplicationSubmittedVariant(event, this.fullLog),
      CHANGES_REQUIRED: { eventType: TimelineEventType.Ignore },
      COMPLETED: { eventType: TimelineEventType.Ignore },
    },
    OUTCOME: {
      PENDING: { eventType: TimelineEventType.Ignore },
      EXPIRED: {
        eventType: TimelineEventType.ApplicationExpired,
        displayString: () => 'Application Expired',
      },
      WITHDRAWN: {
        eventType: TimelineEventType.ApplicationWithdrawn,
        displayString: () => 'Application Withdrawn',
      },
      APPROVED: {
        eventType: TimelineEventType.ApplicationApproved,
        displayString: () => 'Application Approved',
      },
      REJECTED: {
        eventType: TimelineEventType.ApplicationRejected,
        displayString: () => 'Application Rejected',
      },
    },
    ASSIGNMENT: {
      Assigned: {
        eventType: TimelineEventType.AssignedByAnother,
        displayString: ({ reviewer, sections, assigner }) =>
          this.strings.TIMELINE_ASSIGNED.replace('%1', `**${reviewer?.name}**`)
            .replace('%2', stringifySections(sections))
            .replace('%3', `**${assigner?.name}**`),
      },
      'Self-Assigned': {
        eventType: TimelineEventType.SelfAssigned,
        displayString: ({ reviewer }) =>
          'Reviewer %1 assigned themselves'.replace('%1', `**${reviewer?.name}**`),
      },
      UnAssigned: {
        eventType: TimelineEventType.Unassigned,
        displayString: ({ reviewer, sections, assigner }) =>
          'Reviewer %1 was unassigned from Sections %2 by %3'
            .replace('%1', `**${reviewer?.name}**`)
            .replace('%2', stringifySections(sections))
            .replace('%3', `**${assigner?.name}**`),
      },
    },
    REVIEW: {
      PENDING: { eventType: TimelineEventType.Ignore },
      LOCKED: { eventType: TimelineEventType.Ignore },
      CHANGES_REQUESTED: { eventType: TimelineEventType.Ignore },
      DISCONTINUED: {
        eventType: TimelineEventType.ReviewDiscontinued,
        displayString: ({ reviewer }) =>
          `%1's review was discontinued`.replace('%1', `**${reviewer?.name}**`),
      },
      Started: (event, index) => getReviewVariant('Started', event, this.fullLog, index),
      'Re-started': (event, index) => getReviewVariant('Re-started', event, this.fullLog, index),
      SUBMITTED: (event, index) => getReviewVariant('SUBMITTED', event, this.fullLog, index),
    },
    REVIEW_DECISION: {
      // Ignore all because decision gets combined into Review event
      LIST_OF_QUESTIONS: { eventType: TimelineEventType.Ignore },
      CONFORM: { eventType: TimelineEventType.Ignore },
      NON_CONFORM: { eventType: TimelineEventType.Ignore },
      CHANGES_REQUESTED: { eventType: TimelineEventType.Ignore },
      NO_DECISION: { eventType: TimelineEventType.Ignore },
    },
    PERMISSION: {}, // Not part of Timeline display
  }
}

export default EventMap
