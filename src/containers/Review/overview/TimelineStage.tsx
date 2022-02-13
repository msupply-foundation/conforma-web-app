import React, { useState } from 'react'
import { DateTime } from 'luxon'
import { Container, Accordion, Icon, List } from 'semantic-ui-react'
import { TimelineEvent, TimelineStage } from '../../../utils/hooks/useTimeline/types'
import { Stage } from '../../../components/Review'
import Markdown from '../../../utils/helpers/semanticReactMarkdown'

export const TimelineStageUI: React.FC<{
  stage: TimelineStage
  isCurrentStage: boolean
}> = ({ stage, isCurrentStage }) => {
  const [isActive, setIsActive] = useState(isCurrentStage)

  const groupedEvents = groupEventsByDate(stage.events)

  return (
    <Container className="timeline-stage">
      <Accordion>
        <Accordion.Title active={isActive} onClick={() => setIsActive(!isActive)}>
          <Icon name="dropdown" />
          <Stage name={stage.name} colour={stage.colour} />
        </Accordion.Title>
        <Accordion.Content active={isActive}>
          {groupedEvents.map((group) => (
            <div className="timeline-day" key={group.dateString}>
              <List>
                <List.Header>
                  <strong>{group.dateString}</strong>
                </List.Header>
                {group.events.map((event) => (
                  <List.Item key={event.id}>
                    <Markdown text={event.displayString} newTabLinks={true} />
                  </List.Item>
                ))}
              </List>
            </div>
          ))}
        </Accordion.Content>
      </Accordion>
    </Container>
  )
}

interface GroupedEvent {
  dateString: string
  events: TimelineEvent[]
}
const groupEventsByDate = (events: TimelineEvent[]): GroupedEvent[] => {
  const groupedEvents: GroupedEvent[] = []
  let currentDate: string
  events.forEach((event) => {
    const thisDate = DateTime.fromISO(event.timestamp).toLocaleString()
    if (thisDate === currentDate) {
      // add event to current group
      groupedEvents[groupedEvents.length - 1].events.push(event)
    } else {
      // start a new group
      groupedEvents.push({ dateString: thisDate, events: [event] })
    }
    currentDate = thisDate
  })
  return groupedEvents
}
