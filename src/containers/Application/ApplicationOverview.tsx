import React, { useEffect, useState } from 'react'
import { Button, Container, Form, Header, Loader, Message, Modal } from 'semantic-ui-react'
import { SectionSummary, Loading } from '../../components'
import strings from '../../utils/constants'
import buildSectionsStructure from '../../utils/helpers/buildSectionsStructure'
import useGetResponsesAndElementState from '../../utils/hooks/useGetResponsesAndElementState'
import useLoadApplication from '../../utils/hooks/useLoadApplication'
import { useRouter } from '../../utils/hooks/useRouter'
import useUpdateApplication from '../../utils/hooks/useUpdateApplication'
import { useUserState } from '../../contexts/UserState'
import {
  ApplicationElementStates,
  SectionStructure,
  ResponsesByCode,
  User,
} from '../../utils/types'
import { revalidateAll, getFirstErrorLocation } from '../../utils/helpers/revalidateAll'
import { useUpdateResponseMutation } from '../../utils/generated/graphql'
import useGetApplicationStatus from '../../utils/hooks/useGetApplicationStatus'

const ApplicationOverview: React.FC = () => {
  const [sectionsPages, setSectionsAndElements] = useState<SectionStructure>()
  const [isRevalidated, setIsRevalidated] = useState(false)
  const {
    logout,
    userState: { currentUser },
  } = useUserState()

  const { query, push } = useRouter()
  const { serialNumber } = query
  const { error, loading, templateSections, isApplicationLoaded } = useLoadApplication({
    serialNumber: serialNumber as string,
  })

  const { error: statusError, loading: statusLoading, appStatus } = useGetApplicationStatus({
    serialNumber: serialNumber as string,
    isApplicationLoaded,
  })

  const {
    error: responsesError,
    loading: responsesLoading,
    responsesByCode,
    elementsState,
  } = useGetResponsesAndElementState({
    serialNumber: serialNumber as string,
    isApplicationLoaded,
  })

  const { error: submitError, processing, submitted, submit } = useUpdateApplication({
    serialNumber: serialNumber as string,
  })

  const [responseMutation] = useUpdateResponseMutation()

  useEffect(() => {
    // Fully re-validate on page load
    if (!appStatus) return
    if (appStatus?.status !== 'DRAFT' && appStatus?.status !== 'CHANGES_REQUIRED') {
      // Show summary, even if it no longer validates, as it would
      // have been valid when submitted.
      setIsRevalidated(true)
      return
    }
    if (isApplicationLoaded && elementsState && responsesByCode) {
      revalidateAndUpdate().then(() => setIsRevalidated(true))
    }
  }, [responsesByCode, elementsState])

  useEffect(() => {
    if (!responsesLoading && elementsState && responsesByCode) {
      const sectionsStructure = buildSectionsStructure({
        templateSections,
        elementsState,
        responsesByCode,
      })

      setSectionsAndElements(sectionsStructure)
    }
  }, [elementsState, responsesLoading])

  const revalidateAndUpdate = async () => {
    const revalidate = await revalidateAll(
      elementsState as ApplicationElementStates,
      responsesByCode as ResponsesByCode,
      currentUser as User
    )

    // Update database if validity changed
    revalidate.validityFailures.forEach((changedElement) => {
      responseMutation({
        variables: {
          id: changedElement.id,
          isValid: changedElement.isValid,
        },
      })
    })

    // If invalid responses, re-direct to first invalid page
    if (!revalidate.allValid) {
      console.log('Some responses invalid')
      const { firstErrorSectionCode, firstErrorPage } = getFirstErrorLocation(
        revalidate.validityFailures,
        elementsState as ApplicationElementStates
      )
      // TO-DO: Alert user of Submit failure
      push(`/application/${serialNumber}/${firstErrorSectionCode}/Page${firstErrorPage}`)
    }
  }

  const handleSubmit = async () => {
    await revalidateAndUpdate()
    // All OK -- would have been re-directed otherwise:
    submit()
    if (currentUser?.username === 'nonRegistered') {
      logout()
    }
    push(`/application/${serialNumber}/submission`)
  }

  return error || statusError ? (
    <Message error header={strings.ERROR_APPLICATION_OVERVIEW} list={[error, statusError]} />
  ) : loading || statusLoading || responsesLoading ? (
    <Loading />
  ) : submitError ? (
    <Message error header={strings.ERROR_APPLICATION_SUBMIT} list={[submitError]} />
  ) : serialNumber && appStatus && sectionsPages && isRevalidated ? (
    <Container>
      <Header as="h1" content={strings.TITLE_APPLICATION_SUBMIT} />
      <Form>
        {sectionsPages.map((sectionPages) => (
          <SectionSummary
            key={`SecSummary_${sectionPages.section.code}`}
            sectionPages={sectionPages}
            serialNumber={serialNumber}
            allResponses={responsesByCode || {}}
            canEdit={appStatus.status === 'DRAFT'}
          />
        ))}
        {appStatus.status === 'DRAFT' ? (
          <Button content={strings.BUTTON_SUBMIT} onClick={handleSubmit} />
        ) : null}
        {showProcessingModal(processing, submitted)}
      </Form>
    </Container>
  ) : (
    <Message error header={strings.ERROR_APPLICATION_OVERVIEW} />
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
