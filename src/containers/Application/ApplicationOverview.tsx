import React, { useState } from 'react'
import { Container, Header, Label } from 'semantic-ui-react'
import { ApplicationSummary, Loading } from '../../components'
import { Trigger, useUpdateApplicationMutation } from '../../utils/generated/graphql'
import useLoadApplication from '../../utils/hooks/useLoadApplication'
import { useRouter } from '../../utils/hooks/useRouter'

const ApplicationOverview: React.FC = () => {
  const [submitted, setSubmitted] = useState(false)
  const { query } = useRouter()
  const { serialNumber } = query

  const { error, loading, application, templateSections } = useLoadApplication({
    serialNumber: serialNumber as string,
    skip: false,
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
  ) : application && serialNumber ? (
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
  ) : (
    <Label content="Application's sections can't be displayed" />
  )
}

export default ApplicationOverview
