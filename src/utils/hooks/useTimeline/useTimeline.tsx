import { useEffect, useState } from 'react'
import { LanguageStrings, useLanguageProvider } from '../../../contexts/Localisation'
import { ActivityLog, EventType, useGetActivityLogQuery } from '../../generated/graphql'
import { FullStructure } from '../../types'
import {
  getAssignmentEvent,
  getOutcomeEvent,
  getReviewEvent,
  getStatusEvent,
} from './eventInterpretation'
import { TimelineStage, Timeline, TimelineEventType, EventOutput, TimelineEvent } from './types'

const useTimeline = (structure: FullStructure) => {
  const { strings } = useLanguageProvider()
  const [timeline, setTimeline] = useState<Timeline>()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  const { data, error: apolloError } = useGetActivityLogQuery({
    variables: { applicationId: structure.info.id },
    // fetchPolicy: 'network-only',
  })

  useEffect(() => {
    if (apolloError) {
      setError(apolloError.message)
      setLoading(false)
    }
    if (data?.activityLogs?.nodes) {
      setTimeline(buildTimeline(data?.activityLogs?.nodes as ActivityLog[], structure, strings))
      setLoading(false)
    }
  }, [data, apolloError])

  return { error, loading, timeline }
}

export default useTimeline

const buildTimeline = (
  activityLog: ActivityLog[],
  structure: FullStructure,
  strings: LanguageStrings
): Timeline => {
  // Group by stage
  const stages: TimelineStage[] = []
  let stageIndex = -1
  let finalOutcome: TimelineEvent | null = null
  activityLog.forEach((event, index) => {
    if (event.type === 'STAGE') {
      // Stages become the parents of all other events
      stages.push({ ...event.details.stage, timestamp: event.timestamp, events: [] })
      stageIndex++
    } else {
      const timelineEvent = {
        id: event.id,
        timestamp: event.timestamp,
        details: event.details,
        ...generateTimelineEvent[event.type](event, activityLog, structure, index, strings),
      }
      if (timelineEvent.eventType === TimelineEventType.Error)
        console.log('Problem with event:', event)
      if (event.type === 'OUTCOME' && event.value !== 'PENDING') finalOutcome = timelineEvent
      else if (
        // Show special changes required message is currently waiting
        ((event.type === 'STATUS' || event.type === 'REVIEW') &&
          event.value === 'CHANGES_REQUIRED' &&
          index === activityLog.length - 1) ||
        // Normal event
        (timelineEvent.eventType !== TimelineEventType.Ignore && stageIndex >= 0)
      )
        stages[stageIndex].events.push(timelineEvent)
    }
  })
  // Put final outcome at the end of the event list
  if (finalOutcome) stages[stageIndex].events.push(finalOutcome)
  // Placeholder event if no activity yet in stage
  if (stageIndex > -1 && stages[stageIndex].events.length === 0)
    stages[stageIndex].events.push({
      eventType: TimelineEventType.Ignore,
      displayString: `*${strings.TIMELINE_NO_ACTIVITY}*`,
      id: 0,
      timestamp: stages[stageIndex].timestamp,
      details: {},
    })
  return {
    stages,
    rawLog: activityLog,
  }
}

const generateTimelineEvent: {
  [key in EventType]: (
    event: ActivityLog,
    fullLog: ActivityLog[],
    structure: FullStructure,
    index: number,
    strings: LanguageStrings
  ) => EventOutput
} = {
  STAGE: () =>
    // Already handled in caller
    ({ eventType: TimelineEventType.Ignore, displayString: '' }),
  STATUS: (event, fullLog, _, __, strings) => getStatusEvent(event, fullLog, strings),
  OUTCOME: (event, _, __, ___, strings) => getOutcomeEvent(event, strings),
  ASSIGNMENT: (event, _, structure, __, strings) => getAssignmentEvent(event, structure, strings),
  REVIEW: (event, fullLog, structure, index, strings) =>
    getReviewEvent(event, fullLog, structure, index, strings),
  REVIEW_DECISION: () =>
    // Ignore all because decision gets combined into Review event
    ({ eventType: TimelineEventType.Ignore, displayString: '' }),
  PERMISSION: () =>
    // Not interpreted in Timeline
    ({ eventType: TimelineEventType.Ignore, displayString: '' }),
}
