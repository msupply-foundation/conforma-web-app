import React, { useState, useEffect } from 'react'
import {
  Accordion,
  Button,
  Card,
  Container,
  Grid,
  Header,
  Icon,
  Label,
  Segment,
} from 'semantic-ui-react'
import { DecisionArea, Loading, NoMatch, } from '../../components'
import {  FullStructure, SectionStateNEW } from '../../utils/types'

import { useRouter } from '../../utils/hooks/useRouter'
import {
  ReviewAssignment,
  ReviewResponse,
  ReviewStatus,
  useUpdateReviewResponseMutation,
} from '../../utils/generated/graphql'
import strings from '../../utils/constants'

import useGetFullReviewStructure from '../../utils/hooks/useGetFullReviewStructure'
import { SummaryViewWrapper } from '../../formElementPlugins'



const ReviewPage: React.FC<{ reviewAssignment: ReviewAssignment; structure: FullStructure }> = ({
  reviewAssignment,
  structure,
}) => {
  const {
    replace,
    location,
    query: { activeSection },
  } = useRouter()


  const { fullStructure, error } = useGetFullReviewStructure({ reviewAssignment, structure })

  const changeActiveSectinon = (sectionCode: string) => () => {
    if (activeSection === sectionCode) replace(`${location.pathname}`)
    else replace(`${location.pathname}?activeSection=${sectionCode}`)
  }

  console.log(reviewAssignment)
  console.log(fullStructure)
  return error ? (
    <NoMatch />
  ) : !fullStructure ? (
    <Loading />
  ) : (
    <>
      <Segment.Group>
        <Segment textAlign="center">
          <Label color="blue">{strings.STAGE_PLACEHOLDER}</Label>
          <Header content={structure.info.name} subheader={strings.DATE_APPLICATION_PLACEHOLDER} />
          <Header
            as="h3"
            color="grey"
            content={strings.TITLE_REVIEW_SUMMARY}
            subheader={strings.SUBTITLE_REVIEW}
          />
        </Segment>
        <Segment basic style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Accordion fluid style={{ maxWidth: '700px' }}>
            {Object.entries(structure.sections).map(([sectionCode, section], index) => {
              const isActive = activeSection === sectionCode
              return (
                <Segment
                  key={sectionCode}
                  style={{ background: 'rgb(248,248,248', borderRadius: 7 }}
                >
                  <Accordion.Title
                    active={isActive}
                    index={index}
                    onClick={changeActiveSectinon(sectionCode)}
                  >
                    <TitleContent section={section} isActive={isActive} />
                  </Accordion.Title>
                  <Accordion.Content active={isActive}>
                    <Content
                      section={section}
                      isEditable={reviewAssignment.reviews?.nodes[0]?.status === ReviewStatus.Draft}
                      structure={fullStructure}
                    />
                  </Accordion.Content>
                </Segment>
              )
            })}
          </Accordion>
        </Segment>
        <Segment
          basic
          style={{
            marginLeft: '10%',
            marginRight: '10%',
          }}
        >
          Submit Button
        </Segment>
      </Segment.Group>
    </>
  )
}

const ReviewComponent: React.FC<{}> = () => {

  return (<Segment key={`ReviewElement_${element.code}`}>
  <Grid columns={2} verticalAlign="middle">
    <Grid.Row>
      <Grid.Column>
        <SummaryViewWrapper {...summaryViewProps} />
      </Grid.Column>
      <Grid.Column>
        {response?.reviewResponse && isEditable && (
          <Container textAlign="right">
            {!response?.reviewResponse?.decision && (
              <Button
                size="small"
                // onClick={() => setDecisionArea(review, summaryViewProps)}
                content={strings.BUTTON_REVIEW_RESPONSE}
              />
            )}
          </Container>
        )}
      </Grid.Column>
    </Grid.Row>
    {response?.reviewResponse && isEditable && reviewResponse?.decision && (
      <Grid.Row>
        <Card fluid>
          <Card.Content>
            <Grid>
              <Grid.Row>
                <Grid.Column width="10">
                  <Card.Header>{reviewResponse.decision}</Card.Header>
                  <Card.Description>{reviewResponse.comment}</Card.Description>
                  {/* {assigned && (
                        <Card.Meta>{`${assigned.firstName} ${assigned.lastName}`}</Card.Meta>
                      )} */}
                </Grid.Column>
                <Grid.Column width="2">
                  <Icon
                    name="pencil square"
                    color="blue"
                    style={{ minWidth: 100 }}
                    // onClick={() => setDecisionArea(review, summaryViewProps)}
                  />
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Card.Content>
        </Card>
      </Grid.Row>
    )}
  </Grid>
</Segment>
)
// }
})}
{notReviewedResponses.length > 0 && (
<Button
color="blue"
inverted
style={{ margin: 10 }}
onClick={() => {
  updateResponses(notReviewedResponses)
}}
>{`${strings.BUTTON_REVIEW_APPROVE_ALL}(${notReviewedResponses.length})`}</Button>
)}
</Segment>)
}

const Content: React.FC<{
  section: SectionStateNEW
  isEditable: boolean
  structure: FullStructure
}> = ({ section, isEditable, structure }) => {
  const [updateReviewResponse] = useUpdateReviewResponseMutation()

  const updateResponses = async (array: (ReviewResponse | undefined)[]) => {
    array.forEach((reviewResponse) => {
      if (reviewResponse) updateReviewResponse({ variables: { ...reviewResponse } })
    })
  }

  return (
    <>
      {Object.values(section.pages).map(({ name, state }) => {
        const notReviewedResponses = state
          .map((formElement) => formElement.latestOwnedReviewResponse)
          .filter((reviewResponse) => reviewResponse && !reviewResponse?.decision)
        return (
          <Segment key={`ReviewSection_${section.details.code}_${name}`} basic>
            <Header as="h3" style={{ color: 'DarkGrey' }}>
              {name}
            </Header>
            {state.map(({ element, response }) => {
              const summaryViewProps = {
                element,
                response,
                allResponses: structure.responsesByCode || {},
              }
              const reviewResponse = response?.reviewResponse
              console.log(response)
              // if (category === TemplateElementCategory.Question) {
              return (
                
        )
      })}

      <DecisionArea
        state={decisionState}
        setDecision={setDecisionState}
        submitHandler={submitResponseHandler}
        problemMessage={reviewProblem}
        setProblemMessage={setReviewProblem}
      />
    </>
  )
}

const TitleContent: React.FC<{ section: SectionStateNEW; isActive: boolean }> = ({
  section,
  isActive,
}) => {
  const reviewProgress = section.reviewProgress
  return (
    <>
      <Grid columns={3}>
        <Grid.Row>
          <Grid.Column width={6}>
            <Header
              as="h2"
              content={`${section.details.title.toUpperCase()}`}
              style={{ color: 'Grey' }}
            />
          </Grid.Column>
          <Grid.Column width={6}>
            {/* {showError && (
                  <Icon name="exclamation circle" color="red">
                    {messages.REVIEW_COMPLETE_SECTION}
                  </Icon>
                )} */}
          </Grid.Column>
          <Grid.Column width={3}>
            {/*TODO add review progress and assignmnet stuff*/}
            <Container textAlign="right">{`t: ${reviewProgress?.totalReviewable} dC: ${reviewProgress?.doneConform} dNC:  ${reviewProgress?.doneNoneConform} `}</Container>
          </Grid.Column>
          <Grid.Column width={1}>
            <Icon name={isActive ? 'angle up' : 'angle down'} size="large" />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </>
  )
}

export default ReviewPage
