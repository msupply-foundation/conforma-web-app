import React, { useState } from 'react'
import { Container, Grid, Header, Label, Segment } from 'semantic-ui-react'
import { ApplicationSummary, Loading, ProgressBar } from '../../components'
import { Trigger, useUpdateApplicationMutation } from '../../utils/generated/graphql'
import useLoadApplication from '../../utils/hooks/useLoadApplication'
import { useRouter } from '../../utils/hooks/useRouter'

const ApplicationOverview: React.FC = () => {
  const [submitted, setSubmitted] = useState(false)
  const { query } = useRouter()
  const { serialNumber } = query

  const { error, loading, application, templateSections } = useLoadApplication({
    serialNumber: serialNumber as string,
  })

  const [applicationSubmitMutation] = useUpdateApplicationMutation({
    onCompleted: () => setSubmitted(true),
  })

  return error ? (
    <Label content="Problem to load application overview" error={error} />
  ) : loading ? (
    <Loading />
  ) : submitted ? (
    <Container text>
      <Header>Application submitted!</Header>
    </Container>
  ) : application && templateSections && serialNumber ? (
    <Segment.Group>
      <Grid stackable>
        <Grid.Column width={4}>
          <ProgressBar templateSections={templateSections} />
        </Grid.Column>
        <Grid.Column width={12}>
          <ApplicationSummary
            applicationId={application.id as number}
            sections={templateSections}
            onSubmitHandler={() =>
              applicationSubmitMutation({
                variables: {
                  id: application.id as number,
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
