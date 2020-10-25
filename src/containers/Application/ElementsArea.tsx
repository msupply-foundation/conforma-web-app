import React from 'react'
import { Button, Container, Grid, Header, Label, Segment } from 'semantic-ui-react'
import { ApplicationViewWrapper } from '../../elementPlugins'
import useLoadElements from '../../utils/hooks/useLoadElements'
import { Loading } from '../../components'

interface ElementsAreaProps {
  applicationId: number
  sectionTitle: string
  sectionTempId: number
  sectionPage: number
  isFirstPage: boolean
  isLastPage: boolean
  onNextClicked: () => void
  onPreviousClicked: () => void
}

const ElementsArea: React.FC<ElementsAreaProps> = ({
  applicationId,
  sectionTitle,
  sectionTempId,
  sectionPage,
  isFirstPage,
  isLastPage,
  onNextClicked,
  onPreviousClicked,
}) => {
  const { elements, loading, error } = useLoadElements({
    applicationId,
    sectionTempId,
    sectionPage,
  })

  return (
    <Container textAlign="left">
      {error ? (
        <Label content="Problem to load elements" error={error} />
      ) : loading ? (
        <Loading />
      ) : elements ? (
        <Segment>
          <Header content={sectionTitle} />
          {elements.map(({ question }) => (
            <ApplicationViewWrapper
              key={`question_${question.code}`}
              initialValue={'Test'}
              templateElement={question}
              onUpdate={() => console.log('onUpdate called')}
              isVisible={true}
              isEditable={true}
            />
          ))}
          <Grid columns={3}>
            <Grid.Row>
              <Grid.Column>
                {!isFirstPage && (
                  <PageButton title="Previous" type="left" onClicked={onPreviousClicked} />
                )}
              </Grid.Column>
              <Grid.Column />
              {/* Empty cell */}
              <Grid.Column>
                {!isLastPage && <PageButton title="Next" type="right" onClicked={onNextClicked} />}
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Segment>
      ) : (
        <Label content="Elements area can't be displayed" />
      )}
    </Container>
  )
}

type ButtonDirection = 'left' | 'right'

interface PageButtonProps {
  title: string
  type: ButtonDirection
  onClicked: () => void
}

const PageButton: React.FC<PageButtonProps> = (props) => {
  const { title, type, onClicked } = props
  return (
    <Button
      labelPosition={type}
      icon={type === 'right' ? 'right arrow' : 'left arrow'}
      content={title}
      onClick={() => onClicked()}
    />
  )
}

export default ElementsArea
