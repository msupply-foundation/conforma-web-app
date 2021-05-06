import React from 'react'
import { Button, Header, Icon, Label, List, Segment, Container } from 'semantic-ui-react'
import Markdown from '../../utils/helpers/semanticReactMarkdown'
import { ApplicationProps } from '../../utils/types'
import { useUserState } from '../../contexts/UserState'
import { useRouter } from '../../utils/hooks/useRouter'
import strings from '../../utils/constants'
import { Link } from 'react-router-dom'
import { ApplicationStatus } from '../../utils/generated/graphql'

const ApplicationSubmission: React.FC<ApplicationProps> = ({ structure }) => {
  const {
    userState: { currentUser },
    logout,
  } = useUserState()

  const {
    query: { serialNumber },
    push,
  } = useRouter()
  const {
    info: { current, submissionMessage, name },
    stages,
  } = structure

  // Check if application not submitted and redirect to the summary page
  // Note: The summary page has its own redirection logic to a specific page (with invalid items).
  if (
    current?.status === ApplicationStatus.Draft ||
    current?.status === ApplicationStatus.ChangesRequired
  )
    push(`/application/${serialNumber}/summary`)

  return (
    <Container id="application-summary">
      <Segment basic textAlign="center">
        <Header as="h4" icon>
          <Icon name="clock outline" className="information-colour" size="huge" />
          {strings.LABEL_PROCESSING}
        </Header>
        <Markdown text={submissionMessage || ''} />
        {currentUser?.username !== strings.USER_NONREGISTERED && (
          <>
            <Segment basic textAlign="left">
              <p>{strings.SUBTITLE_SUBMISSION_STEPS}</p>
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
            <Segment basic textAlign="center">
              <Button
                color="blue"
                as={Link}
                to={`/application/${serialNumber}/summary`}
                content={`${strings.BUTTON_BACK_TO} ${name}`}
              />
              <Label as={Link} to={'/'} content={strings.BUTTON_BACK_DASHBOARD} />
            </Segment>
          </>
        )}
        {currentUser?.username === strings.USER_NONREGISTERED && (
          <Button primary onClick={() => logout()}>
            {strings.ACTION_CONTINUE}
          </Button>
        )}
      </Segment>
    </Container>
  )
}

export default ApplicationSubmission
