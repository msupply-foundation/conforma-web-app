import React, { useState } from 'react'
import { DateTime } from 'luxon'
import { Header, Icon, Message, Segment, Button, Form } from 'semantic-ui-react'
import { useLanguageProvider } from '../../../contexts/Localisation'
import useLocalisedEnums from '../../../utils/hooks/useLocalisedEnums'
import useConfirmationModal from '../../../utils/hooks/useConfirmationModal'
import { postRequest } from '../../../utils/helpers/fetchMethods'
import { FullStructure } from '../../../utils/types'
import { ActivityLog, ApplicationOutcome } from '../../../utils/generated/graphql'
import config from '../../../config'
import getServerUrl from '../../../utils/helpers/endpoints/endpointUrlBuilder'

export const Overview: React.FC<{
  structure: FullStructure
  activityLog: ActivityLog[]
}> = ({
  structure: {
    info: { current, outcome, user, org, serial, id, template },
    applicantDeadline,
    reload,
  },
  activityLog,
}) => {
  const { strings } = useLanguageProvider()
  const { Outcome } = useLocalisedEnums()
  const [deadlineDays, setDeadlineDays] = useState(5)
  const { ConfirmModal, showModal } = useConfirmationModal()
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
              {applicantDeadline.deadline && applicantDeadline.isActive && (
                <p className="right-item">
                  <strong>{strings.REVIEW_OVERVIEW_DEADLINE}: </strong>
                  {DateTime.fromJSDate(applicantDeadline.deadline).toLocaleString()}
                </p>
              )}
            </div>
            {applicantDeadline &&
              (outcome === ApplicationOutcome.Expired ||
                outcome === ApplicationOutcome.Pending) && (
                <div className="flex-row-start-center" style={{ gap: 10, marginTop: 30 }}>
                  {strings.REVIEW_OVERVIEW_EXTEND_BY}
                  <Form.Input
                    size="mini"
                    type="number"
                    min={1}
                    value={deadlineDays}
                    onChange={(e) => setDeadlineDays(Number(e.target.value))}
                    style={{ maxWidth: 65 }}
                  />
                  <span style={{ marginRight: 20 }}>
                    {deadlineDays > 1
                      ? strings.REVIEW_OVERVIEW_DAYS
                      : strings.REVIEW_OVERVIEW_DAYS_SINGULAR}
                  </span>
                  <Button
                    primary
                    inverted
                    onClick={() =>
                      showModal({
                        message:
                          deadlineDays === 1
                            ? strings.REVIEW_OVERVIEW_MODAL_MESSAGE_SINGULAR
                            : strings.REVIEW_OVERVIEW_MODAL_MESSAGE.replace(
                                '%1',
                                String(deadlineDays)
                              ),
                        onConfirm: async () => {
                          await extendDeadline(id, deadlineDays)
                          reload()
                        },
                      })
                    }
                  >
                    {strings.REVIEW_OVERVIEW_BUTTON_EXTEND}
                  </Button>
                </div>
              )}
          </Message.Content>
        </Message>
        <ConfirmModal />
      </Segment>
    </div>
  )
}

const getDates = (activityLog: ActivityLog[]): { started: string; completed: string } => {
  const startEvent = activityLog.find((e) => e.type === 'STATUS' && e.value === 'DRAFT')
  const endEvent = activityLog.find((e) => e.type === 'OUTCOME' && e.value !== 'PENDING')
  return { started: startEvent?.timestamp, completed: endEvent?.timestamp }
}

const extendDeadline = async (applicationId: number, days: number) => {
  const payload = { applicationId, eventCode: config.applicantDeadlineCode, extensionTime: days }

  await postRequest({
    url: getServerUrl('extendApplication'),
    jsonBody: payload,
    headers: { 'Content-Type': 'application/json' },
  })
}
