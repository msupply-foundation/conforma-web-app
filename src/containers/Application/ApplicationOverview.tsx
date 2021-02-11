import React, { useEffect, useState } from 'react'
import { Button, Container, Form, Header, Message, ModalProps } from 'semantic-ui-react'
import { SectionSummary, Loading, ModalWarning, NoMatch } from '../../components'
import strings from '../../utils/constants'
import { useRouter } from '../../utils/hooks/useRouter'
import useSubmitApplication from '../../utils/hooks/useSubmitApplication'
import { useUserState } from '../../contexts/UserState'
import { EvaluatedSections, SectionsStructure, User } from '../../utils/types'
import { useUpdateResponseMutation } from '../../utils/generated/graphql'
import messages from '../../utils/messages'
import useLoadSectionsStructure from '../../utils/hooks/useLoadSectionsStructure'
import useRevalidateApplication from '../../utils/hooks/useRevalidateApplication'
import checkIsCompleted from '../../utils/helpers/application/checkIsCompleted'

const ApplicationOverview: React.FC = () => {
  const [isRevalidated, setIsRevalidated] = useState(false)
  const [isSubmittedClicked, setIsSubmittedClicked] = useState(false)
  const [isProcessingSubmission, setIsProcessingSubmission] = useState(false)
  const [showModal, setShowModal] = useState<ModalProps>({ open: false })
  const { query, push } = useRouter()
  const { serialNumber } = query
  const {
    logout,
    userState: { currentUser },
  } = useUserState()

  const {
    error,
    application,
    allResponses,
    sectionsStructure,
    isApplicationReady,
  } = useLoadSectionsStructure({
    serialNumber: serialNumber as string,
    currentUser: currentUser as User,
    networkFetch: true,
  })

  const { evaluatedSections, isProcessing } = useRevalidateApplication({
    serialNumber: serialNumber as string,
    currentUser: currentUser as User,
    sectionsStructure: sectionsStructure as SectionsStructure,
    isApplicationReady,
    isRevalidated,
    setIsRevalidated,
  })

  const [responseMutation] = useUpdateResponseMutation()

  const { error: submitError, processing, submitted, submit } = useSubmitApplication({
    serialNumber: serialNumber as string,
    currentUser: currentUser as User,
  })

  const waitSubmissionCompletion = async () => {
    // TODO: Needs to be fixed
    await submit()
    if (currentUser?.username === strings.USER_NONREGISTERED) {
      logout()
    }
    push(`/application/${serialNumber}/submission`)
  }

  useEffect(() => {
    if (!isSubmittedClicked || !evaluatedSections) return
    const { sectionsWithProgress, elementsToUpdate } = evaluatedSections as EvaluatedSections
    const { isCompleted, firstIncompleteLocation } = checkIsCompleted(sectionsWithProgress)
    if (isCompleted) {
      waitSubmissionCompletion()
    } else {
      elementsToUpdate.forEach((updateElement) =>
        responseMutation({ variables: { ...updateElement } })
      )
      setShowModal({
        open: true,
        ...messages.SUBMISSION_FAIL,
        onClick: () => {
          if (firstIncompleteLocation) {
            const code = firstIncompleteLocation
            const { progress } = sectionsWithProgress[code]
            push(`/application/${serialNumber}/${code}/Page${progress?.linkedPage || 1}`)
          }
          setShowModal({ open: false })
        },
        onClose: () => setShowModal({ open: false }),
      })
    }
  }, [evaluatedSections, isProcessingSubmission, isRevalidated])

  const handleSubmit = () => {
    setIsSubmittedClicked(true)
    setIsProcessingSubmission(true)
  }

  return error ? (
    <NoMatch />
  ) : !isApplicationReady || isProcessing ? (
    <Loading />
  ) : submitError ? (
    <Message error header={strings.ERROR_APPLICATION_SUBMIT} list={[submitError]} />
  ) : serialNumber && application && sectionsStructure && isRevalidated ? (
    <Container>
      <Header as="h1" content={strings.TITLE_APPLICATION_SUBMIT} />
      <Form>
        {Object.values(sectionsStructure).map((sectionPages) => (
          <SectionSummary
            key={`ApplicationSection_${sectionPages.details.code}`}
            sectionPages={sectionPages}
            serialNumber={serialNumber}
            allResponses={allResponses || {}}
            canEdit={application.stage?.status === 'DRAFT'}
          />
        ))}
        {application.stage?.status === 'DRAFT' ? (
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
