import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Button, Divider, Grid, Header, List, Progress, Segment, Sticky } from 'semantic-ui-react'
import strings from '../../utils/constants'
import { EvaluatorParameters, SectionDetails, TemplateDetails } from '../../utils/types'
import ApplicationSelectType from './ApplicationSelectType'
import Markdown from '../../utils/helpers/semanticReactMarkdown'
import evaluate from '@openmsupply/expression-evaluator'
import { useUserState } from '../../contexts/UserState'
export interface ApplicationStartProps {
  template: TemplateDetails
  sections: SectionDetails[]
  handleClick?: () => void
  setSummaryButtonClicked?: () => void
}

const ApplicationStart: React.FC<ApplicationStartProps> = ({
  template,
  sections,
  handleClick,
  setSummaryButtonClicked,
}) => {
  const { name, code, startMessage } = template
  const [startMessageEvaluated, setStartMessageEvaluated] = useState('')
  const [isApplicationCompleted, setIsApplicationCompleted] = useState(false)
  const [firstIncomplete, setFirstIncomplete] = useState<string>()
  const {
    userState: { currentUser },
  } = useUserState()

  useEffect(() => {
    if (!currentUser) return
    const evaluatorParams: EvaluatorParameters = {
      objects: { currentUser },
      APIfetch: fetch,
    }
    evaluate(startMessage || '', evaluatorParams).then((result: any) =>
      setStartMessageEvaluated(result)
    )

    const isApplicationCompleted = Object.values(sections).every(
      ({ progress }) => progress?.completed
    )
    if (!isApplicationCompleted) findFirstIncompleteSection()

    setIsApplicationCompleted(isApplicationCompleted)
  }, [startMessage, currentUser])

  const findFirstIncompleteSection = () => {
    const firstIncompleteLocation = Object.entries(sections)
      .filter(([_, section]) => section.progress)
      .sort(([aKey], [bKey]) => (aKey < bKey ? -1 : 1))
      .find(([_, section]) => !section.progress?.completed || !section.progress.valid)

    if (firstIncompleteLocation) {
      const [_, section] = firstIncompleteLocation
      setFirstIncomplete(section.code)
    }
  }

  return template ? (
    <Segment.Group style={{ backgroundColor: 'Gainsboro', display: 'flex' }}>
      <Button
        as={Link}
        to={`/applications?type=${code}`}
        icon="angle left"
        label={{ content: `${name} ${strings.LABEL_APPLICATIONS}`, color: 'grey' }}
      />
      <Header textAlign="center">
        {currentUser?.organisation?.orgName || strings.TITLE_NO_ORGANISATION}
      </Header>
      <Segment
        style={{
          backgroundColor: 'white',
          padding: 10,
          margin: '0px 50px',
          minHeight: 500,
          flex: 1,
        }}
      >
        <Header as="h2" textAlign="center">
          {`${name} ${strings.TITLE_APPLICATION_FORM}`}
          <Header.Subheader>{strings.TITLE_INTRODUCTION}</Header.Subheader>
        </Header>
        {template && (
          <Segment basic>
            <Header as="h5">{strings.SUBTITLE_APPLICATION_STEPS}</Header>
            <Header as="h5">{strings.TITLE_STEPS.toUpperCase()}</Header>
            <List divided relaxed="very">
              {sections &&
                Object.entries(sections).map(([_, { code: sectionCode, progress, title }]) => {
                  return (
                    <List.Item
                      key={`list-item-${sectionCode}`}
                      children={
                        <Grid>
                          <Grid.Column width={1}>
                            {progress?.completed ? (
                              <List.Icon color="green" name="check circle" />
                            ) : (
                              <List.Icon name="circle outline" />
                            )}
                          </Grid.Column>
                          <Grid.Column width={10}>
                            <p>{title}</p>
                          </Grid.Column>
                          <Grid.Column width={3}>
                            {progress && progress.done > 0 && progress.total > 0 && (
                              <Progress
                                percent={(100 * progress.done) / progress.total}
                                size="tiny"
                                success={progress.valid}
                                error={!progress.valid}
                              />
                            )}
                          </Grid.Column>
                          <Grid.Column width={2}>
                            {progress && sectionCode === firstIncomplete && (
                              <Button
                                color="blue"
                                as={Link}
                                //to={link} // TODO: Link not working - page doesn't refresh!
                                content={strings.BUTTON_APPLICATION_RESUME}
                              />
                            )}
                          </Grid.Column>
                        </Grid>
                      }
                    ></List.Item>
                  )
                })}
            </List>
            <Divider />
            <Markdown text={startMessageEvaluated} semanticComponent="Message" info />
            {handleClick && (
              <Button color="blue" onClick={handleClick}>
                {strings.BUTTON_APPLICATION_START}
              </Button>
            )}
          </Segment>
        )}
      </Segment>
      {isApplicationCompleted && (
        <Sticky
          pushing
          style={{ backgroundColor: 'white', boxShadow: ' 0px -5px 8px 0px rgba(0,0,0,0.1)' }}
        >
          <Segment basic textAlign="right">
            <Button color="blue" onClick={setSummaryButtonClicked}>
              {strings.BUTTON_SUMMARY}
            </Button>
          </Segment>
        </Sticky>
      )}
    </Segment.Group>
  ) : (
    <ApplicationSelectType />
  )
}

export default ApplicationStart
