import { useEffect, useState } from 'react'
import { LanguageStrings, useLanguageProvider } from '../../contexts/Localisation'
import { ActivityLog, EventType, useGetActivityLogQuery } from '../../utils/generated/graphql'

type GenericObject = { [key: string]: any }

interface TimelineEvent {
  id: number
  eventType: TimelineEventType
  timestamp: Date
  displayString: string
  details: { [key: string]: any }
}

interface TimelineStage {
  number: number
  name: string
  timestamp: Date
  events: any[]
}

interface Timeline {
  stages: TimelineStage[]
  rawLog: ActivityLog[]
}

enum TimelineEventType {
  IGNORE,
  ERROR,
  APPLICATION_STARTED,
  APPLICATION_SUBMITTED,
  APPLICATION_RESTARTED,
  APPLICATION_RESUBMITTED,
  APPLICATION_EXPIRED,
  APPLICATION_WITHDRAWN,
  APPLICATION_APPROVED,
  APPLICATION_REJECTED,
  ASSIGNED_BY_ANOTHER,
  SELF_ASSIGNED,
  UNASSIGNED,
  REVIEW_STARTED,
  REVIEW_SUBMITTED,
  REVIEW_SUBMITTED_WITH_DECISION,
  REVIEW_RESTARTED,
  REVIEW_RESUBMITTED,
  REVIEW_RESUBMITTED_WITH_DECISION,
  CONSOLIDATION_STARTED,
  CONSOLIDATION_SUBMITTED,
  CONSOLIDATION_SUBMITTED_WITH_DECISION,
  CONSOLIDATION_RESTARTED,
  CONSOLIDATION_RESUBMITTED,
  CONSOLIDATION_RESUBMITTED_WITH_DECISION,
}

const useTimeline = (applicationId: number) => {
  const { strings } = useLanguageProvider()
  const [timeline, setTimeline] = useState<any>()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  const {
    data,
    loading: apolloLoading,
    error: apolloError,
  } = useGetActivityLogQuery({
    // skip: isLoading,
    // fetchPolicy: 'network-only',
  })

  useEffect(() => {
    if (apolloError) {
      setError(apolloError.message)
      setLoading(false)
    }
    if (data?.activityLogs?.nodes) {
      // Process data
      setTimeline(buildTimeline(data?.activityLogs?.nodes as ActivityLog[], strings))
      setLoading(false)
    }
  }, [data, apolloLoading, apolloError])

  return { error, loading, timeline }
}

export default useTimeline

const buildTimeline = (activityLog: ActivityLog[], strings: LanguageStrings): Timeline => {
  // Group by stage
  const stages: any = []
  let stageIndex = -1
  activityLog.forEach((event, index) => {
    if (event.type === 'STAGE') {
      // Stages become the parents of all other events
      const stage = { ...event.details, timestamp: event.timestamp, events: [] }
      stages.push(stage)
      stageIndex++
    } else {
      if (event.type === 'REVIEW_DECISION') return
      const timelineEvent = processEvent(event, activityLog, index, strings)
      if (timelineEvent.eventType !== TimelineEventType.IGNORE && stageIndex >= 0)
        stages[stageIndex].events.push(timelineEvent)
    }
  })
  return { stages, rawLog: activityLog }
}

type MapOutput = {
  eventType: TimelineEventType
  displayString?: (details: GenericObject) => string
}

const processEvent = (
  event: ActivityLog,
  fullLog: ActivityLog[],
  index: number,
  strings: LanguageStrings
): TimelineEvent => {
  const { id, timestamp, type, value, details } = event
  const eventMap: { [key in EventType]: { [key: string]: any } } = {
    // Map activity log entries to timeline-specific events
    STAGE: {}, // Already handled above
    STATUS: {
      Started: {
        eventType: TimelineEventType.APPLICATION_STARTED,
        displayString: () => strings.TIMELINE_APPLICATION_STARTED,
      },
      'Making changes': {
        eventType: TimelineEventType.APPLICATION_STARTED,
        displayString: () => 'Application re-started after making changes',
      },
      'New Stage': {
        eventType: TimelineEventType.IGNORE,
        displayString: () => '',
      },
      SUBMITTED: getApplicationSubmittedVariant(event),
    },
    OUTCOME: {
      PENDING: { eventType: TimelineEventType.IGNORE },
      EXPIRED: {},
      WITHDRAWN: {},
      APPROVED: {},
      REJECTED: {},
    },
    ASSIGNMENT: {
      Assigned: {
        eventType: TimelineEventType.ASSIGNED_BY_ANOTHER,
        displayString: ({ reviewer, sections, assigner }: GenericObject) =>
          strings.TIMELINE_ASSIGNED.replace('%1', `**${reviewer?.name}**`)
            .replace('%2', stringifySections(sections))
            .replace('%3', `**${assigner?.name}**`),
      },
      'Self-Assigned': {},
      UnAssigned: {},
    },
    REVIEW: { Started: {}, SUBMITTED: getReviewSubmittedVariant(event, fullLog, index) },
    REVIEW_DECISION: {},
    PERMISSION: {},
  }
  const { eventType, displayString: display } = eventMap?.[type]?.[value] || {
    eventType: TimelineEventType.ERROR,
    displayString: 'Problem loading this event',
  }
  const displayString = typeof display === 'function' ? display(event.details) : ''
  return { id, timestamp, eventType, displayString, details }
}

const getApplicationSubmittedVariant = (event: ActivityLog): MapOutput => {
  //   TO-DO: Figure out how to determine, for now just return "Submitted"
  return {
    eventType: TimelineEventType.APPLICATION_SUBMITTED,
    displayString: (details) => 'Application submitted',
  }
}
const getReviewSubmittedVariant = (
  event: ActivityLog,
  fullLog: ActivityLog[],
  index: number
): MapOutput => {
  return {
    eventType: TimelineEventType.REVIEW_SUBMITTED,
    displayString: (details) => `Review by ${details.reviewer.name} submitted`,
  }
}

interface Section {
  code: string
  index: number
  title: string
}
const stringifySections = (sections: Section[]) => {
  return `*${sections.map((section: Section) => section.title).join(', ')}*`
}
