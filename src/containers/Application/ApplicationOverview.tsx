import React, { useEffect, useState } from 'react'
import { Container, Grid, Header, Label, Message, Segment } from 'semantic-ui-react'
import { ApplicationSummary, Loading, ProgressBar } from '../../components'
import { Trigger, useUpdateApplicationMutation } from '../../utils/generated/graphql'
import useGetResponsesAndElementState from '../../utils/hooks/useGetResponsesAndElementState'
import useLoadApplication from '../../utils/hooks/useLoadApplication'
import { useRouter } from '../../utils/hooks/useRouter'
import { SectionElementStates } from '../../utils/types'

const ApplicationOverview: React.FC = () => {
  const [submitted, setSubmitted] = useState(false)
  const [elementsInSections, setElementsInSections] = useState<SectionElementStates[]>()
  const { query, push } = useRouter()
  const { serialNumber } = query

  const { error, loading, templateSections, isReady } = useLoadApplication({
    serialNumber: serialNumber as string,
  })

  const {
    error: responsesError,
    loading: responsesLoading,
    responsesByCode,
    responsesFullByCode,
    elementsState,
  } = useGetResponsesAndElementState({
    serialNumber: serialNumber as string,
    isReady,
  })

  useEffect(() => {
    if (!responsesLoading && elementsState && responsesFullByCode) {
      // Create the arary of sections with array of section's element & responses
      const sectionsAndElements: SectionElementStates[] = templateSections
        .sort((a, b) => a.index - b.index)
        .map((section) => {
          return { section, elements: [] }
        })

      Object.values(elementsState).forEach((element) => {
        const response = responsesFullByCode[element.code]
        const elementAndValue = { element, value: response ? response : null }
        sectionsAndElements[element.section].elements.push(elementAndValue)
      })
      setElementsInSections(sectionsAndElements)
    }
  }, [elementsState, responsesLoading])

  const [applicationSubmitMutation] = useUpdateApplicationMutation({
    onCompleted: () => setSubmitted(true),
  })

  return error ? (
    <Message error header="Problem to load application overview" list={[error]} />
  ) : loading || responsesLoading ? (
    <Loading />
  ) : submitted ? (
    <Container text>
      <Header>Application submitted!</Header>
    </Container>
  ) : serialNumber && elementsInSections ? (
    <Segment.Group>
      <Grid stackable>
        <Grid.Column width={4}>
          <ProgressBar
            serialNumber={serialNumber}
            templateSections={templateSections}
            push={push}
          />
        </Grid.Column>
        <Grid.Column width={12}>
          <ApplicationSummary
            sectionsAndElements={elementsInSections}
            onSubmitHandler={() =>
              applicationSubmitMutation({
                variables: {
                  serial: serialNumber as string,
                  applicationTrigger: Trigger.OnApplicationSubmit,
                },
              })
            }
          />
        </Grid.Column>
      </Grid>
    </Segment.Group>
  ) : (
    <Label content="Application's sections can't be displayed" />
  )
}

export default ApplicationOverview
