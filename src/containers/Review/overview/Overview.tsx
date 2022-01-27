import React, { useState } from 'react'
import { DateTime } from 'luxon'
import { Container, Accordion, Icon, Message, Label, Segment } from 'semantic-ui-react'
import { useLanguageProvider } from '../../../contexts/Localisation'
import { Timeline, TimelineEvent, TimelineStage } from '../../../utils/hooks/useTimeline/types'
import useLocalisedEnums from '../../../utils/hooks/useLocalisedEnums'
import { FullStructure } from '../../../utils/types'
import { ActivityLog, ApplicationOutcome } from '../../../utils/generated/graphql'

export const Overview: React.FC<{
  structure: FullStructure
  activityLog: ActivityLog[]
}> = ({
  structure: {
    info: { current, outcome, user, org, serial },
  },
  activityLog,
}) => {
  const { strings } = useLanguageProvider()
  const [isActive, setIsActive] = useState(true)
  const { Outcome } = useLocalisedEnums()

  const applicant = `${user?.firstName} ${user?.lastName}`
  const organisation = org?.name
  const { started, completed } = getDates(activityLog)

  const stage = current.stage.name

  console.log(serial, applicant, organisation, outcome, started, completed, stage)

  return (
    <div id="overview">
      {/* <Label className="simple-label" size="big">
        {serial}
      </Label> */}
      <Segment basic>
        <Message info icon>
          <Icon name="info circle" />
          <Message.Content>
            <div className="flex-row wrap">
              <p className="left-item">
                <strong>Applicant: </strong>
                {applicant}
              </p>
              <p className="right-item">
                <strong>Organisation: </strong>
                {organisation}
              </p>
            </div>
            <div className="flex-row wrap">
              <p className="left-item">
                <strong>Started: </strong>
                {DateTime.fromISO(started).toLocaleString()}
              </p>
              <p className="right-item">
                <strong>Completed: </strong>
                {completed && DateTime.fromISO(completed).toLocaleString()}
              </p>
            </div>
            <div className="flex-row wrap">
              <p className="left-item">
                <strong>Stage: </strong>
                {stage}
              </p>
              <p className="right-item">
                <strong>Outcome: </strong>
                {Outcome[outcome as ApplicationOutcome]}
              </p>
            </div>
          </Message.Content>
        </Message>
      </Segment>
    </div>
  )
}

const getDates = (activityLog: ActivityLog[]): { started: string; completed: string } => {
  console.log(activityLog)
  const startEvent = activityLog.find((e) => e.type === 'STATUS' && e.value === 'Started')
  const endEvent = activityLog.find((e) => e.type === 'OUTCOME' && e.value !== 'PENDING')
  console.log('endEvent', endEvent)
  return { started: startEvent?.timestamp, completed: endEvent?.timestamp }
}
