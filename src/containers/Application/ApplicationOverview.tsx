import React, { useEffect, useState } from 'react'
import { Button, Container, Header, Loader, Message, Modal } from 'semantic-ui-react'
import { Loading, SectionSummary } from '../../components'
import useListSectionsInSummary from '../../utils/hooks/useListSectionsInSummary'
import useLoadApplication from '../../utils/hooks/useLoadApplication'
import { useRouter } from '../../utils/hooks/useRouter'
import useUpdateApplication from '../../utils/hooks/useUpdateApplication'

const ApplicationOverview: React.FC = () => {
  const [status, setStatus] = useState<string>('')
  const { query, push } = useRouter()
  const { serialNumber } = query

  const { error, loading, templateSections, isApplicationLoaded, appStatus } = useLoadApplication({
    serialNumber: serialNumber as string,
  })

  const { error: errorSections, processing, applicationSections } = useListSectionsInSummary({
    serialNumber: serialNumber as string,
    templateSections,
    isApplicationLoaded,
  })

  const {
    error: submitError,
    processing: processingSubmission,
    submitted,
    submit,
  } = useUpdateApplication({
    applicationSerial: serialNumber as string,
  })

  useEffect(() => {
    if (!appStatus) return
    setStatus(appStatus.status)
  }, [appStatus])

  console.log('isApplicationLoaded', isApplicationLoaded)

  return error ? (
    <Message error header="Problem to load application overview" list={[error]} />
  ) : loading || processing ? (
    <Loading />
  ) : submitError ? (
    <Message error header="Problem to submit application" list={[submitError]} />
  ) : serialNumber && applicationSections ? (
    <Container>
      <SectionSummary sectionsElements={applicationSections} isEditable={status === 'DRAFT'} />
      {status === 'DRAFT' ? <Button content="Submit application" onClick={() => submit()} /> : null}
      {/* <ApplicationSummary
        sectionsAndElements={elementsInSections}
        onSubmitHandler={() => }
        appStatus={appStatus}
      /> */}
      {showProcessingModal(processingSubmission, submitted)}
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
