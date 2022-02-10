import React from 'react'
import { DateTime } from 'luxon'
import { Header, Icon, Message, Segment } from 'semantic-ui-react'
import { useLanguageProvider } from '../../../contexts/Localisation'
import useLocalisedEnums from '../../../utils/hooks/useLocalisedEnums'
import { FullStructure } from '../../../utils/types'
import { ActivityLog, ApplicationOutcome } from '../../../utils/generated/graphql'

export const Overview: React.FC<{
  structure: FullStructure
  activityLog: ActivityLog[]
}> = ({
  structure: {
    info: { current, outcome, user, org, serial, template },
  },
  activityLog,
}) => {
  const { strings } = useLanguageProvider()
  const { Outcome } = useLocalisedEnums()
  const applicant = `${user?.firstName} ${user?.lastName}`
  const organisation = org?.name
  const { started, completed } = getDates(activityLog)
  const stage = current.stage.name

  return (
    <div id="overview">
      <Segment basic>
        <Message info icon>
          <Icon name="info circle" color="teal" />
          <Message.Content>
            <div className="flex-row-center wrap">
              <Header as="h3">
                <strong>{template.name}</strong>
              </Header>
            </div>
            <div className="flex-row wrap">
              <p className="left-item">
                <strong>{strings.REVIEW_OVERVIEW_APPLICANT}: </strong>
                {applicant}
              </p>
              <p className="right-item">
                <strong>{strings.REVIEW_OVERVIEW_ORG}: </strong>
                {organisation || <em>{strings.LABEL_NO_ORG}</em>}
              </p>
            </div>
            <div className="flex-row wrap">
              <p className="left-item">
                <strong>{strings.REVIEW_OVERVIEW_STARTED}: </strong>
                {DateTime.fromISO(started).toLocaleString()}
              </p>
              <p className="right-item">
                <strong>{strings.REVIEW_OVERVIEW_COMPLETED}: </strong>
                {(completed && DateTime.fromISO(completed).toLocaleString()) || '...'}
              </p>
            </div>
            <div className="flex-row wrap">
              <p className="left-item">
                <strong>{strings.REVIEW_OVERVIEW_STAGE}: </strong>
                {stage}
              </p>
              <p className="right-item">
                <strong>{strings.REVIEW_OVERVIEW_OUTCOME}: </strong>
                {Outcome[outcome as ApplicationOutcome]}
              </p>
            </div>
            <div className="flex-row wrap">
              <p className="left-item">
                <strong>{strings.REVIEW_OVERVIEW_SERIAL}: </strong>
                {serial}
              </p>
            </div>
          </Message.Content>
        </Message>
      </Segment>
    </div>
  )
}

const getDates = (activityLog: ActivityLog[]): { started: string; completed: string } => {
  const startEvent = activityLog.find((e) => e.type === 'STATUS' && e.value === 'DRAFT')
  const endEvent = activityLog.find((e) => e.type === 'OUTCOME' && e.value !== 'PENDING')
  return { started: startEvent?.timestamp, completed: endEvent?.timestamp }
}
