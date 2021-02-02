import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Button, Divider, Grid, Header, List, Progress, Segment } from 'semantic-ui-react'
import strings from '../../utils/constants'
import { TemplateType, EvaluatorParameters, SectionsProgress } from '../../utils/types'
import ApplicationSelectType from './ApplicationSelectType'
import Markdown from '../../utils/helpers/semanticReactMarkdown'
import evaluate from '@openmsupply/expression-evaluator'
import { useUserState } from '../../contexts/UserState'
export interface ApplicationStartProps {
  template: TemplateType
  sectionsProgress: SectionsProgress
  handleClick?: () => void
}

const ApplicationStart: React.FC<ApplicationStartProps> = ({
  template,
  sectionsProgress,
  handleClick,
}) => {
  const { name, code, startMessage } = template
  const [startMessageEvaluated, setStartMessageEvaluated] = useState('')
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

    findFirstImcompleteSection()
  }, [startMessage, currentUser])

  const findFirstImcompleteSection = () => {
    const firstIncompleteSection = Object.entries(sectionsProgress)
      .filter(([_, section]) => section.progress)
      .sort(([aKey], [bKey]) => (aKey < bKey ? -1 : 1))
      .find(([_, section]) => !section.progress.completed || !section.progress.valid)

    if (firstIncompleteSection) {
      const [index, section] = firstIncompleteSection
      setFirstIncomplete(section.info.code)
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
              {sectionsProgress &&
                Object.entries(sectionsProgress).map(([_, { info, progress, link }]) => {
                  return (
                    <List.Item
                      key={`list-item-${info.code}`}
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
                            <p>{info.title}</p>
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
                            {progress && info.code === firstIncomplete && (
                              <Button
                                color="blue"
                                as={Link}
                                to={link} // TODO: Link not working - page doesn't refresh!
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
    </Segment.Group>
  ) : (
    <ApplicationSelectType />
  )
}

export default ApplicationStart
