import React, { useState } from 'react'
import { Button, Header, Icon, Label, List, Message, Segment } from 'semantic-ui-react'
import evaluate from '@openmsupply/expression-evaluator'
import Markdown from '../../utils/helpers/semanticReactMarkdown'
import { ApplicationProps, EvaluatorParameters } from '../../utils/types'
import { useUserState } from '../../contexts/UserState'
import { useRouter } from '../../utils/hooks/useRouter'
import strings from '../../utils/constants'
import { Link } from 'react-router-dom'

const ApplicationSubmission: React.FC<ApplicationProps> = ({ structure }) => {
  const [submissionMessageEvaluated, setSubmissionMessageEvaluated] = useState('')
  const {
    userState: { currentUser },
  } = useUserState()

  const {
    query: { serialNumber },
    push,
  } = useRouter()
  const {
    info: { submissionMessage, type },
    stages,
  } = structure

  const evaluatorParams: EvaluatorParameters = {
    objects: { currentUser },
    APIfetch: fetch,
  }
  evaluate(submissionMessage || '', evaluatorParams).then((result: any) =>
    setSubmissionMessageEvaluated(result)
  )

  // useEffect(() => {
  //   if (!isApplicationReady) return
  //   const status = application?.current?.status
  //   // Check if application is in Draft or Changes required status and redirect to the summary page
  //   // Note: The summary page has its own redirection logic to a specific page (with invalid items).
  //   if (status === ApplicationStatus.Draft || status === ApplicationStatus.ChangesRequired) {
  //     push(`/application/${serialNumber}/summary`)
  //   }
  // }, [isApplicationReady])

  return (
    <Segment.Group style={{ backgroundColor: 'Gainsboro', display: 'flex' }}>
      <Header textAlign="center">
        {currentUser?.organisation?.orgName || strings.TITLE_NO_ORGANISATION}
      </Header>
      <Segment
        textAlign="center"
        style={{
          backgroundColor: 'white',
          padding: 10,
          margin: '0px 50px',
          minHeight: 500,
          flex: 1,
        }}
      >
        <Header icon>
          <Icon name="clock outline" color="blue" size="huge" />
          {strings.LABEL_PROCESSING}
        </Header>
        <Markdown text={submissionMessageEvaluated} />
        <Segment basic textAlign="left" style={{ margin: '50px 50px', padding: 10 }}>
          <Header as="h5">{strings.SUBTITLE_SUBMISSION_STEPS}</Header>
          <List>
            {stages.map(({ title, description }) =>
              title ? (
                <List.Item key={`list_stage_${title}`}>
                  <List.Header>{title}</List.Header>
                  {description}
                </List.Item>
              ) : null
            )}
          </List>
        </Segment>
        <Segment basic textAlign="center" style={{ margin: '50px 50px', padding: 10 }}>
          <Button
            color="blue"
            as={Link}
            to={`/applicationNEW/${serialNumber}/summary`}
            style={{ minWidth: 200 }}
            content={`${strings.BUTTON_BACK_TO} ${type}`}
          />
          <Label as={Link} to={'/'} content={strings.BUTTON_BACK_DASHBOARD} />
        </Segment>
      </Segment>
    </Segment.Group>
  )
}

export default ApplicationSubmission
