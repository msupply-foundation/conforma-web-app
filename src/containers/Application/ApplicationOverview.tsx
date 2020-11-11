import React from 'react'
import { Container, Grid, Header, Label, Loader, Message, Modal, Segment } from 'semantic-ui-react'
import { ApplicationSummary, Loading, ProgressBar } from '../../components'
import { Trigger } from '../../utils/generated/graphql'
import useGetResponsesAndElementState from '../../utils/hooks/useGetResponsesAndElementState'
import useLoadApplication from '../../utils/hooks/useLoadApplication'
import { useRouter } from '../../utils/hooks/useRouter'
import useUpdateApplication from '../../utils/hooks/useUpdateApplication'

const ApplicationOverview: React.FC = () => {
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

  const { error: submitError, processing, submitted, submit } = useUpdateApplication({
    applicationSerial: serialNumber as string,
    applicationTrigger: Trigger.OnApplicationSubmit,
  })

  return error || responsesError ? (
    <Message
      error
      header="Problem to load application overview"
      list={[responsesError, error?.message]}
    />
  ) : loading || responsesLoading ? (
    <Loading />
  ) : submitError ? (
    <Message error header="Problem to submit application" list={[submitError]} />
  ) : templateSections && serialNumber && elementsState && responsesFullByCode ? (
    <Container>
      <ApplicationSummary
        templateSections={templateSections}
        elementsState={elementsState}
        responsesByCode={responsesFullByCode}
        onSubmitHandler={() => submit()}
      />
      {showProcessingModal(processing, submitted)}
    </Container>
  ) : (
    <Message error header="Problem to load application overview" />
  )
}

const showProcessingModal = (processing: boolean, submitted: boolean) => {
  return processing ? (
    <Modal basic open={processing} size="mini">
      <Modal.Header>Please wait...</Modal.Header>
      <Modal.Content>
        <Loader>Application is being submitted to the server</Loader>
      </Modal.Content>
    </Modal>
  ) : submitted ? (
    <Container text>
      <Header>Application submitted!</Header>
    </Container>
  ) : null
}

export default ApplicationOverview
