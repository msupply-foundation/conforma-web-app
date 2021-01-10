import React, { useEffect, useState } from 'react'
import {
  Button,
  ButtonProps,
  Container,
  Form,
  Header,
  Message,
  ModalProps,
} from 'semantic-ui-react'
import { SectionSummary, Loading, ModalWarning } from '../../components'
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
import messages from '../../utils/messages'

const ApplicationOverview: React.FC = () => {
  const [sectionsPages, setSectionsAndElements] = useState<SectionStructure>()
  const [isRevalidated, setIsRevalidated] = useState(false)
  const [showModal, setShowModal] = useState<ModalProps>({ open: false })
  const {
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

    // If any invalid responses define first invalid page to re-direct to
    if (!revalidate.allValid) {
      const { firstErrorSectionCode, firstErrorPage } = getFirstErrorLocation(
        revalidate.validityFailures,
        elementsState as ApplicationElementStates
      )
      setShowModal({
        open: true,
        ...messages.SUBMISSION_FAIL,
        onClick: (event: any, data: ButtonProps) => {
          push(`/application/${serialNumber}/${firstErrorSectionCode}/Page${firstErrorPage}`)
          setShowModal({ open: false })
        },
        onClose: () => setShowModal({ open: false }),
      })
    }
    return revalidate.allValid
  }

  const handleSubmit = async () => {
    const allValid = await revalidateAndUpdate()
    if (allValid) {
      await submit()
      push(`/application/${serialNumber}/submission`)
    }
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
          <Button content={strings.BUTTON_APPLICATION_SUBMIT} onClick={handleSubmit} />
        ) : null}
        <ModalWarning showModal={showModal} />
      </Form>
    </Container>
  ) : (
    <Message error header={strings.ERROR_APPLICATION_OVERVIEW} />
  )
}

export default ApplicationOverview
