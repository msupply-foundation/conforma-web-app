import React from 'react'
import { Button, Container, Grid, Header, Label, Segment } from 'semantic-ui-react'
import { ApplicationViewWrapper } from '../../elementPlugins'
import useLoadElements from '../../utils/hooks/useLoadElements'
import { Loading } from '../../components'
import { useUpdateResponseMutation } from '../../utils/generated/graphql'

interface ElementsAreaProps {
  applicationId: number
  sectionTitle: string
  sectionTemplateId: number
  sectionPage: number
  isFirstPage: boolean
  isLastPage: boolean
  onNextClicked: () => void
  onPreviousClicked: () => void
}

const ElementsArea: React.FC<ElementsAreaProps> = ({
  applicationId,
  sectionTitle,
  sectionTemplateId: sectionTempId,
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

  const [responseMutation] = useUpdateResponseMutation()

  return error ? (
    <Label content="Problem to load elements" error={error} />
  ) : loading ? (
    <Loading />
  ) : elements ? (
    <Segment vertical>
      <Header content={sectionTitle} />
      {elements.map(({ question, response }) => (
        <ApplicationViewWrapper
          key={`question_${question.code}`}
          initialValue={response?.value}
          templateElement={question}
          onUpdate={(updateObject) => {
            const { isValid, value } = updateObject
            /**
             * Note: Issue #46 (Persist cache) will change this to only write to cache
             * sending the whole application changes to the server on Submit...
             * Also considering send to server on 'Next' or adding a Save button.
             **/
            // TODO: Only send mutation on loose focus event.
            if (isValid) responseMutation({ variables: { id: response?.id as number, value } })
          }}
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
            {!isLastPage ? (
              <PageButton title="Next" type="right" onClicked={onNextClicked} />
            ) : (
              <PageButton title="Summary" type="right" onClicked={onNextClicked} />
            )}
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Segment>
  ) : (
    <Label content="Elements area can't be displayed" />
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
