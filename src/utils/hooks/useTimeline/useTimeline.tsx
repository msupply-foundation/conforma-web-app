import { useEffect, useState } from 'react'
import { LanguageStrings, useLanguageProvider } from '../../../contexts/Localisation'
import { ActivityLog, useGetActivityLogQuery } from '../../generated/graphql'
import EventMap from './eventMap'
import { TimelineStage, Timeline, TimelineEventType } from './types'

const useTimeline = (applicationId: number) => {
  const { strings } = useLanguageProvider()
  const [timeline, setTimeline] = useState<Timeline>()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  const {
    data,
    loading: apolloLoading,
    error: apolloError,
  } = useGetActivityLogQuery({
    variables: { applicationId },
    // fetchPolicy: 'network-only',
  })

  useEffect(() => {
    if (apolloError) {
      setError(apolloError.message)
      setLoading(false)
    }
    if (data?.activityLogs?.nodes) {
      setTimeline(buildTimeline(data?.activityLogs?.nodes as ActivityLog[], strings))
      setLoading(false)
    }
  }, [data, apolloLoading, apolloError])

  return { error, loading, timeline }
}

export default useTimeline

const buildTimeline = (activityLog: ActivityLog[], strings: LanguageStrings): Timeline => {
  // Group by stage
  const eventMap = new EventMap(activityLog, strings)
  const stages: TimelineStage[] = []
  let stageIndex = -1
  activityLog.forEach((event, index) => {
    if (event.type === 'STAGE') {
      // Stages become the parents of all other events
      stages.push({ ...event.details.stage, timestamp: event.timestamp, events: [] })
      stageIndex++
    } else {
      const timelineEvent = eventMap.getTimelineEvent(event, index)
      if (timelineEvent.eventType !== TimelineEventType.Ignore && stageIndex >= 0)
        stages[stageIndex].events.push(timelineEvent)
    }
  })
  return {
    stages,
    rawLog: activityLog,
  }
}
