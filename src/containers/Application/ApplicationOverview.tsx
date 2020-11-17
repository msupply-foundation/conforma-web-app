import React, { useEffect, useState } from 'react'
import { Container, Grid, Header, Label, Loader, Message, Modal, Segment } from 'semantic-ui-react'
import { ApplicationSummary, Loading, ProgressBar } from '../../components'
import { Trigger, useUpdateApplicationMutation } from '../../utils/generated/graphql'
import useGetResponsesAndElementState from '../../utils/hooks/useGetResponsesAndElementState'
import useLoadApplication from '../../utils/hooks/useLoadApplication'
import { useRouter } from '../../utils/hooks/useRouter'
import { ApplicationElementStates, SectionElementStates } from '../../utils/types'

interface SectionGroups {
  [key: string]: ApplicationElementStates
}

const ApplicationOverview: React.FC = () => {
  const [submitted, setSubmitted] = useState(false)
  const [elementsInSections, setElementsInSections] = useState<SectionElementStates[]>()
  const { query, push } = useRouter()
  const { serialNumber } = query

  const { error, loading, templateSections } = useLoadApplication({
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
  })

  useEffect(() => {
    if (!responsesLoading && elementsState) {
      const sectionsAndElements = Object.entries(elementsState).reduce(
        (sectionGroups: SectionGroups, [code, item]) => {
          const group = sectionGroups[item.section] || {}
          group[code] = item
          sectionGroups[item.section] = group
          return sectionGroups
        },
        {}
      )
      console.log(sectionsAndElements)

      // setElementsInSections()
    }
  }, [elementsState, responsesLoading])

  const [applicationSubmitMutation] = useUpdateApplicationMutation({
    onCompleted: () => setSubmitted(true),
  })

  return error || responsesError ? (
    <Message
      error
      header="Problem to load application overview"
      list={[responsesError, error?.message]}
    />
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
