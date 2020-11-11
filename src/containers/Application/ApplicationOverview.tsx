import React, { useState } from 'react'
import { Container, Header, Loader, Message, Modal } from 'semantic-ui-react'
import { ApplicationSummary, Loading } from '../../components'
import { Trigger, useUpdateApplicationMutation } from '../../utils/generated/graphql'
import useGetResponsesAndElementState from '../../utils/hooks/useGetResponsesAndElementState'
import useLoadApplication from '../../utils/hooks/useLoadApplication'
import { useRouter } from '../../utils/hooks/useRouter'

const ApplicationOverview: React.FC = () => {
  const [submitted, setSubmitted] = useState(false)
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
  ) : application && templateSections && serialNumber ? (
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
            templateSections={templateSections}
            elementsState={elementsState}
            responsesByCode={responsesFullByCode}
            onSubmitHandler={() =>
              applicationSubmitMutation({
                variables: {
                  applicationSerial: serialNumber as string,
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
