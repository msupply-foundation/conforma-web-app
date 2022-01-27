import { LanguageStrings, useLanguageProvider } from '../../../contexts/Localisation'
import { ActivityLog, EventType, useGetActivityLogQuery } from '../../generated/graphql'

type GenericObject = { [key: string]: any }

interface TimelineEvent {
  id: number
  eventType: TimelineEventType
  timestamp: string
  displayString: string
  details: { [key: string]: GenericObject }
}

interface TimelineStage {
  number: number
  name: string
  colour: string
  timestamp: Date
  events: TimelineEvent[]
}

interface Timeline {
  stages: TimelineStage[]
  rawLog: ActivityLog[]
}

enum TimelineEventType {
  Ignore = 'IGNORE',
  Error = 'ERROR',
  ApplicationStarted = 'APPLICATION_STARTED',
  ApplicationSubmitted = 'APPLICATION_SUBMITTED',
  ApplicationRestarted = 'APPLICATION_RESTARTED',
  ApplicationResubmitted = 'APPLICATION_RESUBMITTED',
  ApplicationExpired = 'APPLICATION_EXPIRED',
  ApplicationWithdrawn = 'APPLICATION_WITHDRAWN',
  ApplicationApproved = 'APPLICATION_APPROVED',
  ApplicationRejected = 'APPLICATION_REJECTED',
  AssignedByAnother = 'ASSIGNED_BY_ANOTHER',
  SelfAssigned = 'SELF_ASSIGNED',
  Unassigned = 'UNASSIGNED',
  ReviewStarted = 'REVIEW_STARTED',
  ReviewSubmitted = 'REVIEW_SUBMITTED',
  ReviewSubmittedWithDecision = 'REVIEW_SUBMITTED_WITH_DECISION',
  ReviewRestarted = 'REVIEW_RESTARTED',
  ReviewResubmitted = 'REVIEW_RESUBMITTED',
  ReviewResubmittedWithDecision = 'REVIEW_RESUBMITTED_WITH_DECISION',
  ReviewDiscontinued = 'REVIEW_DISCONTINUED',
  ConsolidationStarted = 'CONSOLIDATION_STARTED',
  ConsolidationSubmitted = 'CONSOLIDATION_SUBMITTED',
  ConsolidationSubmittedWithDecision = 'CONSOLIDATION_SUBMITTED_WITH_DECISION',
  ConsolidationRestarted = 'CONSOLIDATION_RESTARTED',
  ConsolidationResubmitted = 'CONSOLIDATION_RESUBMITTED',
  ConsolidationResubmittedWithDecision = 'CONSOLIDATION_RESUBMITTED_WITH_DECISION',
}

type MapOutput = {
  eventType: TimelineEventType
  displayString?: (details: GenericObject) => string
  extras?: GenericObject
}

interface Section {
  code: string
  index: number
  title: string
}

export {
  GenericObject,
  TimelineEvent,
  TimelineStage,
  Timeline,
  TimelineEventType,
  MapOutput,
  Section,
}
